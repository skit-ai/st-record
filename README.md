# st-record

Streamlit component for recording audio.

```
from st_record import st_record
import streamlit as st
import librosa
import io

st.title("st-record")
bs = st_record()

if bs:
    y, sr = librosa.load(io.BytesIO(bs))
```
