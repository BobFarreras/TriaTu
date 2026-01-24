# Git Workflow i Branching (Triatu)

Objectiu: tenir un flux clar i segur per a canvis i releases.

## Estructura de branques

```
main              -> Produccio (versions estables)
develop           -> Integracio (features acabades)
feature/*         -> Noves funcionalitats
fix/*             -> Bugs no urgents
docs/*            -> Documentacio
chore/*           -> Tasques tecniques
test/*            -> Tests i cobertura
release/*         -> Preparacio de release
hotfix/*          -> Correccions urgents
```

## Regles d'or

- `main` nomes per releases i hotfixos aprovats.
- No fer merge directe a `main`.
- PRs: `feature/*` -> `develop`.
- `release/*` es crea des de `develop` i es mergeja a `main` i `develop`.
- `hotfix/*` es crea des de la versio de `realease`.
- Abans de publicar, guarda la versio a `docs/releases/vX.Y.Z.md`.

## Nomenclatura recomanada

- `feature/<descripcio-curta>`
- `fix/<descripcio-curta>`
- `docs/<tema>`
- `chore/<tema>`
- `test/<tema>`
- `release/vX.Y.Z`
- `hotfix/<descripcio-curta>`

## Fluxos tipics

### Nova feature
```
git checkout develop
git pull origin develop
git checkout -b feature/nom-feature
```
PR -> `develop`

### Release
```
git checkout develop
git pull origin develop
git checkout -b release/v1.2.0
```
PR -> `main` i backport a `develop`
Notes de versio: `docs/releases/v1.2.0.md`

### Hotfix
```
git checkout main
git pull origin main
git checkout -b hotfix/error-critic
```
PR -> `main` i `develop`

## Commits

Format recomanat:
```
feat: afegir onboarding del dashboard
fix: corregir validacio de room id
docs: actualitzar guia de workflow
chore: actualitzar dependancies
test: afegir tests e2e de rooms
```

## Validacio local abans de PR

Executa sempre:
```
pnpm validate
```

## GitHub Actions (estat actual)

El workflow `.github/workflows/ci.yml` s'executa a:
- `main`
- `release` (branca literal)

Nota: si uses `release/*`, cal ajustar el workflow per incloure aquests patrons.

## Normes per agents

- No fer merge ni push directe a `main`.
- Respectar `docs/AGENTS_GUIDE.md` i `AGENTS.md`.
- L'agent s'atura com a maxim a `release/*` (no publica a produccio).
