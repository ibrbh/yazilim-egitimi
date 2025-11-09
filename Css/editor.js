document.querySelectorAll("[data-editor]").forEach((wrapper) => {
  const htmlArea = wrapper.querySelector(".html-code");
  const cssArea = wrapper.querySelector(".css-code");
  const runButton = wrapper.querySelector(".run-btn");
  const iframe = wrapper.querySelector(".output");

  const htmlEditor = CodeMirror.fromTextArea(htmlArea, {
    mode: "text/html",
    theme: "material-darker",
    lineNumbers: true,
    tabSize: 2,
    indentWithTabs: true
  });

  const cssEditor = CodeMirror.fromTextArea(cssArea, {
    mode: "css",
    theme: "material-darker",
    lineNumbers: true,
    tabSize: 2,
    indentWithTabs: true
  });

  runButton.addEventListener("click", () => {
    const html = htmlEditor.getValue();
    const css = `<style>${cssEditor.getValue()}</style>`;
    iframe.srcdoc = html + css;
  });

  // otomatik başlangıç çalıştırma
  // runButton.click();
});