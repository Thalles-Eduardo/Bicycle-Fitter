# Spec: Versão Responsiva (Bike + Frames Configurator)

**Data:** 2026-06-16
**Status:** Aprovado

## Objetivo

Tornar as duas telas (`bikeConfiguration` e `framesConfiguration`) totalmente
responsivas, sem alterar o comportamento atual no desktop. Mobile-first com o
breakpoint `md:` (768px) restaurando exatamente o layout desktop existente.

## Decisões aprovadas

- **Layout mobile:** Empilhado (bike/hero em cima, configuração embaixo) com
  scroll vertical. Desktop mantém lado-a-lado.
- **Escopo:** Mobile + Desktop (uma base mobile + overrides `md:`).
- **Animações:** Simplificar no mobile — sem slides horizontais (evita overflow);
  fade + leve `y`. Desktop mantém a timeline atual. Respeitar
  `prefers-reduced-motion`.

## Mudanças de layout (mobile base → `md:` desktop)

### `<main>`
- Mobile: `flex-col` + scroll vertical.
- `md:`: `flex-row md:overflow-hidden` (comportamento atual).

### Seção da bike (hero, lado esquerdo)
- Mobile: `w-full`, padding menor, conteúdo centralizado.
- `md:`: `w-180 md:px-20 md:py-15` (atual).

### Seção de configuração (lado direito)
- Mobile: `w-full px-6 py-10`.
- `md:`: `w-1/1 md:px-25 md:py-15`.
- Wrapper interno `max-w-162.5 ml-auto` → mobile `w-full`.

### Visual da bike
- Mobile: `relative w-full mx-auto` (flui no fluxo, dá altura ao hero).
- `md:`: `absolute w-250 bottom-45 left-25` (atual).
- O `.relative` interno e as posições `%` das rodas **não mudam** — escalam
  junto com o frame.

### Tipografia
- Texto grande "WHEELS"/"FRAMES": `text-[64px] text-center relative`
  → `md:text-[180px] md:text-left md:absolute md:top-70`.
- "Configure the Bike/Frame": `text-[32px]` → `md:text-[64px]`.
- "Construction Mode": `text-[26px]` → `md:text-[40px]`.
- Descrição: `text-[16px]` → `md:text-[24px]`.
- Títulos Wheels/Frames: `text-[28px]` → `md:text-[48px]`.

### Seletor (wheels/frames)
- `flex gap-16` → mobile `flex-wrap justify-center gap-6`; `md:gap-16`.
- Cards `w-28 h-28` mantidos.

## GSAP — `gsap.matchMedia()`

Substituir `gsap.context()` por `gsap.matchMedia()`:
- `"(min-width: 768px)"`: timeline atual (slides `xPercent` + SplitText + hover).
- `"(max-width: 767px)"`: timeline leve (fade + `y`, sem slides horizontais).
- `"(prefers-reduced-motion: reduce)"`: revela sem animação (set imediato).

## Verificação

Screenshots headless Chrome de ambas as páginas:
- Mobile: 390px de largura.
- Desktop: 1280px de largura.

Confirmar: sem overflow horizontal no mobile, rodas encaixadas no frame em ambas
larguras, layout desktop inalterado.

## Arquivos

- `app/bikeConfiguration/page.tsx`
- `app/framesConfiguration/page.tsx`
- `app/globals.css` (se necessário)
