require("dotenv").config();
const jsforce = require("jsforce");
const DEBUG = process.env.DEBUG || false;

let conn;

async function connect() {
  const username = process.env.SF_USERNAME;
  const password = process.env.SF_PASSWORD;
  const accessToken = process.env.SF_AUTHTOKEN;
  const instanceUrl = process.env.SF_INSTANCEURL;

  if (!(username && password) && !(accessToken && instanceUrl)) {
    console.error(
      "Para bajar la metadata la herramienta se loguea a Salesforce."
    );
    console.error(
      "Puede correr el comando de config o modificar manualmente el .env"
    );
    console.error("yarn doc:config");
    throw new Error("Falta configurar ejecute: yarn doc:config");
  }

  if (accessToken && instanceUrl) {
    try {
      conn = new jsforce.Connection({ instanceUrl, accessToken });
      if (DEBUG) {
        console.log(conn);
      }
    } catch (e) {
      if (DEBUG) {
        console.log(e);
      }
      throw `Por favor verifique accessToken y instanceUrl ${accessToken} ${instanceUrl}`;
    }
  }

  if (username && password) {
    try {
      conn = new jsforce.Connection({
        loginUrl: process.env.SF_LOGINURL || "https://test.salesforce.com"
      });
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
