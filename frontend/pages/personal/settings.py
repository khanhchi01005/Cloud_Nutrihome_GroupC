import streamlit as st

st.title("Settings")

col1, col2 = st.columns([1, 1])

with col1:
    set_language = st.selectbox(
        "**Ngôn ngữ**",
        ("Tiếng Việt", "Tiếng Anh"),
    )

    if set_language == "Tiếng Việt":
        st.session_state.language = "Vietnamese"
    elif set_language == "Tiếng Anh":
        st.session_state.language = "English"