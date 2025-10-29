import streamlit as st
import pandas as pd
from flask import Blueprint,request,jsonify
import plotly.graph_objects as go
import requests
import json
from config import BACKEND_API

if "isSearch" not in st.session_state:
    st.session_state.isSearch = False

if "search_food_name" not in st.session_state:
    st.session_state.search_food_name = ""

# Đổi trạng thái khi nhấn nút
def toggle_favorite():
    st.session_state.favorite = not st.session_state.favorite

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

        c1, c2 = st.columns([1, 1])
        with c1:
            if st.button("Thêm món", use_container_width=True, type='primary'):
                get_all_api = BACKEND_API + "/api/recipes/add-to-today-menu"
                response = requests.post(
                        get_all_api,
                        data=json.dumps(
                            {
                                "user_id": f"{st.session_state.user["id"]}",
                                "recipe_id": f"{id}",
                                "meal": st.session_state.meal.lower()
                            }
                        ),
                        headers = {'Content-Type': 'application/json',}
                    )
                print(response.status_code)
                if response.status_code == 200:
                    st.rerun()
        with c2:
            if st.button("Xóa món", use_container_width=True):
                get_all_api = BACKEND_API + "/api/recipes/remove-from-today-menu"
                response = requests.delete(
                        get_all_api,
                        data=json.dumps(
                            {
                                "user_id": f"{st.session_state.user["id"]}",
                                "recipe_id": f"{id}",
                                "meal": st.session_state.meal.lower()
                            }
                        ),
                        headers = {'Content-Type': 'application/json',}
                    )
                print(response.status_code)
                if response.status_code == 200:
                    st.rerun()

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

def food_brief():
    for idx in range(0, len(st.session_state.searchingList), 3):
        c1, c2, c3 = st.columns(3)
        
        # Column 1
        if idx < len(st.session_state.searchingList):
            with c1:
                with st.container(border=True):
                    food = st.session_state.searchingList[idx]
                    with st.container(height=150, border=False):
                        st.image(food["image"], use_container_width=True)
                    with st.container(height=50, border=False):
                        st.write(f"**{food['name']}**")
                    st.write(f"**Thời gian nấu**: {food['cooking_time']} phút")
                    display_rating(food["rating"])
                    if st.button("Chi tiết", use_container_width=True, key=f"{food['id']}_details"):
                        details(food["id"])

        # Column 2
        if idx + 1 < len(st.session_state.searchingList):
            with c2:
                with st.container(border=True):
                    food = st.session_state.searchingList[idx + 1]
                    with st.container(height=150, border=False):
                        st.image(food["image"], use_container_width=True)
                    with st.container(height=50, border=False):
                        st.write(f"**{food['name']}**")
                    st.write(f"**Thời gian nấu**: {food['cooking_time']} phút")
                    display_rating(food["rating"])
                    if st.button("Chi tiết", use_container_width=True, key=f"{food['id']}_details"):
                        details(food["id"])

        # Column 3
        if idx + 2 < len(st.session_state.searchingList):
            with c3:
                with st.container(border=True):
                    food = st.session_state.searchingList[idx + 2]
                    with st.container(height=150, border=False):
                        st.image(food["image"], use_container_width=True)
                    with st.container(height=50, border=False):
                        st.write(f"**{food['name']}**")
                    st.write(f"**Thời gian nấu**: {food['cooking_time']} phút")
                    display_rating(food["rating"])
                    if st.button("Chi tiết", use_container_width=True, key=f"{food['id']}_details"):
                        details(food["id"])

def display_rating(rating):
    # Display rating with stars based on rating value
    stars = "⭐" * int(rating)
    half_star = "⭐" if rating % 1 >= 0.5 else ""
    st.write(f"**Đánh giá:**")
    st.write(f"{stars}{half_star} ({rating} / 5.0)")

st.title("Recipes")
st.write("NutriHome đồng hành với người dùng như một người bạn cùng nhau chia sẻ những “bí kíp” nấu ăn đảm bảo sức khỏe nhưng không kém phần hấp dẫn. Các công thức chế biến món ăn được lựa chọn từ những nguồn uy tín như Kitchen Stories, Tasty, All recipes, Cookyvn sẽ được NutriHome trình bày dưới dạng hình ảnh bắt mắt cùng với những tóm tắt ngắn gọn, xúc tích nhằm đảm bảo bất kỳ người dùng nào cũng có thể trở thành những “bậc thầy làng bếp” xuất sắc.")

with st.container(border=True):
    st.subheader("Search")
    col1, col2, col3 = st.columns([70, 15, 15])
    with col1:
        st.session_state.search_food_name = st.text_input("Searching bar", label_visibility="collapsed")
    with col2:
        search = st.button("Tìm kiếm", use_container_width=True)
        if search:
            st.session_state.isSearch = True
            st.rerun()
    with col3:
        if st.button("Reset", use_container_width=True):
            st.session_state.isSearch = False
            st.rerun()

st.subheader("List of foods", divider="grey")

if st.session_state.isSearch:
    st.write("**You are searching**")
    get_all_api = BACKEND_API + "/api/recipes/search-by-name"
    response = requests.get(get_all_api, data=json.dumps({"recipe_name": st.session_state.search_food_name}), headers = {
        'Content-Type': 'application/json',
    })
    print(response.status_code)
    print(response.json())

    st.session_state.searchingList =  response.json()
    food_brief()

else:
    get_all_api = BACKEND_API + "/api/recipes"
    response = requests.get(get_all_api)
    print(response.status_code)
    print(response.json())

    st.session_state.searchingList =  response.json()['data']
    
    food_brief()