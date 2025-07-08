document.querySelectorAll("[data-editor]").forEach((editor) => {
    const button = editor.querySelector(".editorButton");
    const textarea = editor.querySelector(".editorTextarea");
    const iframe = editor.querySelector(".editorIframe");

    const cm = CodeMirror.fromTextArea(textarea, {
        mode: "htmlmixed",
        lineNumbers: true,
        tabSize: 2,
        lineWrapping: true
      });

    button.addEventListener('click', () => {
        iframe.srcdoc = cm.getValue();
      });
});