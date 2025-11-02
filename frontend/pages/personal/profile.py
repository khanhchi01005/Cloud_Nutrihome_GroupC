import streamlit as st
from datetime import datetime
from PIL import Image
import os
import json
import requests
from config import BACKEND_API

get_all_api = BACKEND_API + "/api/personal"
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
    st.session_state.user["activity_level"] = response.json()["data"]["activity_level"]
    st.session_state.user["allergen"] = response.json()["data"]["allergen"]
    st.session_state.user["disease"] = response.json()["data"]["disease"]
    st.session_state.user["dob"] = response.json()["data"]["dob"]
    st.session_state.user["gender"] = response.json()["data"]["gender"]
    st.session_state.user["height"] = response.json()["data"]["height"]
    st.session_state.user["weight"] = response.json()["data"]["weight"]

save_path = 'images/avatar'
os.makedirs(save_path, exist_ok=True)
st.session_state.user["avatar"] = f'images/avatar/{st.session_state.user["username"]}/macdinh.jpg'

@st.dialog("Chỉnh sửa thông tin cá nhân", width="large")
def editPersonal():
    col1, col2 = st.columns([45, 55])
    with col2:
        dob = datetime.strptime(st.session_state.user["dob"].strip(), "%Y-%m-%d")
        new_fullname = st.text_input("Họ và Tên", value=st.session_state.user["fullname"])
        
        c1, c2, c3 = st.columns(3)
        with c1:
            new_date = st.text_input("Ngày sinh", value=str(dob.day))
        with c2:
            new_month = st.text_input("Tháng sinh", value=str(dob.month))
        with c3:
            new_year = st.text_input("Năm sinh", value=str(dob.year))
        new_disease = st.text_input("Bệnh lý", value=st.session_state.user["disease"])
        new_allergen = st.text_input("Dị ứng", value=st.session_state.user["allergen"])
        new_dob = datetime(int(new_year), int(new_month), int(new_date))

        c1, c2, c3 = st.columns(3)
        with c1:
            new_weight = st.text_input("Cân nặng (kg)", value=st.session_state.user["weight"])
        with c2:
            new_height = st.text_input("Chiều cao (cm)", value=st.session_state.user["height"])
        with c3:
            new_activity_level = st.selectbox("Tần suất hoạt động", ["high", "medium", "low"])

    with col1:
        uploaded_image = st.file_uploader("Avatar của bạn", type=["jpg", "jpeg", "png"])
        if uploaded_image is not None:
            image = Image.open(uploaded_image).convert("RGB")
            st.image(image, use_container_width=True)
        else:
            image = Image.open(st.session_state.user["avatar"]).convert("RGB")
            st.image(image, use_container_width=True)

    edit_button = st.button("Chỉnh sửa", type="primary", use_container_width=True)
    if edit_button:
            get_all_api = BACKEND_API + "/api/personal/update"
            response = requests.patch(
                    get_all_api,
                    json = 
                        {
                            'user_id': st.session_state.user["id"],
                            'fullname': new_fullname,
                            'dob': new_dob.strftime("%Y-%m-%d"),
                            'height': new_height,
                            'weight': new_weight,
                            'activity_level': new_activity_level,
                            'disease': new_disease,
                            'allergen': new_allergen
                        },
                    headers = {'Content-Type': 'application/json',}
                )
            print(response.status_code)

            if uploaded_image is not None:
                # Define the full save path
                image_path = os.path.join(save_path + '/' + st.session_state.user["username"], "macdinh.jpg")
                
                # Save the image
                with open(image_path, "wb") as f:
                    image.save(f, format="JPEG")

            st.rerun()

st.title("Profile")

st.subheader("Thông tin cá nhân", divider='gray')

col1, col2 = st.columns([31, 69])

with col1:
    st.image(f"{st.session_state.user["avatar"]}", use_container_width=True)

    st.write(f"**{st.session_state.user["fullname"]}**")

with col2:
    with st.container(border=True):
        c1, c2 = st.columns(2)
        with c1:
            st.write("- " + "**Ngày sinh**" + f":  {str(st.session_state.user["dob"])}")
            st.write("- " + "**Giới tính**" + f":  {str(st.session_state.user["gender"])}")
            st.write("- " + "**Cân nặng**" + f":  {str(st.session_state.user["weight"])} kg")
            st.write("- " + "**Chiều cao**" + f":  {str(st.session_state.user["height"])} cm")
            st.write("- " + "**Tần số hoạt động**" + f":  {str(st.session_state.user["activity_level"])}")
            st.write("- " + "**Bệnh lý**" + f":  {str(st.session_state.user["disease"])}")
            st.write("- " + "**Dị ứng**" + f":  {str(st.session_state.user["allergen"])}")
        with c2:
            st.write("**Mục tiêu:**")
            st.write("- " + "**Calories**" + f":  {str(st.session_state.user["target_calories"])} calories")
            st.write("- " + "**Carbs**" + f":  {str(st.session_state.user["target_carbs"])} g")
            st.write("- " + "**Fat**" + f":  {str(st.session_state.user["target_fat"])} g")
            st.write("- " + "**Protein**" + f":  {str(st.session_state.user["target_protein"])} g")

    if st.button("Chỉnh sửa thông tin cá nhân", type="primary", use_container_width=True):
         editPersonal()