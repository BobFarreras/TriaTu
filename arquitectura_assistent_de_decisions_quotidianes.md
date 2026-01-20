# Assistent de Decisions Quotidianes
## Guia d'Arquitectura, Desenvolupament i Governança

> Objectiu: definir **què fa l'app**, **com es construeix** i **com es manté** amb criteris professionals: *Clean Architecture, SOLID, TDD i zero deute tècnic evitable*.

---

## 1. Visió de Producte (resum executiu)

**Problema que resol**  
Fatiga de decisions quotidianes (menjar, descans, límits socials).

**Proposta de valor**  
Delegar microdecisions no crítiques per reduir estrès mental.

**Principi clau**  
> *No optimitzar la vida. Simplificar-la.*

---

## 2. Principis no negociables

- 🔒 L'usuari manté el control final
- 🧠 Una decisió = una resposta (mai llistes)
- 🧩 Decisions petites, mai vitals
- 🧼 Simplicitat > intel·ligència artificial complexa
- 📉 Minimitzar càrrega cognitiva

---

## 3. Abast funcional (què HA de fer)

### 3.1 Decisions individuals

- 🍽️ Què menjar
- 😴 Descansar o continuar
- 📩 Respondre o ajornar
- 🙅 Dir que no a plans

Cada decisió:
- És reversible
- Té una única resposta
- Té una justificació breu

### 3.2 Decisions col·lectives (NOU — clau de producte)

#### Sales de decisions (Decision Rooms)

Una *Sala* és un espai temporal o persistent on diversos usuaris deleguen una decisió.

**Exemples:**
- 👩‍❤️‍👨 Parella decidint què dinar
- 👥 Grup d’amics escollint restaurant
- 👨‍👩‍👧 Família organitzant descans

#### Funcionament d’una sala

1. Creació de la sala (host)
2. Participants s’hi uneixen
3. Context compartit:
   - Tipus de decisió
   - Opcions possibles (si n’hi ha)
4. El sistema:
   - Agrega preferències
   - Resol conflictes
   - Dona **UNA resposta única**

---

## 4. Arquitectura general (Clean Architecture)

```
┌────────────────────────────┐
│        UI (Next.js)        │
├────────────────────────────┤
│   Application / UseCases   │
├────────────────────────────┤
│      Domain (Core)         │
├────────────────────────────┤
│ Infrastructure (DB, Auth)  │
└────────────────────────────┘
```

### Regla d'or
> Les capes externes **mai** poden afectar les internes.

---

## 5. Stack tecnològic (decisions justificades)

### Frontend
- **Next.js (App Router)**
- **TypeScript (strict)**
- **TailwindCSS** (design system lleuger)
- **Zustand** (estat local predictible)

### Backend / Plataforma
- **Supabase**
  - Auth
  - PostgreSQL
  - Row Level Security
- **Vercel** (deploy immutable)

### Testing
- **Vitest** (unit tests)
- **Playwright** (e2e)
- **Testing Library** (UI)

---

## 6. Model de domini (Core)

### Entitats principals

- **User**
- **PreferenceProfile**
- **Decision**
- **DecisionContext**
- **DecisionOutcome**
- **DecisionRoom** (NOU)
- **RoomParticipant** (NOU)

### Value Objects

- EnergyLevel
- TimeWindow
- FoodPreference
- SocialTolerance

### Regles de domini

- Una decisió col·lectiva requereix consens implícit
- Cap usuari pot imposar preferències
- El sistema pot desempatar segons regles neutres
- Les sales poden ser efímeres o persistents

---

## 7. Casos d'ús (Use Cases)

### Decisions individuals

- `MakeIndividualDecision`
- `RegisterDecisionFeedback`

### Decisions col·lectives (NOU)

- `CreateDecisionRoom`
- `JoinDecisionRoom`
- `SubmitParticipantContext`
- `ResolveGroupDecision`
- `CloseDecisionRoom`

Cada Use Case:
- No coneix UI ni base de dades
- Retorna resultats deterministes
- És testejable en aïllament

---

## 8. Infraestructura

### Persistència
- PostgreSQL (Supabase)
- Repositoris com a interfícies

### Autenticació
- Email / OAuth
- Anonymous mode (MVP)

---

## 9. SOLID aplicat

- **S**: Cada Use Case fa una sola cosa
- **O**: Regles ampliables sense modificar codi existent
- **L**: Implementacions substituïbles
- **I**: Interfaces petites
- **D**: Domini no coneix Supabase ni Next

---

## 10. TDD — Estratègia

### Ordre de desenvolupament
1. Tests de domini
2. Use Cases
3. Adaptadors
4. UI

### Regla
> Cap lògica sense test.

---

## 11. Estructura de carpetes (adaptada al projecte)

```
├── adapters
│   ├── interfaces
│   ├── realtime
│   └── supabase
│       ├── client.ts
│       ├── middleware.ts
│       ├── server.ts
│       ├── SupabaseDecisionRepository.ts
│       ├── SupabaseDecisionRoomRepository.ts
│       └── SupabasePreferenceRepository.ts
├── AGENTS.md
├── app
│   ├── actions
│   │   ├── auth-actions.ts
│   │   ├── decision-actions.ts
│   │   ├── profile-actions.ts
│   │   └── room-actions.ts
│   ├── favicon.ico
│   ├── globals.css
│   ├── join
│   │   └── page.tsx
│   ├── layout.tsx
│   ├── login
│   │   └── page.tsx
│   ├── page.tsx
│   ├── profile
│   │   └── page.tsx
│   └── rooms
│       ├── create
│       │   └── page.tsx
│       └── [id]
│           └── page.tsx
├── codi_i_estructura_dassistent-decisions.txt
├── components
│   └── ui
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       ├── SearchableSectionGrid.tsx
│       ├── SelectionGrid.tsx
│       └── TagInput.tsx
├── core
│   ├── constants
│   │   ├── profile-data.ts
│   │   └── profile-options.ts
│   ├── domain
│   │   ├── entities
│   │   │   ├── Decision.ts
│   │   │   ├── DecisionRoom.ts
│   │   │   ├── PreferenceProfile.ts
│   │   │   └── RoomParticipant.ts
│   │   ├── rules
│   │   └── value-objects
│   │       ├── DecisionContext.ts
│   │       └── DecisionOutcome.ts
│   ├── ports
│   │   ├── DecisionRepository.ts
│   │   ├── DecisionRoomRepository.ts
│   │   ├── GroupDecisionResolver.ts
│   │   ├── IndividualDecisionResolver.ts
│   │   └── PreferenceRepository.ts
│   └── usecases
│       ├── decision
│       │   └── MakeIndividualDecision.ts
│       ├── profile
│       │   └── UpdateUserProfile.ts
│       └── rooms
│           ├── CreateDecisionRoom.ts
│           ├── JoinDecisionRoom.ts
│           ├── MakeGroupDecision.ts
│           └── ResolveGroupDecision.ts
├── eslint.config.mjs
├── features
│   ├── decision
│   │   ├── actions
│   │   └── ui
│   │       └── IndividualDecisionForm.tsx
│   ├── profile
│   │   └── ui
│   │       └── ProfileFrom.tsx
│   └── rooms
│       ├── actions
│       └── ui
│           ├── CreateRoomForm.tsx
│           ├── DecisionControls.tsx
│           ├── DecisionHistory.tsx
│           ├── JoinRoomFrom.tsx
│           └── RoomDetail.tsx
├── lib
│   └── i18n
│       ├── dictionaries.ts
│       └── LanguageContext.tsx
├── merge.js
├── middleware.ts
├── next-env.d.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── README.md
├── scripts
│   ├── simulate-full-group.ts
│   └── test-db-connection.ts
├── services
│   ├── container.ts
│   └── decision
│       ├── BasicDecisionEngine.ts
│       └── BasicGroupResolver.ts
├── tests
│   ├── domain
│   │   ├── Decision.test.ts
│   │   ├── DecisionRoom.test.ts
│   │   └── PreferenceProfile.test.ts
│   ├── services
│   │   └── BasicDecisionEngine.test.ts
│   ├── setup.test.ts
│   └── usecases
│       ├── CreateDecisionRoom.test.ts
│       ├── JoinDecisionRoom.test.ts
│       ├── MakeGroupDecision.test.ts
│       ├── MakeIndividualDecision.test.ts
│       └── UpdateUserProfile.test.ts
├── tsconfig.json
└── vitest.config.ts

```

Principi: **feature-first + clean architecture**

---

## 12. Governança del projecte

- Cada feature ha de tenir un README.md amb objectiu, components i flux.

- PR petites
- Commits semàntics
- Zero "quick fixes"
- Refactor abans d'afegir funcionalitat

---

## 13. AGENTS.md (governança per humans i IA)

```
AGENTS.md

Objectiu:
Aquest projecte delega decisions quotidianes sense treure autonomia humana.

Principis:
- Simplicitat per sobre de potència
- Una decisió = una resposta
- Cap decisió crítica

Arquitectura:
- Clean Architecture estricta
- Feature-first
- Domini independent

Col·laboració:
- Decisions col·lectives mai són votacions
- El sistema resol, els humans deleguen

Testing:
- TDD obligatori
- Tests de domini abans d’UI

Ètica:
- No manipulació
- No dependència
- Sempre opció de sortir
```

AGENTS.md

Objectiu:
Aquest projecte prioritza simplicitat, mantenibilitat i claredat mental.

Regles generals:
- No afegir funcionalitat sense cas d'ús clar
- No accedir directament a infraestructura des del domini
- No usar estats globals no justificats

Arquitectura:
- Clean Architecture obligatòria
- Use Cases independents del framework

Testing:
- TDD obligatori
- Cap PR sense tests

UX:
- Una decisió = una resposta
- Mai més de 2 interaccions per decisió

Ètica:
- No manipular l'usuari
- No fomentar dependència
```

---

## 14. Riscos identificats

- Overengineering
- Massa configuració inicial
- Voler fer "massa intel·ligent" el sistema

**Mitigació:** MVP extremadament limitat.

---

## 15. Decision Engine (nucli del sistema)

### 15.1 Objectiu

El **Decision Engine** és el cor del producte. La seva responsabilitat és:
- Rebre contextos individuals o col·lectius
- Aplicar regles deterministes
- Produir **una única decisió explicable**

No optimitza. **Simplifica**.

---

### 15.2 Principis del Decision Engine

- Determinista (mateix input → mateix output)
- Explicable (sempre retorna una raó)
- Sense estat propi (stateless)
- Independent de framework i infraestructura

---

### 15.3 Tipus de resolució

#### A) Resolució individual

Inputs:
- PreferenceProfile
- DecisionContext
- Historial resumit

Procés:
1. Filtrar opcions inviables
2. Aplicar regles bàsiques (energia, temps)
3. Trencar empats amb heurístiques simples

Output:
- DecisionOutcome
  - choice
  - reason

---

#### B) Resolució col·lectiva (Decision Rooms)

Inputs:
- DecisionRoom
- Participants (n >= 2)
- Context compartit
- Opcions candidates

Procés:
1. Normalitzar preferències
2. Detectar conflictes forts
3. Penalitzar opcions extremes
4. Seleccionar opció de menor fricció global

⚠️ **No votacions. No majoria.**

---

### 15.4 Heurística base (Group Resolver)

Cada opció rep una puntuació:

```
score(option) = Σ compatibility(participant, option) - friction(option)
```

On:
- compatibility ∈ [0,1]
- friction penalitza cansament, repetició o conflicte

Es tria l'opció amb **score més estable**, no la més alta absoluta.

---

### 15.5 Explicabilitat

Cada decisió ha de generar:
- Raó curta (1 frase)
- Factors considerats (interns)

Exemple:
> "He triat el restaurant B perquè agrada a tots i evita repetir el d’ahir."

---

### 15.6 Contractes (interfaces)

- DecisionEngine
- IndividualDecisionResolver
- GroupDecisionResolver

Cap implementació concreta aquí.

---

### 15.7 Testing del Decision Engine

Tests obligatoris:
- Mateix input → mateix output
- Cap decisió nul·la
- Conflictes resolts sense bloqueig
- Sempre retorna una raó

---

### 15.8 Errors de domini

- NoParticipantsError
- NoValidOptionsError
- DecisionNotAllowedError

---

> Qualsevol canvi futur al producte **passa primer pel Decision Engine**.


## 16. Model de Domini (baixada a detall)

Aquesta secció defineix **què existeix al sistema i quines regles no es poden trencar**, independentment de tecnologia.

---

### 16.1 Entitat: Decision

**Responsabilitat**  
Representar una decisió delegable.

**Propietats**
- id
- type (food, rest, social, custom)
- scope (INDIVIDUAL | GROUP)
- status (PENDING | RESOLVED | CANCELLED)
- context: DecisionContext
- outcome?: DecisionOutcome

**Invariants**
- Una decisió RESOLVED sempre té outcome
- Una decisió CANCELLED no pot resoldre’s
- El tipus no pot canviar després de crear-se

---

### 16.2 Entitat: DecisionOutcome

**Responsabilitat**  
Resultat final d’una decisió.

**Propietats**
- choice (string | value object)
- reason (string curta)
- generatedAt

**Invariants**
- Sempre hi ha reason
- reason <= 140 caràcters

---

### 16.3 Entitat: PreferenceProfile

**Responsabilitat**  
Agrupar preferències estables d’un usuari.

**Propietats**
- foodPreferences
- energyPattern
- socialTolerance
- exclusions (hard limits)

**Invariants**
- Les exclusions sempre guanyen
- Les preferències mai són ordres

---

### 16.4 Value Object: DecisionContext

**Responsabilitat**  
Context puntual d’una decisió concreta.

**Propietats**
- timestamp
- energyLevel
- availableTime
- optionalOptions[]

**Invariants**
- availableTime >= 0
- optionalOptions, si existeixen, >= 1

---

### 16.5 Entitat: DecisionRoom

**Responsabilitat**  
Espai de delegació col·lectiva.

**Propietats**
- id
- hostUserId
- participants: RoomParticipant[]
- decisionType
- candidateOptions[]
- status (OPEN | RESOLVED | CLOSED)

**Invariants**
- Mínim 2 participants
- Només el host pot tancar la sala
- No es poden afegir participants quan està RESOLVED

---

### 16.6 Entitat: RoomParticipant

**Responsabilitat**  
Relació usuari–sala.

**Propietats**
- userId
- preferenceSnapshot
- joinedAt

**Invariants**
- preferenceSnapshot és immutable
- Un usuari no pot estar dues vegades a la mateixa sala

---

### 16.7 Regles transversals de domini

- Cap entitat coneix persistència
- Cap entitat coneix UI
- Totes les decisions són auditables
- Tot error és explícit (no silencis)

---

### 16.8 Errors de domini

- InvalidDecisionStateError
- InvalidContextError
- RoomClosedError
- DuplicateParticipantError

---

> Aquest model és la font de veritat del sistema.
> Si una feature no encaixa aquí, no s’implementa.


## 17. Use Cases (Application Layer) — detall exhaustiu

Aquesta capa orquestra el domini. **No conté lògica de negoci**, només flux i coordinació.

---

### 17.1 Use Case: ResolveGroupDecision

**Responsabilitat**  
Resoldre una decisió col·lectiva dins d’una DecisionRoom.

**Input**
- roomId
- requesterUserId

**Precondicions**
- La sala existeix
- La sala està OPEN
- Hi ha ≥ 2 participants
- requesterUserId és el host

**Flux**
1. Carregar DecisionRoom
2. Validar invariants de domini
3. Construir GroupDecisionContext
4. Invocar GroupDecisionResolver (Decision Engine)
5. Generar DecisionOutcome
6. Persistir resultat
7. Tancar sala

**Output**
- DecisionOutcome

**Errors**
- RoomNotFoundError
- RoomClosedError
- UnauthorizedActionError
- NoValidOptionsError

**Ports requerits**
- DecisionRoomRepository
- DecisionOutcomeRepository
- GroupDecisionResolver

---

### 17.2 Use Case: MakeIndividualDecision

**Responsabilitat**  
Resoldre una decisió individual.

**Input**
- userId
- decisionType
- context

**Flux**
1. Carregar PreferenceProfile
2. Construir Decision
3. Invocar IndividualDecisionResolver
4. Generar DecisionOutcome
5. Persistir decisió

**Output**
- DecisionOutcome

**Errors**
- InvalidContextError
- DecisionNotAllowedError

**Ports requerits**
- PreferenceRepository
- DecisionRepository
- IndividualDecisionResolver

---

### 17.3 Use Case: RegisterDecisionFeedback

**Responsabilitat**  
Registrar feedback mínim post-decisió.

**Input**
- decisionId
- userId
- feedback (enum: POSITIVE | NEUTRAL | NEGATIVE)

**Flux**
1. Carregar Decision
2. Validar propietari
3. Registrar feedback

**Output**
- Success

**Errors**
- DecisionNotFoundError
- UnauthorizedActionError

**Ports requerits**
- DecisionRepository
- FeedbackRepository

---

### 17.4 Principis dels Use Cases

- Un use case = una acció clara
- No comparteixen estat
- No coneixen HTTP, Next.js ni Supabase
- Sempre retornen un resultat explícit

---

### 17.5 Testing dels Use Cases (TDD)

Per cada use case:
- Test feliç
- Test d’error principal
- Test d’invariant trencat

Els repositoris i resolvers es mockegen.

---

> Aquesta capa és la frontera entre el món real i el domini.
> Si aquí és net, la resta del sistema ho serà.


## 18. Ports & Interfaces (Boundary Layer)

Aquesta secció defineix **tot allò que el core necessita del món exterior**, sense saber *com* s’implementa.

Principi clau:
> El domini i els use cases **només coneixen interfícies**, mai implementacions.

---

### 18.1 Repositoris (Persistència)

#### DecisionRepository

**Responsabilitat**  
Persistir i recuperar decisions individuals.

**Contracte**
- save(decision)
- findById(decisionId)
- findByUser(userId)

---

#### DecisionRoomRepository

**Responsabilitat**  
Gestionar sales de decisió.

**Contracte**
- create(room)
- findById(roomId)
- save(room)
- close(roomId)

---

#### PreferenceRepository

**Responsabilitat**  
Accedir a perfils de preferències.

**Contracte**
- findByUser(userId)
- save(profile)

---

#### FeedbackRepository

**Responsabilitat**  
Persistir feedback post-decisió.

**Contracte**
- save(decisionId, userId, feedback)

---

### 18.2 Decision Engine Ports

#### IndividualDecisionResolver

**Responsabilitat**  
Resoldre decisions individuals.

**Contracte**
- resolve(preferences, context) → DecisionOutcome

---

#### GroupDecisionResolver

**Responsabilitat**  
Resoldre decisions col·lectives.

**Contracte**
- resolve(roomContext) → DecisionOutcome

---

### 18.3 Event / Realtime Ports (opcional però previst)

#### RoomEventPublisher

**Responsabilitat**  
Publicar esdeveniments de sala.

**Contracte**
- publishRoomUpdated(roomId)
- publishRoomResolved(roomId, outcome)

---

#### RoomEventSubscriber

**Responsabilitat**  
Rebre esdeveniments externs.

**Contracte**
- onParticipantJoined(handler)
- onRoomClosed(handler)

---

### 18.4 Regles d’ús dels Ports

- Els use cases **només depenen de ports**
- Cap port pot retornar dades en format infraestructura
- Cap port pot llançar errors no definits al domini
- Els serveis del core no creen clients d'infra; reben ports o repositoris
- Logs sensibles: usa `lib/logger` i evita PII en entorns no dev

---

### 18.5 Testing dels Ports

- Ports sempre mockejats en tests d’use cases
- Implementacions testejades a part
- Contract testing recomanat

---

> Si un canvi d’infraestructura obliga a tocar el core,
> aquesta capa està mal definida.


## 19. Adapters & Infraestructura (Implementacions)

Aquesta capa **implementa els ports** definits al PAS 4 utilitzant tecnologia concreta (Supabase, Realtime, Auth). El core **no coneix** aquesta capa.

---

### 19.1 Principis d’Infraestructura

- Implementacions fines (thin adapters)
- Mapatge explícit Entitat ↔ Persistència
- Zero lògica de negoci
- Errors traduïts a errors de domini

---

### 19.2 Persistència amb Supabase (PostgreSQL)

#### Esquema de dades (resum)

**tables**
- users (managed by Supabase Auth)
- preference_profiles
- decisions
- decision_outcomes
- decision_rooms
- room_participants
- decision_feedback

Relacions:
- decision_rooms 1—N room_participants
- decisions 1—1 decision_outcomes

---

### 19.3 Repositoris Supabase (Adapters)

#### SupabaseDecisionRepository

Implementa:
- DecisionRepository

Responsabilitats:
- Mapar `Decision` ↔ `decisions`
- Transaccions per save + outcome

Notes:
- Cap query fora del repositori
- Cap objecte DB surt cap al core

---

#### SupabaseDecisionRoomRepository

Implementa:
- DecisionRoomRepository

Responsabilitats:
- Crear sales
- Afegir participants
- Tancar sales de forma atòmica

Notes:
- Lock lògic via status
- Control de concurrència bàsic

---

#### SupabasePreferenceRepository

Implementa:
- PreferenceRepository

Responsabilitats:
- Lectura ràpida (cacheable)
- Escriure només en canvis explícits

---

#### SupabaseFeedbackRepository

Implementa:
- FeedbackRepository

Responsabilitats:
- Escriure feedback immutable

---

### 19.4 Row Level Security (RLS)

Regles clau:
- L’usuari només pot llegir les seves decisions
- Només el host pot tancar una sala
- Participants només poden llegir sales on són membres

Cap regla RLS substitueix regles de domini.

---

### 19.5 Realtime (Decision Rooms)

#### Arquitectura

- Channel per sala (`room:{roomId}`)
- Events:
  - participant_joined
  - room_updated
  - room_resolved

#### Implementació

- Supabase Realtime com a `RoomEventPublisher`
- UI subscrita via adapter específic

Notes:
- Realtime és **informatiu**, no autoritatiu
- L’estat real ve sempre del repositori

---

### 19.6 Auth & Identitat

- Supabase Auth (Email + OAuth)
- Anonymous sessions per MVP
- userId sempre injectat als use cases

---

### 19.7 Mapping & Factories

- Factories per construir entitats des de DB
- Validació d’invariants al boundary

---

### 19.8 Testing d’Infraestructura

- Tests d’integració per repositoris
- Entorn Supabase local
- No mocks en aquesta capa

---

> Aquesta capa és l’única que pot trencar-se amb canvis tecnològics.
> El core ha de romandre intacte.


---

## PAS 6 — Application Layer (Service Orchestration & DI)

### Objectiu
Coordinar use cases, gestionar dependències i definir límits transaccionals sense contaminar el domini.

### Principis
- El **domini no coneix la infraestructura**
- La **UI no coneix els repositoris**
- Tota orquestració passa per l’Application Layer

### Estructura
```
/services
  ├── container.ts
  ├── DecisionRoomService.ts
  ├── PersonalDecisionService.ts
```

### Exemple: Container (DI manual, explícit)
```ts
export const container = {
  decisionRoomRepository: new SupabaseDecisionRoomRepository(),
  userPreferenceRepository: new SupabaseUserPreferenceRepository(),
  eventPublisher: new SupabaseRoomEventPublisher(),
}
```

### Service
- No conté lògica de domini
- Només coordina use cases
- Controla transaccions i errors

---

## PAS 7 — API Layer (Next.js App Router)

### Objectiu
Exposar el sistema de manera estable i segura.

### Decisions clau
- Server Actions per accions autenticades
- Route Handlers per integracions externes

### Estructura
```
/app/api/decision-rooms/
  ├── route.ts
/app/actions/
  ├── create-room.ts
  ├── vote.ts
```

### Regles
- DTOs explícits
- Cap entitat de domini surt directament
- Errors mapats (DomainError → HTTP)

---

## PAS 8 — UI & State Management

### Principis
- La UI **no decideix**, només mostra
- Tot estat crític ve del backend

### Decisions
- React Server Components per dades
- Client Components només per interacció
- Realtime via subscripcions Supabase

### UX clau
- "Decideix per nosaltres"
- Feedback immediat
- Historial i patrons visibles

---

## PAS 9 — Testing Strategy (TDD)

### Piràmide
- 70% Unit (domini)
- 20% Integració (Supabase adapters)
- 10% E2E (flows crítics)

### Regles
- El domini es pot testejar sense Next.js
- Mocks només a ports
- Cap test depèn de l’estat global

---

## PAS 🔟 — AGENTS.md (Governança del projecte)

### Objectiu
Evitar caos, deute tècnic i males pràctiques (especialment amb IA).

### Contingut clau
- Arquitectura obligatòria
- Carpetes intocables
- Prohibicions (ex: lògica a components UI)
- Com afegir funcionalitats
- Com escriure tests

---

📌 **RESULTAT FINAL**

Has definit una arquitectura:
- preparada per escalar
- preparada per equips
- preparada per IA futura
- preparada per durar anys

