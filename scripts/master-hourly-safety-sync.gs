/**
 * Master Tracker — Hourly Safety-Net Sync
 * -----------------------------------------
 * Runs independently of the instant onEdit sync deployed in each
 * recruiter's sheet. Acts as a fallback in case an onEdit trigger
 * fails to fire (e.g. edits made via API, or a trigger misfiring) —
 * pulls a clean copy from every recruiter's sheet on a fixed interval.
 */

const RECRUITER_SHEETS = {
  "RECRUITER_1_NAME": "RECRUITER_1_SHEET_ID",
  "RECRUITER_2_NAME": "RECRUITER_2_SHEET_ID"
};

function clearBelowHeader(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clearContent();
  }
}

function pullIntoMaster(masterSheet, sourceId, sourceName, sourceSheetName) {
  const sheet = SpreadsheetApp.openById(sourceId).getSheetByName(sourceSheetName);
  if (!sheet) return;
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i].every(cell => cell === "")) continue;
    const lastRow = masterSheet.getLastRow() + 1;
    masterSheet.getRange(lastRow, 1).setValue(sourceName);
    masterSheet.getRange(lastRow, 2, 1, data[i].length).setValues([data[i]]);
  }
}

function syncTab(tabName) {
  const master = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(tabName);
  clearBelowHeader(master);
  Object.entries(RECRUITER_SHEETS).forEach(([name, id]) => {
    pullIntoMaster(master, id, name, tabName);
  });
}

function syncAll() {
  syncTab("Candidate Tracker");
  syncTab("Daily Call Log Tracker");
}

function createHourlyTrigger() {
  ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger("syncAll").timeBased().everyHours(1).create();
}
