import json
from typing import Optional

import importlib_resources
import streamlit.components.v1 as components

__version__ = "0.1.1"

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
