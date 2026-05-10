---
title: Shellcode
icon: lucide:square-code
---

# Shellcode

Geen `scope`-frontmatter — valt terug op fallback-gedrag in de scope-walk.

## Basis

Shellcode is machine-code die in een running process wordt geïnjecteerd om een bepaalde actie uit te voeren — typisch een shell openen.

## Voorbeeld (x86-64 Linux)

```asm
mov rax, 59      ; sys_execve
mov rdi, rsp     ; "/bin/sh"
xor rsi, rsi
xor rdx, rdx
syscall
```
