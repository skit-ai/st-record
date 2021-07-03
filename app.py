import io

import librosa
import streamlit as st

from st_record import st_record

st.title("st-record")
bs = st_record()

if bs:
    y, sr = librosa.load(io.BytesIO(bs))
