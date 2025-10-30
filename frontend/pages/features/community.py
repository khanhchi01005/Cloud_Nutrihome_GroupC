import streamlit as st
from PIL import Image
from datetime import datetime
import pytz

# Initialize favorite status
if 'favorite' not in st.session_state:
    st.session_state.favorite = False

@st.dialog("Tạo bài viết mới", width="large")
def addNewPost():
    col1, col2 = st.columns([1, 1])

    with col1:
        uploaded_image = st.file_uploader("Ảnh bài viết", type=["jpg", "jpeg", "png"])
        if uploaded_image is not None:
            image = Image.open(uploaded_image).convert("RGB")
            st.image(image, use_container_width=True)

    with col2:
        title = st.text_input("Tiêu đề bài viết")
        description = st.text_area("Mô tả", placeholder="Write your post's description here...")
        if st.button("Chia sẻ bài viết", type='primary', use_container_width=True):
            st.session_state.posts.append({
                "post_id": 4,
                "author_id": st.session_state.user["id"],
                "author": f"{st.session_state.user["fullname"]}",
                "author_username": f"{st.session_state.user["username"]}",
                "title": title,
                "content": description,
                "image": image,
                "created_at": datetime.now(pytz.timezone("Asia/Bangkok")).strftime("%Y-%m-%d %H:%M:%S"),
                "react": False,
                "total_reacts": 0,
                "comments": []
            })
            st.rerun()

# @st.dialog("Chỉnh sửa bài viết", width="large")
# def editPost(i):
#     col1, col2 = st.columns([1, 1])

#     with col1:
#         uploaded_image = st.file_uploader("Ảnh bài viết", type=["jpg", "jpeg", "png"])
#         if uploaded_image is not None:
#             image = Image.open(uploaded_image).convert("RGB")
#             st.image(image, use_container_width=True)
#         else:
#             st.image(st.session_state.posts[i]["image"], use_container_width=True)

#     with col2:
#         title = st.text_input("Tiêu đề bài viết", value=st.session_state.posts[i]["title"])
#         description = st.text_area("Mô tả", placeholder="Write your post's description here...", value=st.session_state.posts[i]["content"])

#         if st.button("Chỉnh sửa bài viết", type='primary', use_container_width=True):
#             st.session_state.posts[i]["title"] = title
#             st.session_state.posts[i]["content"] = description
#             st.session_state.posts[i]["created_at"] = datetime.now(pytz.timezone("Asia/Bangkok")).strftime("%d-%m-%Y %H:%M:%S")
#             if uploaded_image is not None:
#                 st.session_state.posts[i]["image"] = image
#             st.rerun()

st.title("Community")
st.write("NutriHome cung cấp diễn đàn, giúp những người có cùng đam mê ẩm thực có thể chia sẻ những cách chế biến thực phẩm sáng tạo và độc đáo của riêng mình.")

st.header("**What's new?**", divider='gray')
st.text('')

col1, col2 = st.columns([40, 60])
with col1:
    add_new_post = st.button("Add new post", type='primary', use_container_width=True)
    if(add_new_post):
        addNewPost()

st.session_state.posts = sorted(
    st.session_state.posts,
    key=lambda post: datetime.strptime(post["created_at"], "%Y-%m-%d %H:%M:%S"),
    reverse=True
)

# with st.container(border=False, height=2000):
for i, post in enumerate(st.session_state.posts):
    st.text('')
    with st.container(border=True):
        st.text('')
        col1, col2 = st.columns([1, 9])
        with col1:
            st.image(f"images/avatar/{post["author_username"]}/macdinh.jpg", use_container_width=True)
        with col2:
            st.write(f"**{post["author"]}**")
            st.write(f"""**Ngày đăng**: {post["created_at"]}""")
        st.text('')
        st.subheader(post["title"])
        st.write(post["content"])
        st.text('')
        st.image(post["image"], use_container_width=True)

        col1, col2, col3, col4, col5 = st.columns([20, 25, 10, 25, 20], vertical_alignment='center')
        with col1:
            st.button(f"❤️ {post["total_reacts"]}", key=f"react{i}", use_container_width=True, disabled=True)
        with col2:
            if post["react"]:
                if st.button("Đã yêu thích", key=f"favorite_{i}", use_container_width=True):
                    post["total_reacts"] -= 1
                    post["react"] = False
                    st.rerun()
            else:
                if st.button("Yêu thích", key=f"favorite_{i}", use_container_width=True, type='primary'):
                    post["total_reacts"] += 1
                    post["react"] = True
                    st.rerun()
        # with col4:
        #     if post["author_id"] == st.session_state.user["id"]:
        #         if st.button("Chỉnh sửa bài viết", key=f"edit{i}", use_container_width=True):
        #             editPost(i)
        #     else:
        #         st.button("Chỉnh sửa bài viết", key=f"edit{i}", use_container_width=True, disabled=True)
        with col5:
            if post["author_id"] == st.session_state.user["id"]:
                if st.button("Xóa bài viết", key=f"delete{i}", use_container_width=True):
                    st.session_state.posts.pop(i)
                    st.rerun()
            else:
                st.button("Xóa bài viết", key=f"delete{i}", use_container_width=True, disabled=True)

        st.text('')

        st.write("**Bình luận**")
        with st.container(border=False, height=200):
            for comment in post["comments"]:
                with st.container(border=True):
                    st.write(f"{comment}")

        st.text('')

        user_comment = st.text_area("**Bình luận**", placeholder="Write your comment here...", key=f"comment_input_{i}")
        commentary = st.button("Bình luận", use_container_width=True, type='primary', key=f"comment_button_{i}")

        if (commentary) and user_comment:
                post["comments"].append(f"{st.session_state.user["fullname"]}: {user_comment}")
                st.rerun()