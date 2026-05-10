#!/usr/bin/env bash
set -euo pipefail

[[ -f package.json ]] || exit 0

run() {
	local label=$1; shift
	echo "▶ $label" >&2
	if ! "$@" >&2; then
		echo "✖ $label faalde — fix voor je verder gaat" >&2
		exit 2
	fi
}

run "Lint"       pnpm lint:fix
run "Type check" pnpm typecheck
run "Unit tests" pnpm test

exit 0
