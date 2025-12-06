let SQL;
let db;

initSqlJs({
  locateFile: filename => `https://sql.js.org/dist/${filename}`
}).then(SQLLib => {
  SQL = SQLLib;
  db = new SQL.Database();

  console.log("SQL.js Hazır");

  // 🔥 BURADA HAZIR TABLO OLUŞUYOR 🔥
  const setupSQL = `
    CREATE TABLE users (
      id INTEGER,
      name TEXT,
      age INTEGER
    );

    INSERT INTO users VALUES (1, 'Ali', 25);
    INSERT INTO users VALUES (2, 'Ayşe', 30);
    INSERT INTO users VALUES (3, 'Mehmet', 27);

    CREATE TABLE customers (
      customerID INTEGER,
      customerName TEXT,
      contactName TEXT,
      Address TEXT,
      City TEXT,
      PostalCode TEXT,
      Country TEXT
    );

    INSERT INTO customers VALUES (1,'Alfreds Futterkiste','Maria     Anders','Obere Str. 57','Berlin','12209','Germany');
    INSERT INTO customers VALUES (2,'Ana Trujillo Emparedados y     helados','Ana Trujillo','Avda. de la Constitución 2222',    'México D.F.','05021','Mexico');
    INSERT INTO customers VALUES (3,'Antonio Moreno Taquería',    'Antonio Moreno','Mataderos 2312','México D.F.','05023','Mexico');
    INSERT INTO customers VALUES (4,'Around the Horn','Thomas     Hardy','120 Hanover Sq.','London','WA1 1DP','UK');
    INSERT INTO customers VALUES (5,'Berglunds snabbköp','Christina Berglund','Berguvsvägen 8','Luleå','S-958 22','Sweden');

    CREATE TABLE products (
      productID INTEGER,
      productName TEXT,
      supplierID INTEGER,
      categoryID INTEGER,
      unit TEXT,
      price INTEGER
    );

    INSERT INTO products VALUES (1,'Chais',1,1,'10 boxes x 20 bags',18);
    INSERT INTO products VALUES (2,'Chang',1,1,'24 - 12 oz     bottles',25);
    INSERT INTO products VALUES (3,'Aniseed Syrup',1,2,'12 - 550     ml bottles',10);
    INSERT INTO products VALUES (4,'Chef Anton Cajun     Seasoning',2,2,'48 - 6 oz jars',32);
    INSERT INTO products VALUES (5,'Chef Anton Gumbo Mix',2,2,'36 boxes',41.35);

    CREATE TABLE orders (
      orderID INTEGER,
      customerID INTEGER,
      employeeID INTEGER,
      OrderDate TEXT,
      ShipperID INTEGER
    );

    INSERT INTO orders VALUES (10308,2,7,"1996-09-18",3);
    INSERT INTO orders VALUES (10309,5,3,"1996-09-19",1);
    INSERT INTO orders VALUES (10310,1,8,"1996-09-20",2);

    CREATE TABLE employees (
      EmployeeID INTEGER,
      LastName TEXT,
      FirstName TEXT,
      BirthDate TEXT,
      Photo INTEGER
    );

    INSERT INTO employees VALUES (1,"Davolio","Nancy","12/08/1968","EmpID1.pic");
    INSERT INTO employees VALUES (2,"Fuller","Andrew","19/02/1968","EmpID2.pic");
    INSERT INTO employees VALUES (3,"Leverling","Janet","30/08/1963","EmpID3.pic");
  `;

  db.run(setupSQL);
  console.log("Hazır kullanıcı tablosu oluşturuldu.");
});

// GLOBAL – her editörde çalışır
function runSQL(editorID) {
  const input = document.getElementById(editorID);
  const iframe = document.getElementById(editorID + "_out");

  if (!SQL || !db) {
    iframe.contentDocument.body.innerHTML = "<b>SQL.js henüz yüklenmedi!</b>";
    return;
  }

  try {
    const query = input.value;
    const result = db.exec(query);

    let html = "";

    if (result.length > 0) {
      const columns = result[0].columns;
      const values = result[0].values;

      html += "<table border='1' cellspacing='0' cellpadding='4'><tr>";
      columns.forEach(c => html += `<th>${c}</th>`);
      html += "</tr>";

      values.forEach(row => {
        html += "<tr>";
        row.forEach(col => html += `<td>${col}</td>`);
        html += "</tr>";
      });

      html += "</table>";
    } else {
      html = "<b>Komut başarıyla çalıştı.</b>";
    }

    iframe.contentDocument.body.innerHTML = html;

  } catch (err) {
    iframe.contentDocument.body.innerHTML =
      `<b style='color:red;'>HATA: ${err.message}</b>`;
  }
}