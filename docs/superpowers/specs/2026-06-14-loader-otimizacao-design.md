# Loader inicial + Otimizações — Design

Data: 2026-06-14

## Objetivo

Adicionar uma tela de loader inicial que garanta o carregamento de todos os
recursos (imagens) antes de exibir a interface, e aplicar otimizações de
performance + correção de bugs no projeto bike-website (Next.js 16 / React 19 /
Tailwind v4 / GSAP / Zustand).

## Decisões

- **Escopo do loader:** apenas na 1ª visita por sessão (mantém a lógica atual de
  `sessionStorage "home-visited"`).
- **Estilo:** minimalista da marca — fundo `dark-blue`, ícone da bike, wordmark
  "Ride Your Bike", barra de progresso e contador `%`.
- **Otimização:** corrigir bugs + performance.

## Componentes

### `app/components/Loader.tsx` (novo)

- Componente apresentacional. Prop: `progress: number` (0–100).
- Overlay fullscreen `fixed inset-0 z-50`, fundo `dark-blue`, centralizado.
- Conteúdo: ícone `/icon-bike.png`, wordmark "Ride Your Bike", barra de progresso
  (paleta `red`/`light-red`) e contador `NN%`.
- Fade-out suave por opacidade ao concluir.
- Respeita `prefers-reduced-motion`.

### Integração — `app/bikeConfiguration/page.tsx`

- Mantém lógica de 1ª visita por sessão.
- Renderiza `<Loader progress={progress} />` enquanto `loading === true`.
- `main` continua entrando com opacidade 0 e animado pelo GSAP ao finalizar.

## Otimizações

1. **Bug de case:** renomear `public/Wheel-4.png` → `public/wheel-4.png`
   (`git mv`). Hoje quebra em deploy case-sensitive; o código já referencia
   minúsculo.
2. **Pré-carregar todos os assets:** incluir `frame-2/3/4.png` e todas as wheels
   no array de preload (hoje só `frame-1` é pré-carregado).
3. **`next/image`:** trocar `loading="eager"` por `priority` na imagem principal;
   adicionar `sizes` em imagens grandes e thumbnails.
4. **Limpeza:** remover imports não usados (`Link`), normalizar import do store
   (sem extensão `.ts`), mover arrays estáticos para fora do componente.

## Fora de escopo

Conversão de formato de imagens, code-splitting do GSAP, reestruturação de
páginas.
