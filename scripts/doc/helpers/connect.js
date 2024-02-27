require("dotenv").config();
const jsforce = require("jsforce");
const DEBUG = process.env.DEBUG || false;

const conn = new jsforce.Connection({
  loginUrl: "https://test.salesforce.com"
});

async function connect() {
  const username = process.env.SF_USERNAME;
  const password = process.env.SF_PASSWORD;

  if (username === undefined || password === undefined) {
    console.error(
      "Por favor configure SF_USERNAME y SF_PASSWORD como variables de entorno"
    );
    console.warn("1. Puede clonar el archivo .env.sample ");
    console.warn("2. Configurar las variables de entorno ");
    console.warn(
      "3. Ejecutar el comnado con anteponiendo las variables SF_USERNAME=xx SF_PASSWORD=xx npm run"
    );
    process.exit(-1);
  }

  try {
    const userInfo = await conn.login(username, password);
    if (DEBUG) {
      console.log("accessToken", conn.accessToken);
    }
  } catch (e) {
    if (DEBUG) {
      console.log(e);
    }
    throw `Por favor verifique usuario y password ${username} ${password}`;
  }
}

function check() {
  return conn.accessToken ? true : false;
}

async function getClasses(fullNames) {
  try {
    // > tooling.sobject('ApexClass').find({ Name: "AsistenciasController" })
    const classNames = fullNames.map((clase) => clase.replace(".cls", ""));
    const metadata = await conn.tooling
      .sobject("ApexClass")
      .find({ Name: classNames }, [
        "Name",
        "Status",
        "IsValid",
        "ApiVersion",
        "CreatedDate",
        "LastModifiedDate",
        "SymbolTable"
      ]);

    if (DEBUG) {
      console.log(JSON.stringify(metadata));
    }
    return metadata;
  } catch (e) {
    if (DEBUG) {
      console.log(e);
    }
    throw `Error buscando metadata de las clases ${fullNames}`;
  }
}

async function customObjects(fullNames) {
  try {
    let metadata;
    if (fullNames.length <= 10) {
      metadata = await conn.metadata.read("CustomObject", fullNames);
    } else {
      metadata = [];
      do {
        const items = fullNames.splice(0, 10);
        const result = await conn.metadata.read("CustomObject", items);
        metadata = metadata.concat(result);
      } while (fullNames.length > 0);
    }

    if (DEBUG) {
      console.log(JSON.stringify(metadata));
    }
    return metadata;
  } catch (e) {
    if (DEBUG) {
      console.log(e);
    }
    throw `Error buscando metadata de los objetos ${fullNames}`;
  }
}

module.exports = { connect, check, customObjects, getClasses };
