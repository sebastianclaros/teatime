const fs = require("fs");
const ENV_FILE = process.cwd() + "/.env";
const existEnv = fs.existsSync(ENV_FILE);
const prompts = require("prompts");

if (existEnv) {
  console.warn(
    "Ya existe el archivo .env. En este caso recomendamos que corra:"
  );
  console.warn("sf org display user");
  console.warn(
    "Y actualice SF_USERNAME y SF_PASSWORD o SF_AUTHTOKEN y SF_INSTANCEURL"
  );
  process.exit(-1);
}

console.log(
  "Para loguearse a Salesforce se creara un archivo .env y se guardara ahi credenciales de la instacia de donde se bajaran los metadatos"
);
console.log("Si no tiene estos datos puede ejecutar:");
console.log("sf org display user");

createEnvFile();

async function createEnvFile() {
  const resLoginType = await prompts({
    type: "select",
    name: "tipoLogin",
    message: "Que tipo de login vas a usar ?",
    choices: [
      { title: "Authentication Token", value: "auth", default: true },
      { title: "Usuario y Password", value: "user" }
    ]
  });
  if (resLoginType.tipoLogin == "auth") {
    const resCreds = await prompts([
      {
        type: "text",
        name: "token",
        require: true,
        message:
          "Ingrese el Access Token ? Si no lo sabe ejecute: sf org display user "
      },
      {
        type: "text",
        name: "login",
        message: "Ingrese la Instance Url ?"
      }
    ]);
    if (resCreds.login && resCreds.token) {
      fs.writeFileSync(
        ENV_FILE,
        `SF_INSTANCEURL=${resCreds.login}\nSF_AUTHTOKEN=${resCreds.token}\n`
      );
    }
  } else if (resLoginType.tipoLogin == "user") {
    const resCreds = await prompts([
      {
        type: "text",
        name: "username",
        require: true,
        message: "Ingrese el Username ? "
      },
      {
        type: "text",
        name: "password",
        require: true,
        message:
          'Ingrese la password (si no tiene puede usar access token o bien crear una con el comando "sf org generate password") ?'
      },
      {
        type: "text",
        name: "login",
        initial: "https://test.salesforce.com/",
        message:
          "Ingrese Login Url (para sandbox test https://test.salesforce.com/, produccion https://login.salesforce.com/) ?"
      }
    ]);
    if (resCreds.username && resCreds.password) {
      fs.writeFileSync(
        ENV_FILE,
        `SF_USERNAME=${resCreds.username}\nSF_PASSWORD=${resCreds.password}\nSF_LOGINURL=${resCreds.login}\n`
      );
    }
  }
}
