require("dotenv").config();
const jsforce = require("jsforce");
const DEBUG = process.env.DEBUG || false;
const API_VERSION = "60.0";

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
      conn = new jsforce.Connection({
        instanceUrl,
        accessToken,
        version: API_VERSION
      });

      //      const identity = await conn.identity();
      //    console.log(identity);

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
        loginUrl: process.env.SF_LOGINURL || "https://test.salesforce.com",
        version: API_VERSION
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

async function getOmni(fullNames) {}

async function getIP(fullNames) {}

async function getDependencies(listOfIds, filterTypes) {
  const ids = "('" + listOfIds.join("' , '") + "')";
  const up = await conn.tooling
    .sobject("MetadataComponentDependency")
    .find({ RefMetadataComponentId: listOfIds }, [
      "RefMetadataComponentId",
      "MetadataComponentId",
      "MetadataComponentName",
      "MetadataComponentType"
    ]);
  const down = await conn.tooling
    .sobject("MetadataComponentDependency")
    .find({ MetadataComponentId: listOfIds }, [
      "MetadataComponentId",
      "RefMetadataComponentId",
      "RefMetadataComponentName",
      "RefMetadataComponentType"
    ]);
  let dependencies = {};
  for (const record in up) {
    const entry = {
      Id: record.MetadataComponentId,
      name: record.MetadataComponentName,
      type: record.MetadataComponentType
    };
    let item = dependencies[record.RefMetadataComponentId];
    if (!item) {
      item = { parents: [], childs: [] };
    }
    item.childs.push(entry);
  }
  for (const record in down) {
    const entry = {
      Id: record.RefMetadataComponentId,
      name: record.RefMetadataComponentName,
      type: record.RefMetadataComponentType
    };
    let item = dependencies[record.MetadataComponentId];
    if (!item) {
      item = { parents: [], childs: [] };
    }
    item.parents.push(entry);
  }
  console.log(up, down, dependencies);
  return dependencies;
}
function expiredSession() {
  console.error(
    "El token de la sesion expiro, puede actualizarlo manualmente corriendo sf org display y copiar el Access Token en el .env "
  );
  process.exit(-1);
}
async function getLwc(fullNames) {
  /**
Archivos, JS => JSDoc
*/
  //console.log( JSON.stringify(conn.version) );
  try {
    const bundle = await conn.tooling
      .sobject("LightningComponentBundle")
      .find({ MasterLabel: fullNames }, [
        "MasterLabel",
        "Language",
        "Metadata",
        "NamespacePrefix",
        "Id"
      ]);
    const listOfIds = bundle.map((item) => item.Id);

    const listOfResources = await conn.tooling
      .sobject("LightningComponentResource")
      .find({ LightningComponentBundleId: listOfIds }, [
        "LightningComponentBundleId",
        "Format",
        "FilePath",
        "Source"
      ]);
    // Convierte los resources en un mapa con clave el Id y como valor la lista de sus resources
    let resources = {};
    for (const resource in listOfResources) {
      let lwcId = resource.LightningComponentBundleId;
      if (!resources[lwcId]) {
        resources[lwcId] = [resource];
      } else {
        resources[lwcId].push(resource);
      }
    }
    // Saca las dependencias
    let dependencies = getDependencies(listOfIds);

    const metadata = bundle.map((item) => {
      const lwc = {
        Name: MasterLabel,
        resources: resources[item.Id],
        dependencies: dependencies[item.Id],
        ...item.Metadata
      };
    });
    console.log(metadata);
    return metadata;
  } catch (e) {
    if (e.name == "INVALID_SESSION_ID" || e.name == "sf:INVALID_SESSION_ID") {
      expiredSession();
    }
    if (DEBUG) {
      console.log(e);
    }
    throw `Error buscando metadata de los lwc ${fullNames}. ERR-NAME: ${e.name}`;
  }
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
    if (e.name == "INVALID_SESSION_ID" || e.name == "sf:INVALID_SESSION_ID") {
      expiredSession();
    }
    if (DEBUG) {
      console.log(e);
    }
    throw `Error buscando metadata de las clases ${fullNames}. ERR-NAME: ${e.name}`;
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
    if (e.name == "INVALID_SESSION_ID" || e.name == "sf:INVALID_SESSION_ID") {
      expiredSession();
    }
    if (DEBUG) {
      console.log(e);
    }
    throw `Error buscando metadata de los objetos ${fullNames}. ERR-NAME: ${e.name}`;
  }
}

module.exports = {
  connect,
  check,
  customObjects,
  getDependencies,
  getClasses,
  getLwc,
  getOmni,
  getIP
};
