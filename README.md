# dp-mine-dagpenger-frontend: Mine dagpenger søknader

Frontend-klient for mine dagpenger

## Komme i gang

Appen er basert på [Remix.run](https://remix.run/)

**For Mac OSX**

```shell
npm install
npm run setup-env
npm run generate-token
npm run dev
```

**For Windows**

```shell
npm install
npm run setup-env
npm run dev
```

`npm run setup-env` lager en `.env` som er nødvendig for kunne kjøre opp applikasjonen lokalt.

`npm run generate-token` genererer lokal token til `.env` fil og bruker det til å hente data fra dev-miljøet. Toknene er gyldig mellom 30 minutter til en time, kjør kommandoen på nytt dersom tokene er utløpt.

## Kjøre localhost med mock data

For å kjøre localhost med mock data kan du enkelt sette `USE_MOCKS="true"` i `.env` filen og restart localhost på nytt.

## Henvendelser

Spørsmål knyttet til koden eller prosjektet kan rettes mot:

- Nattaphong Klinjan, nattaphong.klinjan@nav.no

## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen #team-dagpenger-dev.

## Testing

```shell
npm run test
```

## Kode-konvensjoner

- Bruk engelsk for alt unntatt domenespesifikke termer (eks: faktum, seksjon).
- Filnavn:
  - Bruk PascalCase for React-komponenter.
  - Bruk kebab-case for rene ts-filer
- Named exports --> Alle eksporter skal være navngitt (unngå default)
- CSS:
  - Bruk css-modules - Unngå inline style.
  - Følg navnekonvensjon for tilhørende komponent.

## Git-konvensjoner

- Multi-line commits --> Første linje beskriver hva som er gjort (kort). Forklar hvorfor endringen er gjort på etterføllgende linjer
- Referer til Github-issue (navikt/dagpenger#[issue-nummer])
