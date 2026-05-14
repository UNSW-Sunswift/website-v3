#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMPOSE_FILE="$ROOT_DIR/docker-compose.localstack.yml"
TABLE_NAME="${CMS_TABLE_NAME:-WebsiteV3CMS}"

echo "[init] Checking Docker"
docker --version >/dev/null
docker compose version >/dev/null

if ! docker info >/dev/null 2>&1; then
  echo "[init] Docker daemon is not reachable. Start Docker, then rerun ./init.sh." >&2
  exit 1
fi

echo "[init] Starting LocalStack"
docker compose -f "$COMPOSE_FILE" up --build -d localstack

echo "[init] Waiting for LocalStack DynamoDB"
for attempt in {1..60}; do
  if docker compose -f "$COMPOSE_FILE" exec -T localstack awslocal dynamodb list-tables >/dev/null 2>&1; then
    echo "[init] LocalStack DynamoDB is ready"
    break
  fi

  if [ "$attempt" -eq 60 ]; then
    echo "[init] Timed out waiting for LocalStack DynamoDB" >&2
    docker compose -f "$COMPOSE_FILE" logs --tail 100 localstack >&2
    exit 1
  fi

  sleep 2
done

echo "[init] Applying CMS DynamoDB bootstrap"
docker compose -f "$COMPOSE_FILE" exec -T localstack /etc/localstack/init/ready.d/10-create-cms-table.sh

echo "[init] Verifying DynamoDB table $TABLE_NAME"
docker compose -f "$COMPOSE_FILE" exec -T localstack awslocal dynamodb describe-table --table-name "$TABLE_NAME" >/dev/null

echo "[init] Verifying AWS CDK project"
(
  cd "$ROOT_DIR/aws"
  npm run build
  npm test -- --runInBand
)

echo "[init] Verifying frontend project"
(
  cd "$ROOT_DIR/sunswift-website-v3"
  pnpm typecheck
  pnpm lint
)

echo "[init] Complete. LocalStack endpoint: http://localhost:4566"
