// Her editör için ayrı CodeMirror oluştur ve React kodunu çalıştır
document.querySelectorAll("[data-editor]").forEach((editor) => {
  const textarea = editor.querySelector(".react-code");
  const runButton = editor.querySelector(".run-btn");
  const iframe = editor.querySelector(".output");

  const cm = CodeMirror.fromTextArea(textarea, {
    mode: "javascript",
    theme: "material-darker",
    lineNumbers: true,
    tabSize: 2,
  });

  const runReactCode = () => {
    const jsCode = cm.getValue();
    const htmlContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8" />
              <script src="https://unpkg.com/react@18/umd/react.development.js"><\/script>
              <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"><\/script>
              <script src="https://unpkg.com/@babel/standalone/babel.min.js"><\/script>
            </head>
            <body>
              <div id="root"></div>
              <script type="text/babel">
                ${jsCode}
              <\/script>
            </body>
          </html>
        `;
    iframe.srcdoc = htmlContent;
  };

  runButton.addEventListener("click", runReactCode);
  runReactCode(); // sayfa yüklenince otomatik çalıştır
});