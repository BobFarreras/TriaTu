# 🥑 Triatu — Decision Making & Smart Cooking

![CI Status](https://github.com/BobFarreras/TriaTu/actions/workflows/ci.yml/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

**Triatu** és una aplicació web dissenyada per resoldre el conflicte etern: _"Què sopem avui?"_.
Utilitza intel·ligència col·lectiva per a grups i IA per generar receptes basades en el teu inventari real.

## 🚀 Funcionalitats clau

- **🗳️ Sales de decisió:** crea sales, convida amics i vota (manual o màgic) per decidir plats o plans.
- **🤖 Cuiner IA (híbrid):** genera receptes amb el que tens a la nevera. El sistema prioritza receptes guardades i omple buits amb IA (OpenAI/Gemini).
- **📦 Gestió d'inventari:** control d'estoc amb caducitats i ubicacions (rebost, nevera, congelador).
- **🛡️ Seguretat avançada:** protecció contra XSS, rate limiting, validació Zod estricta i logs d'auditoria.

## 🏗️ Arquitectura tècnica

El projecte segueix **Clean Architecture (DDD)** per assegurar escalabilitat i testabilitat:

- **Core (Domain & Use Cases):** lògica de negoci pura, sense dependències de frameworks.
- **Adapters:** implementacions concretes (Supabase, OpenAI, UI).
- **Ports:** interfícies que connecten el core amb els adapters.

## 📚 Documentació

- **[Guia d'estructura](guia.md)** — mapa de carpetes i flux d'una dada.
- **[Arquitectura](arquitectura_assistent_de_decisions_quotidianes.md)** — principi de Clean Architecture.
- **[Guia de desenvolupament](docs/DEVELOPMENT.md)** — instal·lació, scripts i entorn.
- **[Contribució](docs/CONTRIBUTING.md)** — procés per treballar al repositori.
- **[Seguretat](docs/SECURITY.md)** — pràctiques i punts de contacte.
- **[Auditoria del projecte](docs/PROJECT_AUDIT.md)** — estat actual i deutes pendents.

## 🧰 Requisits

- Node.js 20+
- pnpm
- Supabase project + claus d'accés

## 🛠️ Instal·lació ràpida

```bash
pnpm install
```

Crea un fitxer `.env.local` (veure `docs/DEVELOPMENT.md`) i arrenca el servidor:

```bash
pnpm dev
```

## ✅ Tests

```bash
pnpm test
```

Per executar en entorn CI (sense watch):

```bash
pnpm test:ci
```

## 📦 Scripts

- `pnpm dev` — entorn de desenvolupament.
- `pnpm build` — build de producció.
- `pnpm start` — arrencar build de producció.
- `pnpm lint` — lint.
- `pnpm test` — tests.

## 🔒 Seguretat

Veure la guia completa a `docs/SECURITY.md`.
