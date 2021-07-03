import importlib_resources
import streamlit.components.v1 as components

_RELEASE = False

if not _RELEASE:
    st_record = components.declare_component(
        "st-record",
        url="http://localhost:3001"
    )
else:
    build_dir = importlib_resources.files("st_record").joinpath("frontend/build")
    st_record = components.declare_component(
        "st-record",
        path=build_dir
    )


if not _RELEASE:
    import streamlit as st
    st.title("st-record")
    st_record()
