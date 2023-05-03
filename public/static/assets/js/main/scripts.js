// Loads a Javascript file from a specified URL
// Resolves a promise when the <script> is loaded
App.load_script = (source) => {
  if (!App.load_scripts) {
    return
  }

  App.loginfo(`Loading script: ${source}`)

  return new Promise((resolve, reject) => {
    const script = DOM.create(`script`)
    document.body.appendChild(script)
    script.onload = resolve
    script.onerror = reject
    script.async = true
    script.src = source
  })
}