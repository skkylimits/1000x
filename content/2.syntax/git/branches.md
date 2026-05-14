---
title: Branches
icon: lucide:git-branch
---

# Branches

## Maken en switchen

```bash
git switch -c feature/foo
```

## Mergen

```bash
git switch main
git merge feature/foo
```

## Rebase

```bash
git switch feature/foo
git rebase main
```

Gebruik rebase voor lokale branches; merge voor gedeelde history.
