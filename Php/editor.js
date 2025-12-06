/* ==========================================================
   PHP-LIKE RUNTIME (CLIENT SIDE)
   Bütün temel PHP fonksiyonları JS ile yeniden yazıldı.
   ========================================================== */

window.PHP = {};

// ---- STRING FUNCTIONS ----
PHP.strlen = s => (s ?? "").length;
PHP.strrev = s => (s ?? "").split("").reverse().join("");
PHP.strtolower = s => (s ?? "").toLowerCase();
PHP.strtoupper = s => (s ?? "").toUpperCase();
PHP.substr = (s, a, b) => (s ?? "").substr(a, b);
PHP.strpos = (s, find) => (s ?? "").indexOf(find);
PHP.trim = s => (s ?? "").trim();
PHP.ltrim = s => (s ?? "").replace(/^\s+/, "");
PHP.rtrim = s => (s ?? "").replace(/\s+$/, "");

PHP.ucfirst = s => (s ?? "").charAt(0).toUpperCase() + (s ?? "").slice(1);
PHP.lcfirst = s => (s ?? "").charAt(0).toLowerCase() + (s ?? "").slice(1);

PHP.ucwords = s => (s ?? "").replace(/\b\w/g, c => c.toUpperCase());

PHP.explode = (delimiter, s) => (s ?? "").split(delimiter);
PHP.implode = (glue, arr) => arr.join(glue);

PHP.str_repeat = (s, times) => (s ?? "").repeat(times);

PHP.addslashes = s =>
    (s ?? "")
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"');

PHP.stripslashes = s =>
    (s ?? "")
        .replace(/\\'/g, "'")
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, "\\");

PHP.htmlspecialchars = s =>
    (s ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

PHP.nl2br = s => (s ?? "").replace(/\n/g, "<br>");

PHP.wordwrap = (s, width = 75, br = "\n") =>
    (s ?? "").replace(
        new RegExp(`(.{1,${width}})(\\s+|$)`, "g"),
        "$1" + br
    );

PHP.chr = num => String.fromCharCode(num);
PHP.ord = char => (char ?? "").charCodeAt(0);

/* BENZERLİK / MESAFE */
PHP.similar_text = (a, b) => {
    a = a ?? ""; b = b ?? "";
    let matches = 0;
    const min = Math.min(a.length, b.length);
    for (let i = 0; i < min; i++) if (a[i] === b[i]) matches++;
    return matches;
};

PHP.levenshtein = (a, b) => {
    a = a ?? ""; b = b ?? "";
    const dp = Array(a.length + 1).fill(null).map(() =>
        Array(b.length + 1).fill(0)
    );
    for (let i = 0; i <= a.length; i++) dp[i][0] = i;
    for (let j = 0; j <= b.length; j++) dp[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            dp[i][j] = Math.min(
                dp[i - 1][j] + 1,
                dp[i][j - 1] + 1,
                dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
            );
        }
    }
    return dp[a.length][b.length];
};

/* ŞİFRELEME */
PHP.md5 = s => CryptoJS.MD5(s ?? "").toString();
PHP.sha1 = s => CryptoJS.SHA1(s ?? "").toString();

/* SÖZLÜK & QUERY FORMATLARI */
PHP.parse_str = (str, obj = {}) => {
    (str ?? "").split("&").forEach(pair => {
        const [key, val] = pair.split("=");
        obj[decodeURIComponent(key)] = decodeURIComponent(val || "");
    });
    return obj;
};

PHP.http_build_query = obj =>
    Object.keys(obj)
        .map(k => encodeURIComponent(k) + "=" + encodeURIComponent(obj[k]))
        .join("&");

/* PADDING */
PHP.str_pad = (s, len, pad = " ", type = "right") => {
    s = s ?? "";
    if (s.length >= len) return s;

    const diff = len - s.length;
    if (type === "left") return pad.repeat(diff).slice(0, diff) + s;
    if (type === "both") {
        const left = Math.floor(diff / 2);
        const right = diff - left;
        return pad.repeat(left).slice(0, left) + s + pad.repeat(right).slice(0, right);
    }
    return s + pad.repeat(diff).slice(0, diff); // right
};

/* FORMATLAMA */
PHP.number_format = (num, decimals = 0, decPoint = ".", thousands = ",") => {
    num = Number(num) || 0;
    const parts = num.toFixed(decimals).split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousands);
    return parts.join(decPoint);
};

/* KELİME AYIRMA / SES ÇIKARIMI */
PHP.soundex = function (s) {
    s = (s ?? "").toUpperCase();
    if (!s) return "";

    const first = s[0];
    const map = { B: 1, F: 1, P: 1, V: 1, C: 2, G: 2, J: 2, K: 2, Q: 2, S: 2, X: 2, Z: 2, D: 3, T: 3, L: 4, M: 5, N: 5, R: 6 };
    let code = first;

    let prev = map[first] ?? "";
    for (let i = 1; i < s.length; i++) {
        const c = s[i];
        const v = map[c] ?? "";
        if (v !== "" && v !== prev) code += v;
        if (code.length === 4) break;
        prev = v;
    }
    return (code + "0000").slice(0, 4);
};

/* PHP'nin basit metaphone sürümü */
PHP.metaphone = s => {
    s = (s ?? "").toLowerCase().replace(/[^a-z]/g, "");
    return s
        .replace(/^kn/, "n")
        .replace(/^gn/, "n")
        .replace(/^pn/, "n")
        .replace(/^ae/, "e")
        .replace(/([^c])h/g, "$1")
        .replace(/ph/g, "f")
        .replace(/([aeiou])h/g, "$1")
        .toUpperCase();
};

// ---- ARRAY FUNCTIONS ----
PHP.explode = (sep, str) => (str ?? "").split(sep);
PHP.implode = (sep, arr) => (arr ?? []).join(sep);
PHP.count = arr => (arr ?? []).length;
PHP.in_array = (val, arr) => (arr ?? []).includes(val);

// -----------------------------------------------------------
// PHP → JS dönüştürücü
// -----------------------------------------------------------
function phpToJs(code) {
    // <?php ?> temizle
    code = code.replace(/<\?php/i, "").replace(/\?>/i, "");

    // array(...) → [...]
    while (/array\s*\(/i.test(code)) {
        code = code.replace(/array\s*\((.*?)\)/is, "[$1]");
    }

    // $var → var
    code = code.replace(/\$([a-zA-Z_]\w*)/g, "$1");

    // PHP string fonksiyonları → PHP.<function>()
    const funcs = [
        "strlen", "strrev", "substr", "strpos",
        "strtolower", "strtoupper",
        "explode", "implode",
        "count", "in_array"
    ];

    funcs.forEach(fn => {
        let r = new RegExp("\\b" + fn + "\\s*\\(", "g");
        code = code.replace(r, `PHP.${fn}(`);
    });

    // echo → __out.push()
    code = code.replace(/echo\s+([^;]+);?/gi, "__out.push($1);");

    return code;
}

// -----------------------------------------------------------
// Editör çalıştırıcı
// -----------------------------------------------------------
document.querySelectorAll(".runBtn").forEach((btn, i) => {
    btn.addEventListener("click", () => {

        const editor = document.querySelectorAll(".editor")[i];
        const output = document.querySelectorAll(".output")[i];

        let code = editor.innerText;
        code = phpToJs(code);

        let __out = [];

        try {
            (function () { eval(code); })();
        } catch (e) {
            __out.push("HATA: " + e.message);
        }

        output.innerHTML = __out.join("<br>");
    });
});