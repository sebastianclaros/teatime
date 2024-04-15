const templateEngine = require("./template")(".", "md");
const fs = require("fs");
const { getMetadataArray, DOCS_FOLDER } = require("./util");
const prompts = require("prompts");

const helpers = {
  objects: require("./object"),
  classes: require("./class"),
  lwc: require("./lwc")
};

const newHelper = require("./new");

async function prompt(config) {
  const opciones = Object.keys(config.opciones);
  if (!opciones.includes("r")) {
    const response = await prompts([
      {
        type: "select",
        name: "refresh",
        initial: false,
        message: "Tiene que bajar o actualizar la metadata de Saleforce ?",
        choices: [
          { title: "Si (baja y actualiza el cache en docs)", value: true },
          { title: "No (lee el cache que esta en docs)", value: false }
        ]
      },
      {
        type: "text",
        name: "filename",
        initial: "docs/metadata.json",
        message: "Nombre del archivo metadata json"
      }
    ]);
    if (!response.refresh) {
      return;
    }
    config.opciones.r = response.refresh;
    config.opciones.f = response.filename;
  }
}

function help() {
  console.info("Este comando pretende documentar soluciones modularizadas.");
  console.info(
    "Recibe un json con la estructura jerarquica, ejemplo modulos, submodulos y procesos."
  );
  console.info(
    "El ultimo elemento, en el ejemplo el proceso tiene las clases, objetos, lwc y demas componenetes de documentacion relacionados."
  );
  console.info(
    "El comando genera un markdown indice para cada nodo, de forma tal que el modulo contiene todos los componentes de sus submodulos y estos los de sus procesos."
  );
  console.info(
    "Si se invocar con --r (refresh), baja primero toda la metadata de SF. Si no recibe el archivo .json toma por default docs/metadata.json "
  );
  console.info("> yarn doc:create metadata --r --f=<<archivo.json>>");
  console.info("> yarn doc:create metadata --f=<<archivo.json>>");
}

async function execute({ opciones }) {
  const hasRefresh =
    Object.keys(opciones).includes("r") &&
    opciones.r !== "false" &&
    opciones.r !== false;
  const components = Object.keys(helpers);
  const nodes = getMetadataArray(opciones.f, components);

  for (const node of nodes) {
    const isRoot = node.path === ".";
    const filename = node.hasChilds
      ? `${node.path}/intro.md`
      : `${node.path}/${node.name}.md`;
    newHelper.execute({ template: "intro", filename, context: node });
    for (const component of components) {
      const items = node[component];
      if (items?.length > 0) {
        const helper = helpers[component];
        const opciones = { m: filename };
        if (isRoot && hasRefresh) {
          opciones.o = "";
        } else {
          opciones.i = "";
        }
        helper.execute({ items, opciones });
      }
    }
  }
}

module.exports = {
  prompt,
  help,
  execute
};

/**
 * example json

[
    {
    "name": "modulo",
    "description": "descripcion del modulo",
    "directory": "path", // si no viene es el name
    "childs": [ 
        { 
        "name": "",
        "description": "descripcion del item",
        "folder": "folder-name-only", 
        "objects": [ "", ""], 
        "classes": [ "", ""],
        "lwc": [ "", ""]
        }
    ]
    }
]
 */
