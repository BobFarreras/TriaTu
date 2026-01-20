# 📘 Documentació Tècnica: Projecte Rebost (Refactorització v2)

Benvingut a l'equip! Aquesta documentació descriu la nova arquitectura del gestor d'inventari intel·ligent, centrant-se en la integració amb l'API de Bonpreu, el sistema d'escaneig amb IA i la gestió d'estoc.

---

## 🏗️ 1. Arquitectura i Estructura del Projecte

El projecte segueix els principis de **Clean Architecture** i **Domain-Driven Design (DDD)** per desacoblar la lògica de negoci de la infraestructura (UI, Bases de Dades, APIs externes).

### 📂 Estructura de Carpetes (`src/`)

```text
src/
├── app/                    # Next.js App Router (Vistes i Server Actions)
│   ├── actions/            # Server Actions (Entry points del backend)
│   └── inventory/          # Pàgines de la secció inventari
│
├── components/             # React Components
│   └── features/           # Components organitzats per funcionalitat
│       ├── inventory/      # Tota la UI de l'inventari (Llista, Cards, Modals)
│       └── scanner/        # UI de la càmera i editor d'escaneig
│
├── core/                   # 🧠 EL CERVELL (Lògica de Domini Pura)
│   ├── domain/             # Entitats i Tipus (InventoryItem, ScannedItem...)
│   ├── ports/              # Interfícies (Contractes per a Repositoris i Serveis)
│   ├── services/           # Lògica de Negoci (ProductMatcher, ExpirySafety...)
│   └── prompts/            # Prompts centralitzats per a la IA
│
└── adapters/               # 🔌 ADAPTADORS (Connexió amb el món exterior)
    ├── supabase/           # Implementació del Repositori d'Inventari
    ├── grocery/            # Adaptadors de Supermercats (Bonpreu)
    └── ai/                 # Implementacions de IA (Gemini, OpenAI)

```

## 🛒 2. Integració amb Bonpreu (Catàleg)

Utilitzem l'API pública (no documentada oficialment) de **Bonpreu** per cercar productes i enriquir les dades.

### 🔌 BonpreuAdapter  
**Ruta:** `src/adapters/grocery/BonpreuAdapter.ts`  
Aquest adaptador implementa la interfície `GroceryProvider`.

- **Endpoint de Cerca:**  
  `https://www.compraonline.bonpreuesclat.cat/api/webproductpagews/v6/product-pages/search`

- **Paràmetres Clau:**  
  `q={query}`, `includeAdditionalPageInfo=true`

#### 🧩 Mapeig (`enrichProduct`)
- Transforma el JSON cru de Bonpreu en la nostra entitat `ScrapedProduct`.
- **Tags:** Extreu `iconAttributes` per detectar si és `REFRIGERAT`, `CONGELAT` o `ECO`.
- **Unitats:** Normalitza strings com `"150g"` o `"1,5 L"` a `{ amount: 1.5, unit: 'l' }`.
- **Nota:** L’API de cerca **NO** retorna informació nutricional detallada.  
  El camp `nutritional_info` es guarda com a `null` de moment.

---

## 📷 3. Sistema d’Escaneig Intel·ligent (IA + Matching)

El flux d’escaneig és un procés de **3 fases** dissenyat per minimitzar al·lucinacions de la IA.

### 🔄 Flux de Dades

1. **Captura (CameraScanner)**  
   - L’usuari fa una foto.  
   - Es redueix a **720p (qualitat 0.6)** per optimitzar l’enviament.

2. **Reconeixement (GeminiImageRecognizer)**  
   - S’envia la imatge a **Google Gemini 2.0 Flash**.  
   - **Prompt:** `src/core/prompts/scan-prompts.ts` (instruccions estrictes en català).  
   - **Output:** JSON amb noms genèrics (ex: `"Paquet d’arròs"`, `"Llet"`).

3. **Matching (ProductMatcherService)**  
   - Per a cada item genèric, el servidor cerca a `BonpreuAdapter`.  
   - Si hi ha coincidència:
     - Substitueix el nom genèric pel nom oficial.
     - Afegeix `productId`, `catalogImage` i `tags`.

4. **UI (ScannedListEditor)**  
   - L’usuari veu els productes amb la **imatge real del supermercat**.

---

## 🛡️ 4. Seguretat Alimentària (ExpirySafetyService)

Per evitar dates de caducitat perilloses generades per la IA, utilitzem un sistema **determinista** de seguretat.

### 🧠 Com funciona?
El servei `ExpirySafetyService` s’executa **sempre** abans de guardar un item (escàner o manual).

#### Prioritat de decisió per calcular la data:

**1. Tags Oficials (Bonpreu)**
- `CONGELAT` → **+6 mesos** (sempre)
- `CONSERVA / SEC` → **+1 any**
- `REFRIGERAT` → Aplica regles de frescos

**2. Anàlisi de Nom (Keywords)**
- `"Pollastre"`, `"Carn"`, `"Peix"` → **+3 dies** (seguretat màxima)
- `"Pebrot"`, `"Enciam"` (verdura) → **+10–14 dies**

**3. Detecció de Context**
- Distingeix entre:
  - `"Tonyina"` fresca → **3 dies**
  - `"Tonyina"` al **PANTRY** → **1 any**

---

## ⚡️ 5. Components UI Clau

La interfície s’ha refactoritzat per ser **One-Screen** i evitar scroll innecessari.

### Components Principals

- **InventoryManager**  
  Controlador principal. Gestiona estat global (filtres, modal d’afegir, selecció múltiple).

- **InventoryHeader**
  - Mode Normal: Títol + botons d’acció (Scan, Add)
  - Mode Selecció: Barra taronja per eliminació massiva

- **Filtres**
  - Usa `FilterPill` per mostrar categories (Nevera, Rebost…) en una sola línia horitzontal.

- **EditItemModal**
  - Disseny tipus *Card* flotant  
  - Imatge *Hero* superior  
  - Selector d’ubicació visual (botons grans)  
  - Botó ràpid **“Consumir 1”**

- **CartDock**
  - Barra inferior persistent (*Bottom Sheet*)  
  - Mostra el total i permet desplegar imatges abans de confirmar

---

## 🛠️ Guia per a Desenvolupadors

### ➕ Afegir una nova categoria
1. Edita `src/lib/food-categories.ts`
2. Afegeix l’objecte amb: `id`, `label`, `emoji`, `gradient`

### 🧮 Canviar la lògica de caducitat
1. Edita `src/core/domain/services/ExpirySafetyService.ts`
2. Afegeix noves paraules clau als arrays:
   - `meatKeywords`
   - `veggieKeywords`
   - etc.

### 🤖 Canviar el proveïdor d’IA
- El sistema usa **injecció de dependències** (`src/services/container.ts`)
- Pots substituir `GeminiImageRecognizer` per `OpenAIImageRecognizer`
  **canviant només una línia** al contenidor.

## Estructura actual de la feature
- `features/inventory/` (UI i hooks de la feature)
- `actions/`, `dashboard/`, `products/`, `ui/` (submodules d'inventari)
- `hooks/`, `logic/`, `__tests__/` (organitzacio per feature)

## Nota de migracio (features/inventory)
- La UI d'inventari ara viu a `features/inventory`.
- El scanner continua a `components/scanner` per ser compartit.
- Imports d'inventari han de sortir de `@/features/inventory/*`.
