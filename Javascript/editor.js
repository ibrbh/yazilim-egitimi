document.querySelectorAll('[data-editor]').forEach(block => {
      const htmlTextarea = block.querySelector('.htmlCode');
      const cssTextarea = block.querySelector('.cssCode');
      const jsTextarea = block.querySelector('.jsCode');
      const runBtn = block.querySelector('.run-btn');
      const output = block.querySelector('.output');

      const htmlEditor = CodeMirror.fromTextArea(htmlTextarea, {
        mode: "xml",
        htmlMode: true,
        theme: "dracula",
        lineNumbers: true
      });

      const cssEditor = CodeMirror.fromTextArea(cssTextarea, {
        mode: "css",
        theme: "dracula",
        lineNumbers: true
      });

      const jsEditor = CodeMirror.fromTextArea(jsTextarea, {
        mode: "javascript",
        theme: "dracula",
        lineNumbers: true
      });

      runBtn.addEventListener("click", () => {
        const html = htmlEditor.getValue();
        const css = `<style>${cssEditor.getValue()}</style>`;
        const js = `<script>${jsEditor.getValue()}<\/script>`;
        output.srcdoc = html + css + js;
      });
    });