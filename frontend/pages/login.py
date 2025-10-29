import streamlit as st
from datetime import datetime
from PIL import Image
from config import BACKEND_API, TIMEZONE
import os
import requests

# ===== INIT SESSION =====
st.session_state.setdefault("register", False)
st.session_state.setdefault("logged_in", False)
st.session_state.setdefault("backend_connected", False)  # đảm bảo luôn có biến này

# ===== MOCK DATA =====
MOCK_USER = {
    "id": 1,
    "fullname": "Admin",
    "username": "admin",
    "family_id": 0,
}
MOCK_POSTS = [
    {
        "post_id": 1,
        "author": "Hoàng Khánh Chi",
        "title": "Cách nấu cơm siêu ngon!",
        "image": "food_images/com.jpg",
        "total_reacts": 20,
        "comments": [
            "Hoàng Khánh Chi: Top 1 công thức tôi luôn tin tưởng",
            "Phạm Anh Tuấn: Cho thêm giấm ngon x100",
        ],
    },
    {
        "post_id": 2,
        "author": "Nguyễn Huy Thái",
        "title": "SGUET",
        "image": "features_images/sg.jpg",
        "total_reacts": 1000,
        "comments": ["Nguyễn Huy Thái: Ảnh xấu vcl"],
    },
]

# ===== REGISTER FORM =====
if st.session_state.register:
    st.title("Đăng ký")

    with st.form("register_form"):
        new_fullname = st.text_input("Họ và Tên")

        col1, col2, col3, col4 = st.columns(4)
        with col1:
            new_gender = st.selectbox("Giới tính", ["male", "female"])
        with col2:
            date = st.text_input("Ngày sinh")
        with col3:
            month = st.text_input("Tháng sinh")
        with col4:
            year = st.text_input("Năm sinh")

        col1, col2, col3 = st.columns(3)
        with col1:
            new_weight = st.text_input("Cân nặng (kg)")
        with col2:
            new_height = st.text_input("Chiều cao (cm)")
        with col3:
            new_activity = st.selectbox("Tần suất hoạt động", ["high", "medium", "low"])

        new_disease = st.text_input("Bệnh lý")
        new_allergen = st.text_input("Dị ứng")
        new_username = st.text_input("Tên đăng nhập")
        password = st.text_input("Mật khẩu", type="password")
        confirm_password = st.text_input("Nhập lại mật khẩu", type="password")

        if password and confirm_password and password != confirm_password:
            st.warning("⚠️ Mật khẩu không trùng khớp!")

        col1, col2 = st.columns(2)
        cancel = col1.form_submit_button("Quay lại", use_container_width=True)
        submit = col2.form_submit_button("Đăng ký", type="primary", use_container_width=True)

    if cancel:
        st.session_state.register = False
        st.rerun()

    if submit:
        if not all([
            new_fullname, new_gender, date, month, year,
            new_weight, new_height, new_activity, new_username,
            password, confirm_password, password == confirm_password,
            new_disease, new_allergen
        ]):
            st.error("⚠️ Vui lòng điền đầy đủ thông tin trước khi đăng ký.")
        else:
            if st.session_state.backend_connected:
                # ---- Gọi backend thật ----
                try:
                    dob = datetime(int(year), int(month), int(date))
                    api_url = f"{BACKEND_API}/api/credentials/register"
                    payload = {
                        "fullname": new_fullname,
                        "dob": dob.strftime("%Y-%m-%d"),
                        "username": new_username,
                        "password": password,
                        "confirm_password": confirm_password,
                        "height": int(new_height),
                        "weight": int(new_weight),
                        "activity_level": new_activity,
                        "avatar": "images/avatar/macdinh.jpg",
                        "gender": new_gender,
                    }

                    response = requests.post(api_url, json=payload)
                    if response.status_code == 201:
                        data = response.json()["data"]["user"]
                        st.session_state.logged_in = True
                        st.session_state.user = {
                            "id": data["user_id"],
                            "fullname": data["fullname"],
                            "age": data["age"],
                            "avatar": f"images/avatar/{new_username}/macdinh.jpg",
                        }
                        st.success("🎉 Đăng ký thành công!")
                        st.rerun()
                    else:
                        st.error(f"Lỗi đăng ký: {response.status_code}")
                except Exception as e:
                    st.error(f"❌ Lỗi xử lý: {e}")
            else:
                # ---- Dữ liệu ảo ----
                st.session_state.logged_in = True
                st.session_state.user = MOCK_USER
                st.success("🎉 Đăng ký (mock) thành công — backend offline.")
                st.rerun()

# ===== LOGIN FORM =====
else:
    st.title("Đăng nhập")

    with st.form("login_form"):
        username = st.text_input("Tên đăng nhập")
        password = st.text_input("Mật khẩu", type="password")

        col1, col2, col3 = st.columns(3)
        login = col1.form_submit_button("Đăng nhập", type="primary", use_container_width=True)
        register = col2.form_submit_button("Đăng ký", use_container_width=True)
        back = col3.form_submit_button("Quay lại", use_container_width=True)

    if login:
        if st.session_state.backend_connected:
            # ---- Gọi backend thật ----
            try:
                api_url = f"{BACKEND_API}/api/credentials/login"
                response = requests.post(api_url, json={"username": username, "password": password})

                if response.status_code == 200:
                    user = response.json()["data"]["user"]
                    st.session_state.logged_in = True
                    st.session_state.user = {
                        "id": user["user_id"],
                        "fullname": user["fullname"],
                        "username": user["username"],
                        "family_id": user["family_id"],
                    }
                    st.session_state.posts = MOCK_POSTS
                    st.success("✅ Đăng nhập thành công!")
                    st.rerun()
                else:
                    st.error("❌ Thông tin đăng nhập không chính xác.")
            except Exception as e:
                st.error(f"⚠️ Lỗi đăng nhập: {e}")
        else:
            # ---- Dữ liệu ảo ----
            if username == "admin" and password == "1":
                st.session_state.logged_in = True
                st.session_state.user = MOCK_USER
                st.session_state.posts = MOCK_POSTS
                st.success("✅ Đăng nhập (mock) thành công — backend offline.")
                st.rerun()
            else:
                st.error("❌ Sai tài khoản hoặc mật khẩu (mock mode).")

    if register:
        st.session_state.register = True
        st.rerun()

    if back:
        st.session_state.login_page = False
        st.rerun()
