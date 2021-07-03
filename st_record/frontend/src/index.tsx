import { Streamlit, RenderData } from 'streamlit-component-lib'

// Our component has three parts
// 1. Record/Stop button
// 2. Audio player to play back the audio
// 3. Submit button to send data to the backend
const span = document.body.appendChild(document.createElement('span'))
const recordButton = span.appendChild(document.createElement('button'))
const audio = span.appendChild(document.createElement('audio'))
const submitButton = span.appendChild(document.createElement('button'))

recordButton.textContent = 'record'
submitButton.textContent = 'submit'

let recordedChunks: any[] = []

let state = {
  recording: false,
  recorded: false
}

let isFocused = {
  record: true,
  submit: false
}

submitButton.onclick = function(): void {
  // Assume that recording is done, just send the recorded chunks to backend
  let blob = new Blob(recordedChunks)
  blob.arrayBuffer().then(buf => {
    var arr = Array.from(new Uint8Array(buf))
    Streamlit.setComponentValue(arr)
  })
}

recordButton.onfocus = function(): void { isFocused.record = true }
recordButton.onblur = function(): void { isFocused.record = false }
submitButton.onfocus = function(): void { isFocused.submit = true }
submitButton.onblur = function(): void { isFocused.submit = false }

const handleSuccess = function(stream: any): void {
  const options = { mimeType: 'audio/ogg' }
  // @ts-ignore
  const mediaRecorder = new MediaRecorder(stream, options)

  mediaRecorder.addEventListener('stop', function(): void {
    state.recorded = true
    state.recording = false
    submitButton.disabled = false
  })

  mediaRecorder.addEventListener('dataavailable', function(e: any): void {
    if (e.data.size > 0) {
      recordedChunks.push(e.data)
    }
  })

  recordButton.onclick = function(): void {
    if (state.recording === true) {
      mediaRecorder.stop()
      state.recording = false
      state.recorded = true
      recordButton.textContent = 'record'
    } else {
      recordedChunks = []
      mediaRecorder.start()
      state.recording = true
      state.recorded = false
      recordButton.textContent = 'stop'
    }
  }
}

navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(handleSuccess)

/**
 * The component's render function. This will be called immediately after
 * the component is initially loaded, and then again every time the
 * component gets new data from Python.
 */
function onRender(event: Event): void {
  const data = (event as CustomEvent<RenderData>).detail

  // Maintain compatibility with older versions of Streamlit that don't send
  // a theme object.
  if (data.theme) {
    // Use CSS vars to style our button border. Alternatively, the theme style
    // is defined in the data.theme object.
    const borderStyling = `1px solid var(${
      isFocused ? "--primary-color" : "gray"
    })`
    recordButton.style.border = borderStyling
    submitButton.style.border = borderStyling
    recordButton.style.outline = borderStyling
    submitButton.style.outline = borderStyling
  }

  recordButton.disabled = data.disabled
  submitButton.disabled = data.disabled

  Streamlit.setFrameHeight()
}
Streamlit.events.addEventListener(Streamlit.RENDER_EVENT, onRender)
Streamlit.setComponentReady()
Streamlit.setFrameHeight()
