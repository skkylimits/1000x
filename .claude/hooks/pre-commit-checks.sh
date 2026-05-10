#!/usr/bin/env bash
set -euo pipefail

input=$(cat)
command=$(printf '%s' "$input" | jq -r '.tool_input.command // empty')

[[ "$command" =~ git[[:space:]]+commit ]] || exit 0
[[ -f package.json ]] || { echo "↪ pre-commit: package.json ontbreekt, overgeslagen" >&2; exit 0; }

ui_pattern='\.(vue|ts|tsx|js|jsx|css|scss)$|^(app|components|pages|layouts|composables|plugins)/'
if git diff --cached --name-only | grep -qE "$ui_pattern"; then
	echo "▶ E2E tests" >&2
	if ! pnpm test:e2e >&2; then
		echo "✖ E2E faalde — fix voor je opnieuw commit" >&2
		exit 2
	fi
	echo "✓ E2E groen" >&2
else
	echo "↪ E2E overgeslagen (geen UI-changes staged)" >&2
fi

exit 0
