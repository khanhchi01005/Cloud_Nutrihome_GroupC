import streamlit as st
import plotly.graph_objects as go
import json
import requests
from datetime import datetime, timedelta
import calendar
from config import BACKEND_API

#History:
get_all_api = BACKEND_API + "/api/personal/history"
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

        date1 = ["Today", "Yesterday", "theDayBefore"]
        def get_last_three_dates():
            today = datetime.now()
            date_list = []
            for i in range(3):
                past_day = today - timedelta(days=i)
                date_list.append(past_day.strftime("%Y-%m-%d"))  # Format as "Y-m-d"
            return date_list

        date2 = get_last_three_dates()
        print(date2)
        meal = ["Breakfast", "Lunch", "Dinner"]
        for i, day in enumerate(date1):
            response_day = response.json()["data"]
            st.session_state.history[day]["Carbs"] = response_day[date2[i]]["carbs"]
            st.session_state.history[day]["Protein"] = response_day[date2[i]]["protein"]
            st.session_state.history[day]["Fat"] = response_day[date2[i]]["fat"]
            st.session_state.history[day]["Calories"] = response_day[date2[i]]["calories"]

            for j, meal_inf in enumerate(meal):
                st.session_state.history[day][meal_inf]["listOfFoods"] = response_day[date2[i]]["meals"][meal_inf.lower()]

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
        for idx in range(0, len(st.session_state.history[day][meal]["listOfFoods"]), 2):
            c1, c2 = st.columns(2)
            food1 = st.session_state.history[day][meal]["listOfFoods"][idx]
            with c1:
                with st.container(border=True):
                    col1, col2 = st.columns([20, 45], vertical_alignment="center")
                    with col2:
                        st.write(f"**{food1}**")

            if idx + 1 < len(st.session_state.history[day][meal]["listOfFoods"]):
                food2 = st.session_state.history[day][meal]["listOfFoods"][idx + 1]
                with c2:
                    with st.container(border=True):
                        col1, col2 = st.columns([20, 45], vertical_alignment="center")
                        with col2:
                            st.write(f"**{food2}**")

st.title("History")
st.write("NutriHome cung cấp tính năng ghi lại mọi món ăn trong ngày, bao gồm bữa chính tại nhà, bữa ăn ngoài và món ăn vặt. Người dùng có thể dễ dàng theo dõi chế độ ăn uống của mình bằng cách nhập dữ liệu hoặc chụp hóa đơn, giúp người dùng nắm bắt tình trạng dinh dưỡng và điều chỉnh thói quen ăn uống cho phù hợp với sức khỏe của từng thành viên trong gia đình.")

st.text('')
st.subheader("Thống kê hàm lượng dinh dưỡng", divider="gray")
# Tên các cột
categories = ['Hôm nay', 'Hôm qua', 'Hôm kia']
# Dữ liệu cho 3 thành phần
component1 = [st.session_state.history["Today"]["Carbs"],
              st.session_state.history["Yesterday"]["Carbs"],
              st.session_state.history["theDayBefore"]["Carbs"]]
component2 = [st.session_state.history["Today"]["Fat"],
              st.session_state.history["Yesterday"]["Fat"],
              st.session_state.history["theDayBefore"]["Fat"]]
component3 = [st.session_state.history["Today"]["Protein"],
              st.session_state.history["Yesterday"]["Protein"],
              st.session_state.history["theDayBefore"]["Protein"]]

# Tạo biểu đồ cột chồng
fig = go.Figure(data=[
    go.Bar(name='Carbs', x=categories, y=component1, text=component1, texttemplate='%{text:.2f}', textposition='inside', marker_color='#FFCC00', textfont=dict(color='white', size=14)),
    go.Bar(name='Fat', x=categories, y=component2, text=component2, texttemplate='%{text:.2f}', textposition='inside', marker_color='#66b3ff', textfont=dict(color='white', size=14)),
    go.Bar(name='Protein', x=categories, y=component3, text=component3, texttemplate='%{text:.2f}', textposition='inside', marker_color='#9933CC', textfont=dict(color='white', size=14))
])

# Đặt chế độ hiển thị thành cột chồng
fig.update_layout(barmode='stack')

# Hiển thị biểu đồ trên Streamlit
st.plotly_chart(fig)

st.text('')
st.subheader("Lịch sử ăn uống", divider="gray")

tab1, tab2, tab3 = st.tabs(["**Hôm nay**", "**Hôm qua**", "**Hôm kia**"])

with tab1:
    # with st.expander("**Tổng lượng dưỡng chất từ bữa ăn**"):
    #     display_nutrition_chart("Today")
        
    st.header("Bạn đã ăn:")
    breakFast, lunch, dinner = st.tabs(["Bữa sáng", "Bữa trưa", "Bữa tối"])

    with breakFast:
        st.subheader("Bữa sáng:")
        display_meal("Breakfast", "Today")
                        
    with lunch:
        st.subheader("Bữa trưa:")
        display_meal("Lunch", "Today")

    with dinner:
        st.subheader("Bữa tối:")
        display_meal("Dinner", "Today")

with tab2:
    # with st.expander("**Tổng lượng dưỡng chất từ bữa ăn**"):
    #     display_nutrition_chart("Yesterday")
        
    st.header("Bạn đã ăn:")
    breakFast, lunch, dinner = st.tabs(["Bữa sáng", "Bữa trưa", "Bữa tối"])

    with breakFast:
        st.subheader("Bữa sáng:")
        display_meal("Breakfast", "Yesterday")
                        
    with lunch:
        st.subheader("Bữa trưa:")
        display_meal("Lunch", "Yesterday")

    with dinner:
        st.subheader("Bữa tối:")
        display_meal("Dinner", "Yesterday")

with tab3:
    # with st.expander("**Tổng lượng dưỡng chất từ bữa ăn**"):
    #     display_nutrition_chart("theDayBefore")
        
    st.header("Bạn đã ăn:")
    breakFast, lunch, dinner = st.tabs(["Bữa sáng", "Bữa trưa", "Bữa tối"])

    with breakFast:
        st.subheader("Bữa sáng:")
        display_meal("Breakfast", "theDayBefore")
                        
    with lunch:
        st.subheader("Bữa trưa:")
        display_meal("Lunch", "theDayBefore")

    with dinner:
        st.subheader("Bữa tối:")
        display_meal("Dinner", "theDayBefore")