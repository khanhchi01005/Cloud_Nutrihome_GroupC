# page_config.py
import streamlit as st
from session_setup import logout

# --------------------------------------------------
# 🧭 PAGE DEFINITIONS
# --------------------------------------------------

login_page = st.Page("pages/login.py", title="Log in", icon=":material/login:")
logout_page = st.Page(logout, title="Log out", icon=":material/logout:")
home = st.Page("pages/home.py", title="Home", icon=":material/home:")

# --- Personal pages ---
profile = st.Page("pages/personal/profile.py", title="Profile", icon=":material/account_circle:")
settings = st.Page("pages/personal/settings.py", title="Settings", icon=":material/bug_report:")

# --- Feature pages ---
weeklyMenu = st.Page("pages/features/weeklyMenu.py", title="Weekly Menu", icon=":material/assignment:")
recipes = st.Page("pages/features/recipes.py", title="Recipes", icon=":material/content_paste_search:")
history = st.Page("pages/features/history.py", title="History", icon=":material/history:")
family_health = st.Page("pages/features/family_health.py", title="Family Health", icon=":material/diversity_1:")
ingredient_safety = st.Page("pages/features/ingredient_safety.py", title="Ingredient Safety", icon=":material/health_and_safety:")
community = st.Page("pages/features/community.py", title="Community", icon=":material/forum:")

# --------------------------------------------------
# 🗺️ NAVIGATION STRUCTURE
# --------------------------------------------------

def get_navigation(logged_in: bool, login_page_flag: bool):
    """Return Streamlit navigation layout based on session state."""
    if logged_in:
        return st.navigation(
            {
                "": [home],
                "Features": [
                    weeklyMenu,
                    recipes,
                    history,
                    family_health,
                    ingredient_safety,
                    community,
                ],
                "Personal": [profile, settings, logout_page],
            }
        )
    else:
        if login_page_flag:
            return st.navigation([login_page])
        else:
            return st.navigation([home])
