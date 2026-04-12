const editor = CodeMirror.fromTextArea(document.getElementById("code"), {
    mode: "text/x-php",
    theme: "dracula",
    lineNumbers: true,
    indentUnit: 4,
    tabSize: 4
});