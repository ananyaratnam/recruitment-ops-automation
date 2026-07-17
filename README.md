# Recruitment Ops Automation

## Business Problem
Internal recruitment operations relied on 4–5 separate recruiter-owned tracker sheets, each updated independently. Managers had no consolidated view — checking overall pipeline status meant opening each recruiter's sheet individually. TAT (turnaround time) breaches and drops in individual performance frequently went unnoticed until well after the fact, since there was no alerting mechanism and no single source of truth.

## What I Built
A Google Apps Script automation layer that syncs all individual recruiter trackers into a single Master Tracker in real time, with automated TAT breach alerting.

## How It Works
- **Trigger setup:** Both installable `onEdit` triggers (for instant sync on every edit) and time-based triggers (for scheduled checks) were configured across each recruiter's individual sheet.
- **Data sync:** Candidate records and daily call logs from each recruiter sheet are automatically pulled into the Master Tracker whenever an edit occurs — no manual consolidation needed.
- **Active Requirements push:** Open role requirements added to the Master are automatically pushed down to the relevant recruiter's individual sheet, filtered by assignment, so recruiters always see their current live roles without being manually briefed.
- **Alerting:** Automated email notifications are triggered whenever a candidate or requirement is updated, and separately whenever a role crosses its defined TAT deadline — so breaches are flagged the moment they happen rather than discovered days later.

## Impact
- **Before:** Managers manually opened each of 4–5 individual recruiter sheets to check status; TAT breaches and performance drops were often caught late or missed entirely.
- **After:** Full pipeline status is visible instantly from a single Master dashboard; TAT breaches and missed deadlines trigger automatic email alerts the moment they occur.

## Tech Used
Google Apps Script, Google Sheets (installable triggers, onEdit, time-based triggers), Gmail API for automated notifications.

## Note
This repository documents the system design and logic. The original script was built directly within the organization's live Google Sheets environment; a sanitized, standalone version of the code is being rebuilt here for portfolio purposes.
