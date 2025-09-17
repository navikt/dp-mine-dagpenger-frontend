const { rawlist } = require("@inquirer/prompts");
const fs = require("fs");
const path = require("path");

let envPath = path.resolve(__dirname, ".env");
let envText = fs.readFileSync(envPath, "utf-8");

const TOKENX_BASE_URL = "https://tokenx-token-generator.intern.dev.nav.no/api/public/obo";

const TOKEN_LIST = [
  {
    env: "DP_INNSYN_TOKEN",
    aud: "dev-gcp:teamdagpenger:dp-innsyn",
  },
  {
    env: "PAW_ARBEIDSSOEKERREGISTERET_TOKEN",
    aud: "dev-gcp:paw:paw-arbeidssoekerregisteret-api-oppslag",
  },
  {
    env: "OKONOMI_KONTOREGISTER_TOKEN",
    aud: "dev-gcp:okonomi:sokos-kontoregister-person",
  },
  {
    env: "SAF_TOKEN",
    aud: "dev-fss:teamdokumenthandtering:safselvbetjening-q1",
  },
];

const IDENT_LIST = [
  { name: "Top Sure: 21857998666", value: "21857998666" },
  { name: "Hes Påske: 17477146473", value: "17477146473" },
  { name: "Komplett Sol: 07447534341", value: "07447534341" },
  { name: "Dynamisk Røyskatt: 07430195322", value: "07430195322" },
];

init();

async function init() {
  try {
    const ident = await rawlist({
      message: "👤 Velg ident:",
      choices: IDENT_LIST,
    });

    for (const { env, aud } of TOKEN_LIST) {
      const token = await getToken(ident, aud);

      if (!token) {
        throw new Error(`Token ble ikke funnet for ${env}`);
      }

      setEnvValue(env, token);
    }
  } catch (err) {
    console.error("❌ Feil:", err.message);
  }
}

async function getToken(ident, aud) {
  const formData = new FormData();

  formData.append("pid", ident);
  formData.append("aud", aud);

  try {
    const response = await fetch(TOKENX_BASE_URL, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.text();
  } catch (err) {
    console.error("❌ Feil ved henting av token fra TokenX:", err.message);
    return null;
  }
}

function setEnvValue(key, value) {
  const regex = new RegExp(`^${key}=.*$`, "m");
  if (envText.match(regex)) {
    envText = envText.replace(regex, `${key}=${value}`);
  } else {
    envText += `\n${key}=${value}`;
  }

  fs.writeFileSync(envPath, envText, "utf-8");

  console.info(`✅ ${key}`);
}
