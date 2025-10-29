import streamlit as st
import plotly.graph_objects as go
from PIL import Image
import os
import json
import requests
from config import BACKEND_API

#Weekly menu:
get_all_api = BACKEND_API + "/api/weekly_menu"
response = requests.get(
        get_all_api,
        data=json.dumps(
            {
                "user_id": st.session_state.user["id"]
            }
        ),
        headers = {'Content-Type': 'application/json',}
    )

if response.status_code == 200:
        date1 = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        date2 = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
        meal = ["Breakfast", "Lunch", "Dinner"]
        for i, day in enumerate(date1):
            for j, meal_type in enumerate(meal):
                st.session_state.weekly_menu[day][meal_type]["listOfFoods"] = response.json()["data"]["menu"][date2[i]][meal_type.lower()]

# Tổng calo trong ngày
get_all_api = BACKEND_API + "/api/weekly_menu/calories"
response = requests.get(
        get_all_api,
        data=json.dumps(
            {
                "user_id": st.session_state.user["id"]
            }
        ),
        headers = {'Content-Type': 'application/json',}
    )
print(response.status_code)
if response.status_code == 200:
    st.session_state.today_nutrients["Carbs"] = response.json()["data"]["carbs"]
    st.session_state.today_nutrients["Protein"] = response.json()["data"]["protein"]
    st.session_state.today_nutrients["Fat"] = response.json()["data"]["fat"]
    st.session_state.today_nutrients["Calories"] = response.json()["data"]["calories"]

# Hàm tạo các mục trong bữa ăn
@st.dialog("Chi tiết món ăn", width="large")
def details(id):
    get_all_api = BACKEND_API + "/api/recipes/detail"
    response = requests.get(get_all_api, data=json.dumps({"recipe_id": id}), headers = {
        'Content-Type': 'application/json',
    })
    print(response.status_code)
    print(response.json())

    st.session_state.food_details =  response.json()["data"]

    st.header(st.session_state.food_details["name"], divider="grey")
    col1, col2 = st.columns([35,65])

    with col1:
        st.image(st.session_state.food_details["image"], use_container_width=True)

        rating = st.session_state.food_details["rating"]
        if rating < 1.5:
            with st.container(border=True):
                st.write("**Đánh giá**" + ": ⭐ ")
                st.write(f"({rating} / 5.0)")
        elif rating >= 1.5 and rating < 2.5:
            with st.container(border=True):
                st.write("**Đánh giá**" + ": ⭐⭐ ")
                st.write(f"({rating} / 5.0)")
        elif rating >= 2.5 and rating < 3.5:
            with st.container(border=True):
                st.write("**Đánh giá**" + ": ⭐⭐⭐ ")
                st.write(f"({rating} / 5.0)")
        elif rating >= 3.5 and rating < 4.5:
            with st.container(border=True):
                st.write("**Đánh giá**" + ": ⭐⭐⭐⭐ ")
                st.write(f"({rating} / 5.0)")
        elif rating > 4.5:
            with st.container(border=True):
                st.write("**Đánh giá**" + ": ⭐⭐⭐⭐⭐ ")
                st.write(f"({rating} / 5.0)")

        rating =  st.button("Rating", use_container_width=True)
        if rating:
            with st.form("Rating"):
                sentiment_mapping = ["one", "two", "three", "four", "five"]
                selected = st.feedback("stars")
                st.form_submit_button('Submit', type='primary')

        # Dữ liệu cho biểu đồ tròn
        labels = ['Carbs', 'Fats', 'Protein']
        values = [st.session_state.food_details["carbs"], st.session_state.food_details["fat"], st.session_state.food_details["protein"]]

        st.write("**Chi tiết dinh dưỡng**")
        # Tạo biểu đồ tròn với plotly
        fig = go.Figure(data=[go.Pie(labels=labels, values=values)])
        # Tùy chỉnh biểu đồ tròn
        fig.update_traces(
            hoverinfo='label+percent',
            textinfo='label+percent',  # Chỉ hiển thị tên thành phần
            textfont=dict(size=10, color='white', family='Arial Black'),
            marker=dict(colors=['#FFCC00', '#66b3ff', '#9933CC']),  # Màu sắc cho các thành phần
            showlegend=False
        )
        fig.update_layout(
            margin=dict(t=10, b=10, l=10, r=10),
            width=300,  # Độ rộng biểu đồ
            height=300  # Độ cao biểu đồ
        )
        # Hiển thị biểu đồ trong Streamlit
        st.plotly_chart(fig)

        with st.container(border=True):
            c1, c2 = st.columns([6, 4])

            with c1:
                st.write("Total calories")
                st.write("Carbs")
                st.write("Fat")
                st.write("Protein")

            with c2:
                st.write(f"{st.session_state.food_details["calories"]} cals")
                st.write(f"{st.session_state.food_details["carbs"]} g")
                st.write(f"{st.session_state.food_details["fat"]} g")
                st.write(f"{st.session_state.food_details["protein"]} g")

    with col2:
        with st.container(border=True):
            st.write("**Thời gian nấu**" + f": {st.session_state.food_details["cooking_time"]} phút")

            st.text("")

            st.subheader("Nguyên liệu")
            for idx, ingredients in enumerate(st.session_state.food_details["ingredients"]):
                st.write(f" - {ingredients["name"]} {ingredients["quantity"]} {ingredients["unit"]}")
            
            st.text("")
            
            st.subheader("Cách làm")
            for idx, steps in enumerate(st.session_state.food_details["steps"]):
                st.write(f" - {steps}")
            # Video
            # st.markdown("[Xem hướng dẫn chi tiết qua video](https://youtu.be/QJZUwiJhKZ0?si=IO1AvQjjiCk6GzLO)")

@st.dialog("Quét hóa đơn")
def billScanning(day, meal_type):
    uploaded_image = st.file_uploader("Hóa đơn", type=["jpg", "jpeg", "png"])
    if uploaded_image is not None:
        image = Image.open(uploaded_image).convert("RGB")
        st.image(image, use_container_width=True)
    if st.button("Quét hóa đơn", type='primary', use_container_width=True):
        bill_dir = os.path.join("images/bills", st.session_state.user["username"])
        os.makedirs(bill_dir, exist_ok=True)  # Creates folder if it doesn't exist
                    
        # Save avatar in the user directory
        avatar_path = os.path.join(bill_dir, "bill.jpg")
        avatar_image = Image.open(uploaded_image)
        avatar_image.convert("RGB").save(avatar_path, "JPEG")
        get_all_api = BACKEND_API + "/api/weekly_menu/upload"
        response = requests.post(
                get_all_api,
                data=json.dumps(
                    {
                        "user_id": f"{st.session_state.user["id"]}",
                        "image_path" :f"C:/Users/Admin/Desktop/NutriHome/frontend/images/bills/{st.session_state.user["username"]}/bill.jpg",
                        "meal": meal_type.lower()
                    }
                ),
                headers = {'Content-Type': 'application/json',}
            )
        print(response.status_code)
        if response.status_code == 200:
            st.session_state.weekly_menu[day][meal_type]["listOfFoods"].extend(response.json()["listOfFood"])
        st.rerun()

# Hàm để hiển thị biểu đồ tròn và chi tiết dinh dưỡng
def display_nutrition_chart():
    col1, col2 = st.columns([1, 1], vertical_alignment='center')
    with col1:
        labels = ['Carbs', 'Fats', 'Protein']
        values = [st.session_state.today_nutrients["Carbs"], st.session_state.today_nutrients["Fat"], st.session_state.today_nutrients["Protein"]]
        fig = go.Figure(data=[go.Pie(labels=labels, values=values)])
        fig.update_traces(
            hoverinfo='label+percent',
            textinfo='label+percent',
            textfont=dict(size=15, color='white', family='Arial Black'),
            marker=dict(colors=['#FFCC00', '#66b3ff', '#9933CC']),
            showlegend=False
        )
        fig.update_layout(margin=dict(t=10, b=10, l=10, r=10), width=700, height=280)
        st.plotly_chart(fig, use_container_width=True)

    with col2:
        st.write("**Chi tiết**")
        with st.container(border=True):
            c1, c2 = st.columns([6, 4])
            with c1:
                st.write("Total calories")
                st.write("Carbs")
                st.write("Fat")
                st.write("Protein")
            with c2:
                st.write(f"{st.session_state.today_nutrients["Calories"]} calories")
                st.write(f"{st.session_state.today_nutrients["Carbs"]} g")
                st.write(f"{st.session_state.today_nutrients["Protein"]} g")
                st.write(f"{st.session_state.today_nutrients["Fat"]} g")

# Hàm hiển thị từng món ăn trong bữa
def display_meal(meal, day):
        for idx in range(0, len(st.session_state.weekly_menu[day][meal]["listOfFoods"]), 2):
            c1, c2 = st.columns(2)
            food1 = st.session_state.weekly_menu[day][meal]["listOfFoods"][idx]
            with c1:
                with st.container(border=True):
                    col1, col2, col3 = st.columns([20, 45, 25], vertical_alignment="center")
                    with col1:
                        with st.container(height=50, border=False):
                            st.image(food1["image"], use_container_width=True)
                    with col2:
                        st.write(f"**{food1["name"]}**")
                    with col3:
                        # Using an f-string for the key with escaped quotes
                        if st.button("Chi tiết", key=f"{day}_{meal}_{food1['name']}_{idx}"):
                            details(food1["recipe_id"])

            if idx + 1 < len(st.session_state.weekly_menu[day][meal]["listOfFoods"]):
                food2 = st.session_state.weekly_menu[day][meal]["listOfFoods"][idx + 1]
                with c2:
                    with st.container(border=True):
                        col1, col2, col3 = st.columns([20, 45, 25], vertical_alignment="center")
                        with col1:
                            with st.container(height=50, border=False):
                                st.image(food2["image"], use_container_width=True)
                        with col2:
                            st.write(f"**{food2["name"]}**")
                        with col3:
                            # Using an f-string for the key with escaped quotes
                            if st.button("Chi tiết", key=f"{day}_{meal}_{food2['name']}_{idx + 1}"):
                                details(food2["recipe_id"])

st.title("Weekly Menu")
st.write("NutriHome cung cấp tính năng xây dựng thực đơn cá nhân hóa hàng tuần dựa trên dữ liệu như chiều cao, cân nặng, và tình trạng sức khỏe của cá nhân. Hệ thống sử dụng dữ liệu dinh dưỡng đáng tin cậy từ USDA Food Data Central, giúp đảm bảo sự chính xác về hàm lượng dinh dưỡng trong các món ăn.")

with st.expander("**Tổng lượng dưỡng chất từ bữa ăn**"):
    display_nutrition_chart()
# Tên các ngày trong tuần
days_of_week = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"]

# Tạo các tab cho mỗi ngày
tabs = st.tabs([f"**{day}**" for day in days_of_week])

# Vòng lặp qua từng tab với từng ngày
for day, day_tab in zip(days_of_week, tabs):
    if day == "Thứ Hai":
        day = "Monday"
    elif day == "Thứ Ba":
        day = "Tuesday"
    elif day == "Thứ Tư":
        day = "Wednesday"
    elif day == "Thứ Năm":
        day = "Thursday"
    elif day == "Thứ Sáu":
        day = "Friday"
    elif day == "Thứ Bảy":
        day = "Saturday"
    elif day == "Chủ Nhật":
        day = "Sunday"

    with day_tab:
        col1, col2 = st.columns([50, 50])
        with col1:
                        if st.session_state.weekly_menu[st.session_state.day_of_week][st.session_state.meal]["eaten"] == 0:
                            if st.button("Đã ăn bữa này", key=f"eaten{day}", type='primary', use_container_width=True):
                                get_all_api = BACKEND_API + "/api/menu/eaten"
                                response = requests.post(
                                        get_all_api,
                                        data=json.dumps(
                                            {
                                                "user_id": f"{st.session_state.user["id"]}",
                                                "meal": st.session_state.meal.lower()
                                            }
                                        ),
                                        headers = {'Content-Type': 'application/json',}
                                    )
                                print(response.status_code)
                                if response.status_code == 200:
                                    st.session_state.weekly_menu[st.session_state.day_of_week][st.session_state.meal]["eaten"] = 1
                                    st.rerun()
                        else:
                            st.button("Đã ăn bữa này", key=f"eaten{day}", use_container_width=True, disabled=True)
        with col2:
                        if st.button("Quét hóa đơn cho bữa này", key=f"Scan_Bill{day}", use_container_width=True):
                            billScanning(st.session_state.day_of_week, st.session_state.meal)    
        st.header("Thực đơn của gia đình bạn là:")
        breakFast, lunch, dinner = st.tabs(["Bữa sáng", "Bữa trưa", "Bữa tối"])

        with breakFast:
            st.subheader("Bữa sáng:")
            display_meal("Breakfast", day)
                        
        with lunch:
            st.subheader("Bữa trưa:")
            display_meal("Lunch", day)

        with dinner:
            st.subheader("Bữa tối:")
            display_meal("Dinner", day)