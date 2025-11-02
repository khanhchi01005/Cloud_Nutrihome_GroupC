import streamlit as st
from datetime import datetime
import pytz


def initialize_session():
    # --------------------------------------------------
    # 🕒 DEFINE TIME AND BASIC SESSION INFO
    # --------------------------------------------------
    timezone = pytz.timezone("Asia/Bangkok")
    now = datetime.now(timezone)

    st.session_state.setdefault("date", now.strftime("%d-%m-%Y"))
    st.session_state.setdefault("day_of_week", "")
    st.session_state.setdefault("meal", "")

    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    st.session_state.day_of_week = days[now.weekday()]
    hour = now.hour

    if 0 <= hour < 10:
        st.session_state.meal = "Breakfast"
    elif 10 <= hour < 16:
        st.session_state.meal = "Lunch"
    else:
        st.session_state.meal = "Dinner"

    # --------------------------------------------------
    # 👤 USER SESSION STATE
    # --------------------------------------------------
    st.session_state.setdefault(
        "user",
        {
            "id": 0,
            "fullname": "",
            "username": "",
            "avatar": "",
            "dob": "",
            "age": 0,
            "gender": "",
            "height": 0,
            "weight": 0,
            "bmi": 0.0,
            "disease": "",
            "allergen": "",
            "activity_level": "",
            "absorbed_carbs": 0,
            "absorbed_protein": 0,
            "absorbed_fat": 0,
            "absorbed_calories": 0,
            "target_carbs": 0,
            "target_protein": 0,
            "target_fat": 0,
            "target_calories": 0,
            "family_id": 0,
        },
    )

    # --------------------------------------------------
    # 🍱 FOOD DETAILS
    # --------------------------------------------------
    st.session_state.setdefault(
        "food_details",
        {
            "name": "",
            "image": "",
            "rating": 0.0,
            "cooking_time": 0,
            "calories": 0,
            "protein": 0,
            "carbs": 0,
            "fat": 0,
            "steps": [],
            "ingredients": [],
        },
    )

    # --------------------------------------------------
    # 📅 WEEKLY MENU TEMPLATE
    # --------------------------------------------------
    def create_day_template():
        return {
            "Breakfast": {"listOfFoods": [], "eaten": 0},
            "Lunch": {"listOfFoods": [], "eaten": 0},
            "Dinner": {"listOfFoods": [], "eaten": 0},
            "Carbs": 0,
            "Protein": 0,
            "Fat": 0,
            "Calories": 0,
        }

    st.session_state.setdefault(
        "weekly_menu",
        {day: create_day_template() for day in ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]},
    )

    # --------------------------------------------------
    # 🧮 TODAY’S NUTRIENTS
    # --------------------------------------------------
    st.session_state.setdefault(
        "today_nutrients", {"Carbs": 0, "Protein": 0, "Fat": 0, "Calories": 0}
    )

    # --------------------------------------------------
    # 📜 HISTORY
    # --------------------------------------------------
    def create_history_day():
        return {
            "Breakfast": {"listOfFoods": [], "eaten": 0},
            "Lunch": {"listOfFoods": [], "eaten": 0},
            "Dinner": {"listOfFoods": [], "eaten": 0},
            "Date": "",
            "Carbs": 0,
            "Protein": 0,
            "Fat": 0,
            "Calories": 0,
        }

    st.session_state.setdefault(
        "history",
        {
            "Today": create_history_day(),
            "Yesterday": create_history_day(),
            "theDayBefore": create_history_day(),
        },
    )

    # --------------------------------------------------
    # 🔍 SEARCHING LIST
    # --------------------------------------------------
    st.session_state.setdefault(
        "searchingList",
        [
            {
                "id": 0,
                "name": "",
                "image": "",
                "cooking_time": 0,
                "rating": 0,
            },
        ],
    )

    # --------------------------------------------------
    # 👪 FAMILY & MEMBERS
    # --------------------------------------------------
    st.session_state.setdefault("addMember", [])
    st.session_state.setdefault("addMemberUsername", [])

    st.session_state.setdefault(
        "family",
        {
            "id": 0,
            "name": "",
            "avatar": "family_images/nutrihome_avatar.jpg",
            "description": "",
            "member": [
                {
                    "user_id": 0,
                    "username": "",
                    "name": "",
                    "profile_image": "",
                    "currentCalo": 0,
                    "currentProtein": 0,
                    "currentFat": 0,
                    "currentCarbs": 0,
                    "targetCalo": 0,
                    "targetCarbs": 0,
                    "targetFat": 0,
                    "targetProtein": 0,
                },
            ],
        },
    )

    # --------------------------------------------------
    # 🛒 SHOPPING LIST
    # --------------------------------------------------
    st.session_state.setdefault("shoppingList", [])

    # --------------------------------------------------
    # 💬 FORUM POSTS
    # --------------------------------------------------
    st.session_state.setdefault(
        "posts",
        [
            {
                "post_id": 0,
                "author_id": 0,
                "author": "",
                "author_username": "",
                "title": "",
                "content": "",
                "image": "",
                "created_at": "",
                "react": False,
                "total_reacts": 0,
                "comments": [],
            },
        ],
    )

    # --------------------------------------------------
    # ⚙️ OTHER FLAGS
    # --------------------------------------------------
    st.session_state.setdefault("logged_in", False)
    st.session_state.setdefault("login_page", False)
    st.session_state.setdefault("language", "Vietnamese")


def logout():
    st.session_state.logged_in = False
    st.session_state.login_page = ""
    st.session_state.register = False

    for key in [
        "user",
        "food_details",
        "weekly_menu",
        "history",
        "searchingList",
        "addMember",
        "addMemberUsername",
        "family",
        "shoppingList",
        "posts",
    ]:
        if key in st.session_state:
            del st.session_state[key]

    st.rerun()
