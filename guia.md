📘 2. Enciclopèdia de Carpetes (Què és cada cosa?)
Aquí tens l'explicació detallada de cada carpeta, pensada perquè entenguis la responsabilitat de cada fitxer.

---

📂 core/ (El Cervell 🧠)  
Aquesta és la carpeta més important. Aquí viu la lògica pura.

**Regla d'or:**  
El codi aquí dins **NO pot importar res de React, Next o Supabase**.  
Ha de ser JavaScript/TypeScript pur.

**Per què?**  
Perquè si demà canviem Supabase per Firebase, o Next.js per una app mòbil, aquesta carpeta no s'hauria de tocar.

---

📁 core/domain/entities  
Són els objectes protagonistes. Defineixen com són les dades i quines regles tenen.

**Exemple (DecisionRoom.ts):**  
Defineix que una sala té un history, uns participants i mètodes com `addDecision()`.  
No sap com es guarda a la DB, només sap com funciona a la memòria.

---

📁 core/usecases  
Són els **verbs de l'aplicació**. Cada acció que pot fer un usuari té un fitxer aquí.

**Exemple (MakeGroupDecision.ts):**  
És un script que diu:
1. Busca la sala  
2. Busca els perfils  
3. Calcula la decisió  
4. Guarda-la  

**Nota:** Els Use Cases són els **directors d'orquestra**.

---

📁 core/ports  
Són **contractes (interfaces)**. Aquí definim què necessitem, però no com es fa.

**Exemple (DecisionRoomRepository.ts):**  
Diu: “Necessito una classe amb un mètode `save(room)`”.  
No diu si es guarda a Supabase o en un fitxer de text.  
Això permet que el core no depengui de Supabase.

---

📂 adapters/ (El Traductor 🗣️)  
Aquesta carpeta connecta el core (idealista) amb el món real (brut i complex).

📁 adapters/supabase  
Aquí és on realment escrivim codi SQL o cridem a l’API de Supabase.

**Exemple (SupabaseDecisionRoomRepository.ts):**  
Importa el client de Supabase i fa `insert`, `select`, etc.  
Implementa el contracte definit a `core/ports`.

---

📂 app/ (La Web - Next.js 🖥️)  
Aquí hi ha tot el que té a veure amb el navegador, les rutes i la interacció humana.

📁 app/actions (Server Actions)  
Són les funcions que es criden des dels formularis o botons.  
Són la porta d'entrada al servidor.

**Responsabilitat:**
- Comprovar qui és l'usuari (Auth)
- Llegir dades del formulari (FormData)
- Cridar al container per obtenir el Use Case
- Retornar èxit o error a la UI

📁 app/rooms/[id]/page.tsx  
És la pàgina web. En Next.js (App Router), aquests fitxers s'executen al servidor.  
La seva feina és carregar dades inicials i pintar els components.

---

📂 services/ (La "Cola" 🧪)

📄 container.ts  
Aquest fitxer és clau: **Injecció de Dependències**.

**Què fa?**  
Crea les instàncies reals dels objectes.

**Exemple:**  
“Quan algú demani el Use Case `MakeGroupDecision`, li dono una instància amb el `SupabaseRepository` real”.

---

📂 features/ i components/ (La UI 🎨)

**components/ui**  
Peces de Lego tontes (Botons, Inputs, Cards).  
No saben res de negoci.

**features/**  
Components llestos que coneixen el domini.

**Exemple:**  
`ProfileForm` sap que existeix `updateProfile` i gestiona l’estat del formulari.

---

🚀 3. El Viatge d'una Dada (Exemple Pas a Pas)

L’usuari prem **"Decidir Ara"**:

1. **UI (Navegador)**  
   `DecisionControls.tsx` recull opcions i crida `makeGroupDecisionAction`.

2. **Next.js (Server Action)**  
   La petició viatja al servidor.

3. **Action (room-actions.ts)**  
   - Verifica l’usuari amb Supabase Auth  
   - Crida `container.getMakeGroupDecision()`

4. **Container**  
   - Prepara el Use Case  
   - Injecta repositori i resolver

5. **Use Case**  
   - Demana la sala  
   - Calcula la decisió  
   - Guarda el resultat

6. **Repository (Supabase)**  
   - Executa `INSERT INTO group_decisions`

7. **Retorn**  
   - La UI rep `success: true` i mostra la decisió

---

🛡️ 4. Guia de Desenvolupament (Com treballar)

**NO comencis per la UI.**  
Segueix aquest ordre (TDD):

### Pas 1: Lògica
- Escriu el test (RED)
- Implementa el Use Case (GREEN)
- Afegeix ports si cal

### Pas 2: Infraestructura
- Implementa el port a Supabase

### Pas 3: Connexió
- Afegeix el Use Case al container
- Crea la Server Action

### Pas 4: Interfície
- Crea el botó i connecta’l

---

🔑 Conceptes Clau

**DTO**  
Objecte simple per passar dades a la UI sense lògica.

**Repository Pattern**  
Una capa intermèdia per parlar amb la DB.

**Dependency Injection**  
Les dependències venen de fora (ideal per tests).

**Server vs Client Components**
- Server: DB, cookies, sense interactivitat
- Client: `useState`, `onClick`, UI interactiva

---

Aquesta guia cobreix tot el necessari per treballar amb seguretat al projecte **Assistent de Decisions**.  
Guarda-la com a document de referència.
