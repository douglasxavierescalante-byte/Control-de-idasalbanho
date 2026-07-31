// PEGA ESTE CÓDIGO EN Extensiones > Apps Script DE TU GOOGLE SHEET
// Crea automáticamente una pestaña por cada grado la primera vez que se usa.
//
// NOTA: todo se maneja con peticiones GET (incluso para guardar datos) y
// soporta JSONP (parámetro "callback"). Esto evita el bloqueo de CORS que
// ocurre cuando una página en otro dominio (como GitHub Pages) intenta usar
// fetch() contra una Web App de Apps Script.

function doGet(e) {
  var action = (e.parameter.action || "list");
  var result;
  try {
    if (action === "list") {
      result = listRecords(e.parameter.grade);
    } else if (action === "salida") {
      result = addSalida(e.parameter);
    } else if (action === "regreso") {
      result = addRegreso(e.parameter);
    } else {
      result = { status: "error", message: "Acción desconocida." };
    }
  } catch (err) {
    result = { status: "error", message: String(err.message || err) };
  }
  return sendResponse(result, e.parameter.callback);
}

function listRecords(grade) {
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
  return { status: "ok", records: records };
}

function addSalida(p) {
  var sheet = getSheet(p.grade);
  var id = new Date().getTime() + "-" + Math.floor(Math.random() * 1000);
  sheet.appendRow([id, p.name, p.gradeLabel || "", p.motivo || "", new Date(), "", p.observaciones || ""]);
  var lastRow = sheet.getLastRow();
  sheet.getRange(lastRow, 5).setNumberFormat("h:mm:ss AM/PM");
  return { status: "ok", id: id };
}

function addRegreso(p) {
  var sheet = getSheet(p.grade);
  var data = sheet.getDataRange().getValues();
  for (var i = data.length - 1; i >= 1; i--) {
    if (data[i][1] === p.name && !data[i][5]) {
      var rowIndex = i + 1;
      sheet.getRange(rowIndex, 6).setValue(new Date());
      sheet.getRange(rowIndex, 6).setNumberFormat("h:mm:ss AM/PM");
      if (p.observaciones) {
        sheet.getRange(rowIndex, 7).setValue(p.observaciones);
      }
      return { status: "ok" };
    }
  }
  return { status: "error", message: "No se encontró una salida activa para ese estudiante." };
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

function sendResponse(obj, callback) {
  var json = JSON.stringify(obj);
  if (callback) {
    return ContentService
      .createTextOutput(callback + "(" + json + ")")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}
