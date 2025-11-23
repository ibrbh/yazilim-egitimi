// -------------------
// Sanal veritabanı oluştur
// -------------------
function createDB() {
    return {
        users: [
            { id: 1, name: "Ali", email: "ali@example.com" },
            { id: 2, name: "Veli", email: "veli@example.com" },
            { id: 3, name: "Ayşe", email: "ayse@example.com" }
        ]
    };
}

// Multi editör DB
let DB_POOL = {
    1: createDB(),
    2: createDB()
};

// -------------------
// SQL ÇALIŞTIR
// -------------------
function runSQL(editorId) {
    const sql = document.getElementById("sqlEditor_" + editorId).value.trim();
    const output = document.getElementById("output_" + editorId);
    const DB = DB_POOL[editorId];
    output.innerHTML = "";

    try {
        const lower = sql.toLowerCase();

        // ----- SELECT -----
        if (lower.startsWith("select")) {
            const tableMatch = sql.match(/from\s+(\w+)/i);
            if (!tableMatch) throw "Tablo bulunamadı";
            const table = tableMatch[1];
            if (!DB[table]) throw "Tablo bulunamadı: " + table;

            let columnsMatch = sql.match(/select\s+(.*)\s+from/i);
            let columns = columnsMatch ? columnsMatch[1].split(",").map(c=>c.trim()) : ["*"];

            // WHERE varsa
            let rows = DB[table];
            let whereMatch = sql.match(/where\s+(.*)/i);
            if (whereMatch) {
                let condition = whereMatch[1].replace(/;/,"");
                let condMatch = condition.match(/(\w+)\s*=\s*['"]?(.*?)['"]?$/);
                if (condMatch) {
                    const col = condMatch[1];
                    const val = condMatch[2];
                    rows = rows.filter(r => r[col]==val);
                }
            }

            // Sütun seçimi
            if (!(columns.length==1 && columns[0]=="*")) {
                rows = rows.map(r => {
                    let obj = {};
                    columns.forEach(c => obj[c]=r[c]);
                    return obj;
                });
            }

            renderTable(rows, output);
            return;
        }

        // ----- INSERT -----
        if (lower.startsWith("insert")) {
            const tableMatch = sql.match(/into\s+(\w+)/i);
            if (!tableMatch) throw "Tablo bulunamadı";
            const table = tableMatch[1];
            if (!DB[table]) throw "Tablo bulunamadı: " + table;

            const valuesMatch = sql.match(/values\s*\((.*)\)/i);
            if (!valuesMatch) throw "VALUES bulunamadı";

            let values = valuesMatch[1].split(",").map(v=>v.trim().replace(/'/g,""));
            const columns = Object.keys(DB[table][0]); // otomatik kolon

            let newRow = {};
            columns.forEach((c,i)=>{
                if(c=="id") newRow[c] = DB[table].length + 1;
                else newRow[c] = values[i-1] || "";
            });

            DB[table].push(newRow);
            output.innerHTML = "Kayıt eklendi.";
            return;
        }

        // ----- DELETE -----
        if (lower.startsWith("delete")) {
            const tableMatch = sql.match(/from\s+(\w+)/i);
            if (!tableMatch) throw "Tablo bulunamadı";
            const table = tableMatch[1];
            if (!DB[table]) throw "Tablo bulunamadı: " + table;

            let whereMatch = sql.match(/where\s+(.*)/i);
            if(whereMatch){
                let condition = whereMatch[1].replace(/;/,"");
                let condMatch = condition.match(/(\w+)\s*=\s*['"]?(.*?)['"]?$/);
                if(condMatch){
                    const col = condMatch[1], val = condMatch[2];
                    DB[table] = DB[table].filter(r => r[col] != val);
                }
            } else {
                DB[table] = [];
            }

            output.innerHTML = "Satırlar silindi.";
            return;
        }

        // ----- UPDATE -----
        if (lower.startsWith("update")) {
            const tableMatch = sql.match(/update\s+(\w+)/i);
            if (!tableMatch) throw "Tablo bulunamadı";
            const table = tableMatch[1];
            if (!DB[table]) throw "Tablo bulunamadı: " + table;

            const setMatch = sql.match(/set\s+(.*)\s*(where|$)/i);
            if (!setMatch) throw "SET kısmı bulunamadı";

            let setPairs = setMatch[1].split(",").map(s=>s.trim());
            let updates = {};
            setPairs.forEach(pair => {
                let [k,v] = pair.split("=");
                updates[k.trim()] = v.trim().replace(/'/g,"");
            });

            let whereMatch = sql.match(/where\s+(.*)/i);
            if(whereMatch){
                let condition = whereMatch[1].replace(/;/,"");
                let condMatch = condition.match(/(\w+)\s*=\s*['"]?(.*?)['"]?$/);
                if(condMatch){
                    const col = condMatch[1], val = condMatch[2];
                    DB[table].forEach(r=>{
                        if(r[col]==val){
                            Object.keys(updates).forEach(k=>r[k]=updates[k]);
                        }
                    });
                }
            } else {
                DB[table].forEach(r=>{
                    Object.keys(updates).forEach(k=>r[k]=updates[k]);
                });
            }

            output.innerHTML = "Satırlar güncellendi.";
            return;
        }

        throw "Bu SQL komutu desteklenmiyor.";

    } catch(err){
        output.innerHTML = "<span style='color:red'>" + err + "</span>";
    }
}

// -------------------
// TABLO ÇİZDIR
// -------------------
function renderTable(rows, outputEl){
    if(rows.length===0){
        outputEl.innerHTML = "Tablo boş.";
        return;
    }
    let html = "<table><tr>";
    Object.keys(rows[0]).forEach(c=>html += "<th>"+c+"</th>");
    html += "</tr>";

    rows.forEach(r=>{
        html += "<tr>";
        Object.values(r).forEach(v=>html+="<td>"+v+"</td>");
        html += "</tr>";
    });

    html += "</table>";
    outputEl.innerHTML = html;
}