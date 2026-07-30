// PEGA ESTE CÓDIGO EN Extensiones > Apps Script DE TU GOOGLE SHEET
// Crea automáticamente una pestaña por cada grado la primera vez que se usa.

function doGet(e) {
  var grade = e.parameter.grade;
  var sheet = getSheet(grade);
  var data = sheet.getDataRange().getValues();
  var rows = data.slice(1);
  var records = rows
    .filter(function (r) { return r[0]; })
    .map(function (r) {
      return {
        id: r[0],
        name: r[1],
        motivo: r[3],
        salida: r[4] ? new Date(r[4]).getTime() : null,
        regreso: r[5] ? new Date(r[5]).getTime() : null,
        observaciones: r[6]
      };
    });
  return respond({ records: records });
}

function doPost(e) {
  var body = JSON.parse(e.postData.contents);
  var sheet = getSheet(body.grade);

  if (body.action === "salida") {
    var id = new Date().getTime() + "-" + Math.floor(Math.random() * 1000);
    sheet.appendRow([id, body.name, body.gradeLabel, body.motivo || "", new Date(), "", body.observaciones || ""]);
    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 5).setNumberFormat("h:mm:ss AM/PM");
    return respond({ status: "ok", id: id });
  }

  if (body.action === "regreso") {
    var data = sheet.getDataRange().getValues();
    for (var i = data.length - 1; i >= 1; i--) {
      if (data[i][1] === body.name && !data[i][5]) {
        var rowIndex = i + 1;
        sheet.getRange(rowIndex, 6).setValue(new Date());
        sheet.getRange(rowIndex, 6).setNumberFormat("h:mm:ss AM/PM");
        if (body.observaciones) {
          sheet.getRange(rowIndex, 7).setValue(body.observaciones);
        }
        return respond({ status: "ok" });
      }
    }
    return respond({ status: "error", message: "No se encontró una salida activa para ese estudiante." });
  }

  return respond({ status: "error", message: "Acción desconocida." });
}

function getSheet(gradeKey) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(gradeKey);
  if (!sheet) {
    sheet = ss.insertSheet(gradeKey);
    sheet.appendRow(["ID", "Nombre del estudiante", "Grado y sección", "Motivo de salida", "Salida", "Regreso", "Observaciones"]);
    sheet.getRange(1, 1, 1, 7).setFontWeight("bold").setBackground("#1E3450").setFontColor("#FFFFFF");
    sheet.setColumnWidth(2, 240);
  }
  return sheet;
}

function respond(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
