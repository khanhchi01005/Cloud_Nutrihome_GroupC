import streamlit as st
import plotly.express as px
import plotly.graph_objects as go
import requests
import json
from config import BACKEND_API

# ==========================
# Helpers & Constants
# ==========================
def toggle_favorite():
    """Đổi trạng thái yêu thích."""
    st.session_state.favorite = not st.session_state.favorite


def get_api_data(endpoint: str, payload: dict):
    """Gửi request GET tới backend."""
    try:
        response = requests.get(
            f"{BACKEND_API}{endpoint}",
            data=json.dumps(payload),
            headers={"Content-Type": "application/json"}
        )
        return response.json() if response.status_code == 200 else None
    except Exception as e:
        st.error(f"⚠️ API error: {e}")
        return None


# ==========================
# Dialog: Chi tiết món ăn
# ==========================
@st.dialog("Chi tiết món ăn", width="large")
def details(recipe_id: int):
    data = get_api_data("/api/recipes/detail", {"recipe_id": recipe_id})
    if not data:
        st.error("Không lấy được thông tin món ăn.")
        return

    food = data["data"]
    st.session_state.food_details = food
    st.header(food["name"], divider="grey")

    col1, col2 = st.columns([35, 65])
    with col1:
        st.image(food["image"], use_container_width=True)
        render_rating(food["rating"])
        render_nutrition_chart(food)

    with col2:
        st.container(border=True)
        st.write(f"**Thời gian nấu:** {food['cooking_time']} phút")
        render_ingredients(food)
        render_steps(food)


def render_rating(rating: float):
    """Hiển thị đánh giá sao."""
    stars = "⭐" * round(rating)
    with st.container(border=True):
        st.write(f"**Đánh giá:** {stars}")
        st.write(f"({rating} / 5.0)")


def render_nutrition_chart(food):
    """Vẽ biểu đồ dinh dưỡng."""
    labels = ["Carbs", "Fats", "Protein"]
    values = [food["carbs"], food["fat"], food["protein"]]

    fig = go.Figure(data=[go.Pie(labels=labels, values=values)])
    fig.update_traces(
        hoverinfo="label+percent",
        textinfo="label+percent",
        textfont=dict(size=10, color="white", family="Arial Black"),
        marker=dict(colors=["#FFCC00", "#66b3ff", "#9933CC"]),
        showlegend=False,
    )
    fig.update_layout(margin=dict(t=10, b=10, l=10, r=10), width=300, height=300)
    st.write("**Chi tiết dinh dưỡng**")
    st.plotly_chart(fig)

    with st.container(border=True):
        col1, col2 = st.columns([6, 4])
        with col1:
            st.write("Total calories")
            st.write("Carbs")
            st.write("Fat")
            st.write("Protein")
        with col2:
            st.write(f"{food['calories']} cals")
            st.write(f"{food['carbs']} g")
            st.write(f"{food['fat']} g")
            st.write(f"{food['protein']} g")


def render_ingredients(food):
    """Hiển thị nguyên liệu."""
    st.subheader("Nguyên liệu")
    for i in food["ingredients"]:
        st.write(f" - {i['name']} {i['quantity']} {i['unit']}")


def render_steps(food):
    """Hiển thị hướng dẫn nấu ăn."""
    st.subheader("Cách làm")
    for step in food["steps"]:
        st.write(f" - {step}")


# ==========================
# Component: Hiển thị món ăn trong bữa
# ==========================
def display_meal(meal, day):
    foods = st.session_state.weekly_menu[day][meal]["listOfFoods"]
    for idx in range(0, len(foods), 2):
        c1, c2 = st.columns(2)
        for col, i in zip([c1, c2], [idx, idx + 1]):
            if i < len(foods):
                food = foods[i]
                with col, st.container(border=True):
                    col1, col2, col3 = st.columns([20, 45, 25], vertical_alignment="center")
                    with col1:
                        st.image(food["image"], use_container_width=True)
                    with col2:
                        st.write(f"**{food['name']}**")
                    with col3:
                        if st.button("Chi tiết", key=f"{day}_{meal}_{food['name']}_{i}"):
                            details(food["recipe_id"])


# ==========================
# Main Page
# ==========================
if st.session_state.logged_in:
    st.title(f"Chào mừng {st.session_state.user['fullname']}! Hôm nay bạn muốn ăn gì?")
    st.subheader("📈 Chỉ số dinh dưỡng của bạn:")

    # -- Load charts --
    chart_data = get_api_data("/api/home/chart", {"user_id": st.session_state.user["id"]})
    if chart_data:
        c = chart_data["data"]["chart"]
        for key in c:
            st.session_state.user[key] = c[key]

    # -- Hiển thị biểu đồ --
    render_user_charts(st.session_state.user)

    # -- Weekly menu --
    st.subheader("📄 Thực đơn bữa ăn tiếp theo:")
    display_meal(st.session_state.meal, st.session_state.day_of_week)

    if st.button("Theo dõi thực đơn của bạn", use_container_width=True, type="primary"):
        st.switch_page("pages/features/weeklyMenu.py")

    render_features_section()

else:
    render_guest_home()
