# Scripts

## sync-individual-to-master.gs
Deployed inside each recruiter's individual tracker sheet. Fires on every
edit via an installable `onEdit` trigger, syncing that recruiter's rows
into the shared Master tracker in place (no delete-and-readd, which was
the source of an earlier bug — see comments in the file).

## master-hourly-safety-sync.gs
Deployed inside the Master tracker itself. Runs on a 1-hour time-based
trigger as a fallback layer, independent of the instant per-edit sync,
so a single missed trigger doesn't silently desync the data.

## Why two layers
The instant sync (onEdit) gives near-real-time visibility for managers.
The hourly sync is a safety net — if an onEdit trigger fails to fire for
any reason, the sheet is never more than an hour out of date.
