# 🥑 Triatu - Decision Making & Smart Cooking

![CI Status](https://github.com/BobFarreras/TriaTu/actions/workflows/ci.yml/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

**Triatu** és una aplicació web dissenyada per resoldre el conflicte etern: *"Què sopem avui?"*. Utilitza intel·ligència col·lectiva per a grups i Intel·ligència Artificial per generar receptes basades en el teu inventari real.

## 🚀 Funcionalitats Clau

- **🗳️ Sales de Decisió:** Crea sales, convida amics i vota (mode manual o màgic) per decidir plats o plans.
- **🤖 Cuiner IA (Híbrid):** Genera receptes aprofitant el que tens a la nevera. El sistema prioritza receptes guardades i omple els buits amb IA (OpenAI/Gemini).
- **📦 Gestió d'Inventari:** Controla el teu estoc d'aliments amb caducitats i ubicacions (Rebost, Nevera, Congelador).
- **🛡️ Seguretat Avançada:** Protecció contra XSS, Rate Limiting, Validació Zod estricta i Logs d'auditoria.

## 🏗️ Arquitectura Tècnica

El projecte segueix els principis de **Clean Architecture (DDD)** per assegurar escalabilitat i testabilitat:

- **Core (Domain & Use Cases):** Lògica de negoci pura, sense dependències de frameworks.
- **Adapters:** Implementacions concretes (Supabase, OpenAI, UI).
- **Ports:** Interfícies que connecten el Core amb els Adapters.

### Stack Tecnològic
- **Framework:** Next.js 14 (App Router & Server Actions)
- **Llenguatge:** TypeScript
- **Base de Dades & Auth:** Supabase
- **Testing:** Vitest (Unit & Integration)
- **Validació:** Zod
- **Estils:** Tailwind CSS

## 🔒 Seguretat (OWASP Compliant)

Aquest projecte implementa mesures de seguretat robustes:
- **Rate Limiting:** Protecció contra atacs DoS i abús de la IA.
- **Input Validation:** Tots els inputs passen per esquemes `Zod` estrictes.
- **Security Logging:** Registre d'intents d'accés no autoritzat i violacions de límits.
- **RLS (Row Level Security):** Dades aïllades a nivell de base de dades PostgreSQL.

## 🛠️ Instal·lació i Ús

1. **Clonar el repositori:**
   ```bash
   git clone [https://github.com/](https://github.com/)[TEU_USUARI]/[NOM_DEL_REPO].git
   cd triatu

   Instal·lar dependències:
   ```

Bash

pnpm install
Configurar variables d'entorn: Crea un fitxer .env.local amb les teves claus de Supabase i OpenAI.

4. **Iniciar el servidor:**

Bash

pnpm start

5.  Executar en local:

Bash

pnpm dev

✅ Testing
El projecte compta amb una suite de tests completa (més de 30 tests) cobrint casos d'ús, seguretat i adaptadors.

Per executar els tests:

Bash

pnpm test
Per executar en entorn CI (sense watch mode):

Bash

pnpm test:ci

### Com pujar-ho tot

Ara només et queda fer el commit i pujar-ho:

```bash
git add .
git commit -m "docs: Add README and update CI for release branch"
git push origin main