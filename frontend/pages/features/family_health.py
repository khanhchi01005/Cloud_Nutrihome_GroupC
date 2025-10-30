import streamlit as st
from PIL import Image
import plotly.express as px
import os
import json
import requests
from config import BACKEND_API

family_dir = "images/family_avatar"
os.makedirs(family_dir, exist_ok=True)

@st.dialog("Tạo gia đình", width="large")
def createFamily():
    col1, col2 = st.columns([45, 55])

    with col1:
        uploaded_image = st.file_uploader("Ảnh gia đình", type=["jpg", "jpeg", "png"])
        if uploaded_image is not None:
            image = Image.open(uploaded_image).convert("RGB")
            st.image(image, use_container_width=True)

    with col2:
        family_name = st.text_input("Tên gia đình")
        family_description = st.text_area("Mô tả", placeholder="Write your family's description here...")

    if st.button("Tạo gia đình", use_container_width=True, type='primary'):
        get_all_api = BACKEND_API + "/family/health/create"
        response = requests.post(
                        get_all_api,
                        data=json.dumps(
                            {
                                "family_name": family_name,
                                "user_id": f"{st.session_state.user["id"]}",
                                "description": family_description,
                                "image": ""
                            }
                        ),
                        headers = {'Content-Type': 'application/json',}
                    )
        print(response.status_code)
        if response.status_code == 200:
            json_response = response.json()
            if json_response and "family_id" in json_response:
                st.session_state.user["family_id"] = int(json_response["family_id"])
                
                # Set up directory
                bill_dir = os.path.join("images/family_avatar", str(st.session_state.user["family_id"]))
                os.makedirs(bill_dir, exist_ok=True)

                # Check that `uploaded_image` exists and is valid
                if uploaded_image:
                    avatar_path = os.path.join(bill_dir, "macdinh.jpg")
                    avatar_image = Image.open(uploaded_image)
                    avatar_image.convert("RGB").save(avatar_path, "JPEG")
                    st.rerun()  # Refresh Streamlit app
                else:
                    st.error("Uploaded image is missing.")
            else:
                st.warning("Family ID not found in the response.")

@st.dialog("Chỉnh sửa thông tin gia đình", width="large")
def editFamily():
    col1, col2 = st.columns([45, 55])

    with col1:
        uploaded_image = st.file_uploader("Ảnh gia đình", type=["jpg", "jpeg", "png"])
        if uploaded_image is not None:
            image = Image.open(uploaded_image).convert("RGB")
            st.image(image, use_container_width=True)
        else:
            image = Image.open(st.session_state.family["avatar"]).convert("RGB")
            st.image(image, use_container_width=True)

    with col2:
        family_name = st.text_input("Tên gia đình", value=st.session_state.family["name"])
        family_description = st.text_area("Mô tả", placeholder="Write your family's description here...", value=st.session_state.family["description"])

    if st.button("Chỉnh sửa thông tin gia đình", use_container_width=True, type='primary'):
        if uploaded_image is not None:
            # Define the full save path
            image_path = os.path.join(family_dir + '/' + str(st.session_state.family["id"]), "macdinh.jpg")
                
            # Save the image
            with open(image_path, "wb") as f:
                image.save(f, format="JPEG")
        st.session_state.family["name"] = family_name
        st.session_state.family["description"] = family_description
        st.rerun()

@st.dialog("Thêm thành viên", width="large")
def addFamilyMember():
    col1, col2 = st.columns([8, 2], vertical_alignment='bottom')
    with col1:
        username = st.text_input("**Nhập username bạn muốn thêm vào gia đình:**")
    with col2:
        if st.button("Thêm", use_container_width=True):
            get_all_api = BACKEND_API + "/family/health/add-member/validate"
            response = requests.post(
                        get_all_api,
                        data=json.dumps(
                            {
                                "invitee_username": username
                            }
                        ),
                        headers = {'Content-Type': 'application/json',}
                    )
            print(response.status_code)
            if response.status_code == 200:
                st.session_state.addMember.append(
                    {
                        "name": response.json()["waiting_list"]["name"],
                        "username": response.json()["waiting_list"]["username"]
                    }
                )
                st.session_state.addMemberUsername.append(response.json()["waiting_list"]["username"])

    st.subheader("Danh sách thêm", divider='grey')
    if st.session_state.addMember and len(st.session_state.addMember) > 0:
        for i, member in enumerate(st.session_state.addMember):
            with st.container(border=True):
                col1, col2, col3 = st.columns([1, 1.5, 7.5], vertical_alignment='center')
                with col1:
                    if st.button("X", key = f"delete_{i}"):
                        st.session_state.addMember.pop(i)
                        st.session_state.addMemberUsername.pop(i)
                with col2:
                    st.image(f"images/avatar/{member["username"]}/macdinh.jpg", use_container_width=True)
                with col3:
                    st.write(f" - **Username:** {member["username"]}")
                    st.write(f" - **Fullname:** {member["name"]}")


    if st.button("Thêm thành viên", type='primary', use_container_width=True, key=10):
        get_all_api = BACKEND_API + "/family/health/add-member/add-all"
        response = requests.post(
                        get_all_api,
                        data=json.dumps(
                            {
                                "family_id": f"{st.session_state.user["family_id"]}",
                                "usernames": st.session_state.addMemberUsername
                            }
                        ),
                        headers = {'Content-Type': 'application/json',}
                    )
        print(response.status_code)
        if response.status_code == 200:
            st.session_state.addMember = []
            st.session_state.addMemberUsername = []
            st.rerun()

st.title("Family Health")
st.write("Feature's description")
st.text('')

if st.session_state.user["family_id"] is None:
    with st.container(border=True):
        st.subheader("Bạn chưa vào gia đình! Tạo một gia đình ngay?")
        if st.button("Tạo gia đình mới", use_container_width=True, type='primary'):
            createFamily()

else:
    st.session_state.family["avatar"] = f"images/family_avatar/{st.session_state.user["family_id"]}/macdinh.jpg"

    get_all_api = BACKEND_API + "/family/detail"
    response = requests.get(
                get_all_api,
                data=json.dumps(
                    {
                        "family_id": f"{st.session_state.user["family_id"]}"
                    }
                ),
                headers = {'Content-Type': 'application/json',}
            )
    print(response.status_code)
    if response.status_code == 200:
        st.session_state.family["name"] = response.json()["family_detail"]["name"]
        st.session_state.family["description"] = response.json()["family_detail"]["description"]

    get_all_api = BACKEND_API + "/family/health/list"
    response = requests.get(
                get_all_api,
                data=json.dumps(
                    {
                        "family_id": f"{st.session_state.user["family_id"]}"
                    }
                ),
                headers = {'Content-Type': 'application/json',}
            )
    print(response.status_code)
    if response.status_code == 200:
        st.session_state.family["member"] = response.json()["family_members"]

    st.subheader("Thông tin gia đình", divider='gray')
    col1, col2 = st.columns([25, 75])

    with col1:
        st.image(f"{st.session_state.family["avatar"]}", use_container_width=True)
        st.write(f"**{st.session_state.family["name"]}**")

    with col2:
        with st.container(border=True, height=160):
            st.write("**Mô tả**" + ":")
            st.write(f"{str(st.session_state.family["description"])}")
        c1, c2 = st.columns(2)
        with c1:
            if st.button("Chỉnh sửa thông tin", type="primary", use_container_width=True):
                editFamily()
        with c2:
            if st.button("Rời gia đình", use_container_width=True):
                st.session_state.user["family_id"] = 0
                st.session_state.family = {
                    "id": 0,
                    "name": "",
                    "avatar": "",
                    "description": "",
                    "memberCount": 0,
                    "member": [
                        {
                            "id": 0,
                            "username": "",
                            "fullname": "",
                            "avatar": "",  # Path to user avatar image
                            "absorbed_carbs": 0,
                            "absorbed_protein": 0,
                            "absorbed_fat": 0,
                            "absorbed_calories": 0,
                            "target_carbs": 0,  # Daily target carbohydrates in grams
                            "target_protein": 0,  # Daily target protein in grams
                            "target_fat": 0,  # Daily target fat in grams
                            "target_calories": 0,  # Daily calorie target
                        },
                    ]
                }
                st.rerun()
    
    st.text('')
    st.text('')
    tab1, tab2 = st.tabs(["**Thành viên**", "Nguyên liệu cần mua hàng tuần"])

    with tab1:
        def create_pie_chart(current, goal, label, color):
            labels = ['done', 'notDone']
            sizes = [current/goal, 1 - current/goal]
            pie_chart = px.pie(names=labels, values=sizes, color_discrete_sequence=[color, '#C0C0C0'], hole=0.7)
            pie_chart.update_layout(
                annotations=[dict(text=f"{current}/{goal}<br>{label}", x=0.5, y=0.5, font_size=14, showarrow=False)],
                showlegend=False,
                width = 80,
                height = 100,
                margin=dict(t=0, b=0, l=0, r=7)
            )
            pie_chart.update_traces(textinfo='none', sort=False)
            return pie_chart
        
        if st.button("Thêm thành viên", type='primary'):
            addFamilyMember()

        for i, member in enumerate(st.session_state.family["member"]): 
            # Display in a grid
            with st.container(border=True):
                col1, col3, col4, col5, col6, col7 = st.columns([25, 20, 20, 20, 20, 7], vertical_alignment='center')
                col3.plotly_chart(create_pie_chart(member["currentCalo"], member["targetCalo"], 'calories', '#DC143C'))
                col4.plotly_chart(create_pie_chart(member["currentCarbs"], member["targetCarbs"], 'carbs', '#FA8072'))
                col5.plotly_chart(create_pie_chart(member["currentFat"], member["targetFat"], 'fat', '#66b3ff'))
                col6.plotly_chart(create_pie_chart(member["currentProtein"], member["targetProtein"], 'protein', '#9933CC'))
                with col1:
                    with st.container(border=False, height=120):
                        st.image(f"images/avatar/{member["username"]}/macdinh.jpg", use_container_width=True)
                    with st.container(border=False, height=50):
                        st.write(f"**{member["name"]}**")

    with tab2:
        get_all_api = BACKEND_API + "/family/shopping-list"
        response = requests.get(
                get_all_api,
                data=json.dumps(
                    {
                        "family_id": f"{st.session_state.user["family_id"]}"
                    }
                ),
                headers = {'Content-Type': 'application/json',}
            )
        print(response.status_code)
        if response.status_code == 200:
            st.session_state.shoppingList = response.json()["suggested_ingredients"]

        with st.container(border=True, height=400):
            for idx, ingredients in enumerate(st.session_state.shoppingList):
                st.write(f"- **{ingredients["name"]}**: {ingredients["quantity"]} {ingredients["unit"]}")