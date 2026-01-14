# 🧠 Feature: Individual Decisions

## 1. 🎯 Objectiu i Visió

Aquesta feature permet als usuaris **delegar una decisió simple** (menjar,
descans, social) a l'assistent.

**Problema que resol:** Reduir la fatiga de decisió.\
**Com ho fa:** L'usuari introdueix el context (energia, temps) i el sistema
genera una opció única i definitiva.

---

## 2. 🏗 Arquitectura i Flux de Dades (The Big Picture)

Aquest és el camí que segueix una dada des que l'usuari fa clic fins que es
guarda.

```mermaid
graph TD
    UI[🖥️ UI Layer: IndividualDecisionForm] -->|1. Input: Energia + Temps| App[⚙️ App Layer: MakeIndividualDecision]
    
    subgraph Core Domain [Nucli de Negoci]
        App -->|Crea| Entity[🧠 Entity: Decision]
        App -->|Consulta| Profile[👤 Entity: UserProfile]
    end
    
    App -->|2. Get Profile| ProfileRepo[🔌 Adapter: UserProfileRepository]
    ProfileRepo -.->|Retorna Al·lèrgies/Gustos| App
    
    App -->|3. Resol amb Context complet| AIAdapter[🔌 Adapter: OpenAI/Resolver]
    
    note[El Resolver rep: <br/>- Context (Temps/Energia)<br/>- Perfil (Al·lèrgies/Gustos)]
    note -.-> AIAdapter
    
    App -->|4. Guarda Resultat| DBAdapter[🔌 Adapter: SupabaseDecisionRepository]
```

## 3. 🗺 Mapa de Components (Detallat)

### 🔵 UI Layer (Presentació)

**Fitxer:** `IndividualDecisionForm.tsx`

- Recull l'estat d'ànim momentani (_variables dinàmiques_).
- No sap res de les al·lèrgies: això està guardat al backend.
- La UI és **"tonta" i lleugera**.

---

### ⚙️ Application Layer (Casos d'Ús)

**Fitxer:** `MakeIndividualDecision.ts`\
**Responsabilitat:** _Orquestrador de Context_.

És l'encarregat de **"fer la barreja" abans de cuinar**:

- Rep l'input de la UI (ex: _tinc 10 minuts_).
- ⚡️ **CRÍTIC:** Crida al `UserProfileRepository` per saber qui ets (ex: _soc
  vegà_).
- Combina **Input** (`10 min`) + **Perfil** (`Vegà`) i ho envia al _Resolver_.
- Si no troba el perfil, **llança error i atura el procés** (_Safety First_).

---

### 🔌 Infrastructure Layer (Resolver)

**Fitxers:**

- `IndividualDecisionResolver.ts` _(Interface)_
- `OpenAIResolver.ts` _(Implementació)_

**Canvi important:**

- **Abans:**
  ```ts
  resolve(context);
  ```
    ```
- **Ara:**

resolve(profile, context)


➡️ La IA rep les restriccions del perfil com a "Regles dures" (Hard Constraints).


---


## 4. 🔍 Conceptes Clau per a Juniors (Deep Dive)

### A. El Patró `restore` vs `constructor`
Al fitxer `Decision.ts` veuràs això:

```ts
// Constructor: Per a quan neix una decisió NOVA
constructor(props: DecisionProps) {
    this.status = DecisionStatus.PENDING; // Sempre comença pendent
}

// Restore: Per a quan la llegim de la BASE DE DADES
public static restore(props: DecisionRestoreProps): Decision {
    const decision = new Decision(props);
    decision.status = props.status; // Aquí sí que podem forçar l'estat que tenia
    return decision;
}

### Comentaris sobre el teu codi (Code Review ràpida)

He analitzat el codi que m'has passat i està **molt bé**. Tinc només un parell d'apunts per polir-lo nivell arquitecte:

1.  **Seguretat en el Repository**:
    A `SupabaseDecisionRepository.ts`, quan fas el `select`, assegura't que Supabase té RLS (Row Level Security) activat. El codi JS està bé, però la seguretat real està a l'SQL (`esquema.sql`).
    * *Consell:* Verifica que un usuari `A` no pugui fer `findById` de la decisió d'un usuari `B`.

2.  **Gestió d'Errors a la UI**:
    A `IndividualDecisionForm`, veig molta lògica de simulació (`fakeResults`, `timeouts`). Això està bé per a demos, però ves amb compte que aquesta lògica no "s'engolli" errors reals del backend.
    * *Consell:* Assegura't que el `catch` del `handleExecute` real notifiqui l'error a l'usuari visiblement.

3.  **El fix de `SaveGeneratedRecipe`**:
    L'adaptació que has fet "adoptant" la recepta (`authorId: userId`) és un patró perfecte. Has convertit una "Entitat generada (efímera)" en una "Entitat de domini (persistent)". Molt ben vist.

Necessites que t'ajudi a escriure el test unitari concret per a `MakeIndividualDecision` o prefereixes seguir amb una altra part de la documentació?
````
