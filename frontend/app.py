import streamlit as st
import requests
from session_setup import initialize_session
from page_config import get_navigation
from config import BACKEND_API  # lấy từ file config.py

st.set_page_config(page_title="NutriHome", page_icon="")

# --------------------------------------------------
# 🔧 INIT SESSION
# --------------------------------------------------
initialize_session()

# --------------------------------------------------
# 🌐 TEST BACKEND CONNECTION
# --------------------------------------------------
if "backend_connected" not in st.session_state:
    try:
        response = requests.get(f"{BACKEND_API}/health", timeout=3)
        if response.status_code == 200:
            st.session_state.backend_connected = True
        else:
            st.session_state.backend_connected = False
    except Exception:
        st.session_state.backend_connected = False

# Hiển thị trạng thái kết nối
if st.session_state.backend_connected:
    st.success("🟢 Backend connected")
else:
    st.error("🔴 Backend not reachable")

# --------------------------------------------------
# 🧭 PAGE NAVIGATION
# --------------------------------------------------
pg = get_navigation(
    logged_in=st.session_state.logged_in,
    login_page_flag=st.session_state.login_page,
)

pg.run()
