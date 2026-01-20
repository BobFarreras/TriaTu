# ADR-004: Estratègia de Proxy d'Imatges per a Proveïdors Externs

**Estat:** ✅ Acceptat / Implementat **Data:** 19/01/2026 **Context:** Sistema
d'Inventari i Recomanacions

## 1. El Problema

Les imatges de productes provinents de certs proveïdors externs (ex: Bonpreu) no
es visualitzaven correctament a l'entorn de producció (Vercel) ni a la PWA
offline.

**Causes arrel:**

1. **Hotlink Protection (WAF):** El proveïdor bloqueja peticions provinents
   d'IPs de servidors al núvol (AWS/Vercel) o quan detecta un `Referer` extern.
2. **CORS (Cross-Origin Resource Sharing):** La PWA intenta cachejar imatges via
   `fetch()`, però el proveïdor no retorna les capçaleres
   `Access-Control-Allow-Origin`, provocant errors de xarxa en el navegador.

## 2. Decisió Arquitectònica

Implementar un **Patró Adaptador (Adapter Pattern)** per a URLs d'imatges,
utilitzant un proxy invers públic (`wsrv.nl`) per "blanquejar" la petició.

### Flux de Dades

```mermaid
graph LR
    User[Client / PWA] -->|1. Demana imatge| Proxy[wsrv.nl (Proxy)]
    Proxy -->|2. Demana original| Origin[Servidor Bonpreu]
    Origin -->|3. Retorna imatge (200 OK)| Proxy
    Proxy -->|4. Retorna optimitzada + CORS| User
```

    ## 📦 Components Afectats

### Core Logic

- **src/lib/imageUtils.ts**\
  Punt únic de veritat on es transformen les URLs d’imatge.

### Infrastructure

- **next.config.ts**\
  S’afegeix `wsrv.nl` a la _Content-Security-Policy_ (`img-src`, `connect-src`).

### UI Components

- Components com **InventoryItemCard** i **ProductCard**\
  → No coneixen l’estratègia d’imatges, només consumeixen la utilitat comuna.

---

## ✅ Beneficis (Pros)

- **Evita bloquejos**\
  La IP d’origen és la del proxy (fiable), no la de Vercel.

- **Habilita PWA**\
  El proxy afegeix capçaleres CORS, permetent que el _Service Worker_ guardi les
  imatges per a ús offline.

- **Optimització automàtica**\
  Conversió a format WebP i redimensionament _on-the-fly_ → estalvi d’ample de
  banda.

---

## ⚠️ Riscos i Mitigacions (Cons)

### Dependència externa

- **Risc:** Si `wsrv.nl` cau, les imatges deixen de veure’s.
- **Mitigació:**\
  La lògica està centralitzada a `imageUtils.ts`. Canviar de proveïdor de proxy
  només requereix modificar **1 línia de codi**.

### Privacitat

- **Risc:** El proxy pot veure les peticions d’imatges.
- **Mitigació:**\
  Només s’utilitza per a **imatges públiques de catàleg**, mai per a dades
  sensibles d’usuari.

```
```
