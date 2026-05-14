// ─── Sheet names ─────────────────────────────────────────────────────────────
var ACCESS_SHEET      = 'Access';
var TRANSCRIPTS_SHEET = 'Transcripts';

// ─── Entry points ─────────────────────────────────────────────────────────────

function doGet(e) {
  return route(e.parameter);
}

function doPost(e) {
  var params;
  try {
    params = JSON.parse(e.postData.contents);
  } catch (_) {
    params = e.parameter;
  }
  return route(params);
}

// ─── Router ───────────────────────────────────────────────────────────────────

function route(params) {
  try {
    var action = params.action;

    if (action === 'validateCode')   return respond(validateCode(params.code));
    if (action === 'getQueue')       return respond(getQueue());
    if (action === 'getClip')        return respond(getClip(params.clip_id));
    if (action === 'saveTranscript') return respond(saveTranscript(
      params.clip_id,
      params.validated_transcript,
      params.flags
    ));

    return respond({ error: 'Unknown action: ' + action });
  } catch (err) {
    return respond({ error: err.message });
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function respond(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheet(name) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  if (!sheet) throw new Error('Sheet not found: ' + name);
  return sheet;
}

function sheetToObjects(sheet) {
  var data    = sheet.getDataRange().getValues();
  var headers = data[0];
  var rows    = [];
  for (var i = 1; i < data.length; i++) {
    var row = {};
    for (var j = 0; j < headers.length; j++) {
      row[headers[j]] = data[i][j];
    }
    rows.push(row);
  }
  return rows;
}

// ─── Handlers ─────────────────────────────────────────────────────────────────

function validateCode(code) {
  if (!code) return { valid: false };

  var sheet = getSheet(ACCESS_SHEET);
  var data  = sheet.getDataRange().getValues();

  // Row layout: email(0) | invite_code(1) | used(2)
  for (var i = 1; i < data.length; i++) {
    var stored = String(data[i][1]).trim();
    if (stored === String(code).trim()) {
      return { valid: true, token: Utilities.getUuid() };
    }
  }

  return { valid: false };
}

function getQueue() {
  var rows = sheetToObjects(getSheet(TRANSCRIPTS_SHEET));
  return rows.map(function(row) {
    return {
      id:       row.clip_id,
      name:     row.clip_id,
      url:      row.clip_url,
      status:   row.status || 'pending',
      saved_at: row.saved_at,
    };
  });
}

function getClip(clipId) {
  if (!clipId) return { error: 'clip_id is required' };

  var rows = sheetToObjects(getSheet(TRANSCRIPTS_SHEET));
  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    if (String(row.clip_id) === String(clipId)) {
      // original_transcript: JSON array ["w1","w2",...] or plain string
      var originalTranscript = '';
      try {
        var parsed = JSON.parse(row.original_transcript);
        originalTranscript = Array.isArray(parsed) ? parsed.join(' ') : String(row.original_transcript);
      } catch (_) {
        originalTranscript = String(row.original_transcript);
      }

      // Use validated_transcript as working transcript if it exists (plain text string)
      var transcript = (row.validated_transcript && typeof row.validated_transcript === 'string')
        ? row.validated_transcript
        : originalTranscript;

      // Restore flags from previous session
      var flags = [];
      if (row.flags) {
        try { flags = JSON.parse(row.flags); } catch (_) {}
      }

      return {
        id:         row.clip_id,
        name:       row.clip_id,
        url:        row.clip_url,
        transcript: transcript,
        flags:      flags,
        status:     row.status || 'pending',
      };
    }
  }

  return { error: 'Clip not found: ' + clipId };
}

function saveTranscript(clipId, validatedTranscript, flags) {
  if (!clipId) return { error: 'clip_id is required' };

  var sheet   = getSheet(TRANSCRIPTS_SHEET);
  var data    = sheet.getDataRange().getValues();
  var headers = data[0];

  var cols = {
    clip_id:              headers.indexOf('clip_id'),
    validated_transcript: headers.indexOf('validated_transcript'),
    flags:                headers.indexOf('flags'),
    saved_at:             headers.indexOf('saved_at'),
    status:               headers.indexOf('status'),
  };

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][cols.clip_id]) === String(clipId)) {
      var rowNum = i + 1; // Sheets is 1-indexed

      var flagStr = (typeof flags === 'string')
        ? flags
        : JSON.stringify(flags || {});

      var transcriptStr = (typeof validatedTranscript === 'string')
        ? validatedTranscript
        : JSON.stringify(validatedTranscript || {});

      sheet.getRange(rowNum, cols.validated_transcript + 1).setValue(transcriptStr);
      sheet.getRange(rowNum, cols.flags               + 1).setValue(flagStr);
      sheet.getRange(rowNum, cols.saved_at            + 1).setValue(new Date().toISOString());
      sheet.getRange(rowNum, cols.status              + 1).setValue('validated');

      return { success: true };
    }
  }

  return { error: 'Clip not found: ' + clipId };
}

/*
 * ─── README ──────────────────────────────────────────────────────────────────
 *
 * SETUP
 * -----
 * 1. Open your Google Spreadsheet.
 * 2. Create two sheets (tabs) named exactly:
 *      "Access"      — columns: email | invite_code | used
 *      "Transcripts" — columns: clip_id | clip_url | original_transcript |
 *                               validated_transcript | flags | saved_at | status
 *    Row 1 of each sheet must be the header row.
 *
 * 3. Populate "Access" with at least one row:
 *      email: your email (informational only)
 *      invite_code: the code you'll type into the app (e.g. MY_SECRET_CODE)
 *      used: leave blank
 *
 * 4. Populate "Transcripts" with clip rows:
 *      clip_id: unique identifier (e.g. clip_001)
 *      clip_url: public S3 URL of the audio/video file
 *      original_transcript: JSON array of words, e.g. ["Hello","world","..."]
 *      validated_transcript: leave blank
 *      flags: leave blank
 *      saved_at: leave blank
 *      status: pending
 *
 * DEPLOY AS WEB APP
 * -----------------
 * 1. In the Spreadsheet, open Extensions → Apps Script.
 * 2. Delete any existing code and paste the entire contents of this file.
 * 3. Click "Deploy" → "New deployment".
 * 4. Click the gear icon next to "Type" and select "Web app".
 * 5. Set:
 *      Description:        anything (e.g. "v1")
 *      Execute as:         Me
 *      Who has access:     Anyone
 * 6. Click "Deploy" and copy the Web app URL.
 *    It looks like: https://script.google.com/macros/s/AKfy.../exec
 *
 * WIRE UP THE REACT APP
 * ----------------------
 * In the project root, create a .env.local file (copy from .env.example):
 *
 *   VITE_API_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
 *
 * The mock in api.js is active when VITE_API_URL is unset.
 * Once VITE_API_URL is set, all calls go to the real GAS endpoint.
 *
 * NOTE ON CORS
 * ------------
 * GAS automatically adds Access-Control-Allow-Origin: * to all responses.
 * However, POST requests with Content-Type: application/json trigger a
 * preflight OPTIONS request that GAS cannot respond to (CORS failure).
 *
 * This is handled by sending POST bodies as Content-Type: text/plain —
 * a "simple" content type that skips preflight. GAS receives the JSON body
 * via e.postData.contents and parses it normally. No changes needed on the
 * GAS side; the React api.js is already written this way.
 *
 * RE-DEPLOYING AFTER CHANGES
 * --------------------------
 * Every time you edit Code.gs you must create a NEW deployment (not "manage
 * existing") for the changes to take effect on the /exec URL. The script
 * editor's "Test" URL (/dev) always runs the latest saved code and is useful
 * for quick testing without redeploying.
 * ─────────────────────────────────────────────────────────────────────────────
 */
