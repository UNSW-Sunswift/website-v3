# AGENTS.md

This repository is designed for long-running coding-agent work. The goal is not
to maximize raw code output. The goal is to leave the repo in a state where the
next session can continue without guessing.

## Startup Workflow

Before writing code:

1. Confirm the working directory with `pwd`.
2. Read `claude-progress.md` for the latest verified state and next step.
3. Read `feature_list.json` and choose the highest-priority unfinished feature.
4. Review recent commits with `git log --oneline -5`.
5. Run `./init.sh`.
6. Run the required smoke or end-to-end verification before starting new work.

If baseline verification is already failing, fix that first. Do not stack new
feature work on top of a broken starting state.

## Working Rules

- Work on one feature at a time.
- Do not mark a feature complete just because code was added.
- Keep changes within the selected feature scope unless a blocker forces a
  narrow supporting fix.
- Do not silently change verification rules during implementation.
- Prefer durable repo artifacts over chat summaries.

## Required Artifacts

- `feature_list.json`: source of truth for feature state
- `claude-progress.md`: session log and current verified status
- `init.sh`: standard startup and verification path
- `session-handoff.md`: optional compact handoff for larger sessions

## Local CMS Harness

This repository uses LocalStack to provide a local DynamoDB-backed CMS harness
for the webapp.

- `docker-compose.localstack.yml` builds `localstack/Dockerfile` and exposes
  LocalStack on `http://localhost:4566`.
- `localstack/init/ready.d/10-create-cms-table.sh` creates the
  `WebsiteV3CMS` table with `id` as the partition key and `type` as the sort
  key, then seeds a minimal CMS collection and page record.
- Run `./init.sh` before feature work. It starts LocalStack, waits for the
  DynamoDB table, then runs the AWS CDK build/test checks and frontend
  typecheck/lint checks.
- Local app code should use `AWS_ENDPOINT_URL=http://localhost:4566`,
  `AWS_REGION=ap-southeast-2`, `CMS_TABLE_NAME=WebsiteV3CMS`, and dummy local
  AWS credentials when talking to LocalStack.

## Definition Of Done

A feature is done only when all of the following are true:

- the target behavior is implemented
- the required verification actually ran
- evidence is recorded in `feature_list.json` or `claude-progress.md`
- the repository remains restartable from the standard startup path

## End Of Session

Before ending a session:

1. Update `claude-progress.md`.
2. Update `feature_list.json`.
3. Record any unresolved risk or blocker.
4. Commit with a descriptive message once the work is in a safe state.
5. Leave the repo clean enough for the next session to run `./init.sh`
   immediately.
