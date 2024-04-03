## [1.0.0] - 2024-04-03

### Added
- Throw if Deposit with given `tracking_number` already exists in `DepositDAO.authorizeConfirmation`

### Changed
- Gave agent permission to confirm deposit in `DepositDAO.authorizeTransaction`.
- Added `Player` to `Deposit` object of `DepositResult`.
- Removed `TransactionsController.deleteDeposit`.
- Fixed `FinanceServices.finalizeDeposit` to stop it transfering coins on "confirmed" deposits
- GET `/agent/deposits/complete` is now GET `/agent/pending/depoists`

## [1.0.0] - 2024-04-02

### Added
- Option to pass id to `/agent/deposits` route te retrieve individual deposit.
- POST `/agent/deposits/:id` route to update deposit's `tracking_number`.

## [1.0.0] - 2024-04-01

### Added
- CHANGELOG.md.
- Deposit rate limiter (1 request with same `tracking_number` every 10 seconds).

### Changed
- Added .vscode/settings.json to .gitignore