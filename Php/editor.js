// Basit PHP-benzeri yorumlayıcı
document.querySelectorAll(".runBtn").forEach((btn, index) => {
    btn.addEventListener("click", () => {
        const editor = document.querySelectorAll(".editor")[index];
        const output = document.querySelectorAll(".output")[index];

        let code = editor.innerText;

        // PHP etiketlerini temizle
        code = code.replace(/<\?php/i, "").replace(/\?>/i, "");

        // echo "text"
        code = code.replace(/echo\s+"([^"]+)"\s*;?/g,
            '__out.push("$1");');

        // echo $var
        code = code.replace(/echo\s+\$([a-zA-Z_]\w*)\s*;?/g,
            '__out.push($1);');

        // $a → a
        code = code.replace(/\$([a-zA-Z_]\w*)/g, '$1');

        let __out = [];
        try {
            eval(code);
        } catch (err) {
            __out.push("HATA: " + err.message);
        }

        output.innerHTML = __out.join("<br>");
    });
});