require("dotenv").config();
const jsforce = require("jsforce");
const DEBUG = process.env.DEBUG || false;
const API_VERSION = "46.0";

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
      if (INVALID_SESSION_ID)
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
  const up =
    await conn.query(`SELECT RefMetadataComponentId, MetadataComponentId, MetadataComponentName, MetadataComponentType
    FROM MetadataComponentDependency Where RefMetadataComponentId IN :listOfIds`);

  const down =
    await conn.query(`SELECT MetadataComponentId, RefMetadataComponentId, RefMetadataComponentName, RefMetadataComponentType  
    FRom MetadataComponentDependency Where  MetadataComponentId = :listOfIds`);

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

    const metadata = bundle.map((item) => {
      const lwc = {
        Name: MasterLabel,
        resources: resources[item.Id],
        ...item.Metadata
      };
    });

    return metadata;
  } catch (e) {
    console.log(e);
    if (DEBUG) {
    }
    throw `Error buscando metadata de las clases ${fullNames}`;
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

module.exports = {
  connect,
  check,
  customObjects,
  getClasses,
  getLwc,
  getOmni,
  getIP
};
