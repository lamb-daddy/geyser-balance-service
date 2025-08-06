# Geyser Balance Service

## Usage

```bash
GEYSER_ENDPOINT=<endpoint url> [GEYSER_XTOKEN=<token>] docker-compose up --build
```

## Checking balance example

```bash
docker compose exec postgres bash -c "PAGER=\"less -FX\" PGUSER=postgres PGPASSWORD=postgres psql -c \"\
SELECT address, token, balance, decimals \
FROM balances \
WHERE address = '3LoAYHuSd7Gh8d7RTFnhvYtiTiefdZ5ByamU42vkzd76' \
  AND token = '8YiB8B43EwDeSx5Jp91VQjgBU4mfCgVvyNahadtzpump';\""
```

```
