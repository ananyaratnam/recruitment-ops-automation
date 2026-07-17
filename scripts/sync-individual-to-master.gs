/**
 * Recruiter Tracker Sync — Individual Sheet to Master
 * ----------------------------------------------------
 * Deployed inside each recruiter's individual tracker.
 * Syncs "Candidate Tracker" and "Daily Call Log Tracker" tabs
 * into a shared Master tracker, scoped to that recruiter's rows.
 *
 * Design note:
 * An earlier version deleted and re-appended a recruiter's rows on
 * every edit. That caused row-order drift and gaps whenever two
 * recruiters' onEdit events landed close together. This version
 * clears only that recruiter's block in place and rewrites it,
 * then re-sorts by date — no full-sheet rebuild, no drift.
 */

const MASTER_ID = "MASTER_SHEET_ID_HERE";
const RECRUITER_NAME = "RECRUITER_NAME_HERE"; // set per deployment

function onEdit(e) {
  const sheetName = e.source.getActiveSheet().getName();
  if (sheetName === "Candidate Tracker" || sheetName === "Daily Call Log Tracker") {
    syncToMaster(sheetName);
  }
}

function syncToMaster(sheetName) {
  try {
    const source = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    const master = SpreadsheetApp.openById(MASTER_ID).getSheetByName(sheetName);
    if (!source || !master) return;

    const sourceData = source.getDataRange().getValues();
    const masterData = master.getDataRange().getValues();
    const masterLastRow = master.getLastRow();

    let blockStart = -1, blockEnd = -1;
    for (let i = 1; i < masterData.length; i++) {
      if (masterData[i][0] === RECRUITER_NAME) {
        if (blockStart === -1) blockStart = i + 1;
        blockEnd = i + 1;
      }
    }

    const freshRows = [];
    for (let i = 1; i < sourceData.length; i++) {
      const row = sourceData[i];
      if (row.every(cell => cell === "")) continue;
      if (row[0] === "" && row[1] === "") continue;
      freshRows.push([RECRUITER_NAME].concat(row));
    }
    if (freshRows.length === 0) return;

    if (blockStart === -1) {
      master.getRange(masterLastRow + 1, 1, freshRows.length, freshRows[0].length)
            .setValues(freshRows);
    } else {
      const blockSize = blockEnd - blockStart + 1;
      master.getRange(blockStart, 1, blockSize, master.getLastColumn()).clearContent();
      master.getRange(blockStart, 1, freshRows.length, freshRows[0].length)
            .setValues(freshRows);
    }

    const totalRows = master.getLastRow();
    if (totalRows > 2) {
      master.getRange(2, 1, totalRows - 1, master.getLastColumn())
            .sort({ column: 2, ascending: true });
    }
  } catch (err) {
    Logger.log(RECRUITER_NAME + " sync error: " + err);
  }
}

function createTrigger() {
  ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger("syncToMaster")
           .forSpreadsheet(SpreadsheetApp.getActiveSpreadsheet())
           .onEdit()
           .create();
}
