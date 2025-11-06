import streamlit as st
from PIL import Image
import os
import requests
import json
from config import BACKEND_API
    
# Allergen
if "Allergen" not in st.session_state:
    st.session_state.Allergen = ""

st.title("Ingredient Safety")
st.write("Feature's description")

st.text("")

col1, col2 = st.columns(2)

with col1:
    with st.container(border=True):
        uploaded_image = st.file_uploader("**Danh sách nguyên liệu**", type=["jpg", "jpeg", "png"])

        if uploaded_image is not None:
            image = Image.open(uploaded_image).convert("RGB")
            st.image(image, use_container_width=True)

        if st.button("Quét nguyên liệu", type='primary', use_container_width=True):
            if uploaded_image is None:
                st.warning("Vui lòng tải lên ảnh danh sách nguyên liệu trước.")
                st.stop()

            get_all_api = BACKEND_API + "/api/ingredient_safety"

            # Gửi file ảnh thật + user_id
            files = {
                "file": (uploaded_image.name, uploaded_image.getvalue(), uploaded_image.type)
            }
            data = {
                "user_id": str(st.session_state.user["id"])
            }

            response = requests.post(get_all_api, data=data, files=files)

            if response.status_code == 200:
                st.session_state.Allergen = response.json()
                st.success("✅ Quét nguyên liệu thành công!")
                st.rerun()
            else:
                st.error(f"❌ Lỗi tải nguyên liệu: {response.status_code}")

            st.rerun()

with col2:
    with st.container(border=True):
        st.write("**Các chất gây dị ứng dựa trên tình hình sức khỏe của bạn và danh sách nguyên liệu:**")
        if len(st.session_state.Allergen) == 0:
            st.warning("Hãy nhập vào danh sách nguyên liệu")
        else:
            st.write(f"{st.session_state.Allergen}")