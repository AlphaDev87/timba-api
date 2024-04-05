## [1.0.0] - 2024-04-05

### Added
- `logtailLogger` sends logs to logtail if ENV == 'production'.
- External API error codes
    + `agent_api_error` indicates something is not working on the casino's agent API
- Token misuse error codes
    + `wrong_token_type` someone is trying to use an access token on the `/auth/refresh` endpoint

### Changed
- Added optional `detail` field to `CustomError` for extra details relating to the original error

## [1.0.0] - 2024-04-04

### Added
- Test case to expect status code 429 on POST `/transactions/cashout`
- LOGTAIL_TOKEN to .env

### Changed
- Restrict Deposits to 1 every 24 hours in `PaymentsDAO.authorizeCreation`
- Upgrade express to 4.19.2
- Upgrade nodemon to 3.1.0
- Moved `TransactionsDAO.authorizeTransaction` into `PaymentsDAO.authorizeCreation`


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