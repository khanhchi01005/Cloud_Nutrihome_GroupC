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
            if uploaded_image is not None:
                is_dir = os.path.join("images/ingredient_safety", st.session_state.user["username"])
                os.makedirs(is_dir, exist_ok=True)  # Creates folder if it doesn't exist            
                # Save avatar in the user directory
                avatar_path = os.path.join(is_dir, "ingredients.jpg")
                avatar_image = Image.open(uploaded_image)
                avatar_image.convert("RGB").save(avatar_path, "JPEG")

            get_all_api = BACKEND_API + "/api/ingredient_safety"
            response = requests.post(
                    get_all_api,
                    data=json.dumps(
                        {
                            "user_id": f"{st.session_state.user["id"]}",
                            "image_path": f"C:/Users/Admin/Desktop/NutriHome/frontend/images/ingredient_safety/{st.session_state.user["username"]}/ingredients.jpg"
                        }
                    ),
                    headers = {'Content-Type': 'application/json',}
                )
            print(response.status_code)
            if response.status_code == 200:
                st.session_state.Allergen = response.json()
            st.rerun()

with col2:
    with st.container(border=True):
        st.write("**Các chất gây dị ứng dựa trên tình hình sức khỏe của bạn và danh sách nguyên liệu:**")
        if len(st.session_state.Allergen) == 0:
            st.warning("Hãy nhập vào danh sách nguyên liệu")
        else:
            st.write(f"{st.session_state.Allergen}")