import importlib_resources
import streamlit.components.v1 as components
from typing import Optional
import json

_RELEASE = False

if not _RELEASE:
    _st_record = components.declare_component(
        "st-record",
        url="http://localhost:3001"
    )
else:
    build_dir = importlib_resources.files("st_record").joinpath("frontend/build")
    _st_record = components.declare_component(
        "st-record",
        path=build_dir
    )


def st_record(key=None) -> Optional[bytes]:
    """
    Return ogg encoded audio bytes.
    """

    serialized = _st_record(key=key)
    if serialized:
        array = json.loads(serialized)
        return bytes(array)


if not _RELEASE:
    import streamlit as st
    import librosa
    import io

    st.title("st-record")
    bs = st_record()

    if bs:
        y, sr = librosa.load(io.BytesIO(bs))
