const sf = require("./connect");
const prompts = require("prompts");
const templateEngine = require("./template")("dictionary", "md");

const {
  getLwcCache,
  setLwcCache,
  sortByName,
  DICTIONARY_FOLDER,
  DOCS_FOLDER,
  WORKING_FOLDER,
  DEFAULT_INTRO
} = require("./util");
const DEFAULT_FILENAME = DOCS_FOLDER + "/.lwc.json";

async function getLwc(lwc) {
  try {
    await sf.connect();
    const lwcRecords = await sf.getLwc(lwc);
    return lwcRecords;
  } catch (e) {
    console.error(e);
  }
}

async function prompt(config) {}

async function getContext(items, opciones) {
  let contexts;

  // flag -i lee del archivo cache
  if (opciones && "i" in opciones) {
    const allLwc = getLwcCache(opciones.i ? opciones.i : DEFAULT_FILENAME);
    contexts = allLwc.filter((lwc) => items.includes(lwc.Name));
  } else if (opciones && "r" in opciones) {
    // flag -r lee del archivo cache pero vuelve a buscar la metadata
    contexts = getLwcCache(opciones.r ? opciones.r : DEFAULT_FILENAME);
    const itemsEnCache = contexts.map((lwc) => lwc.Name);
    contexts = await getLwc(itemsEnCache);
  } else {
    // Sino buscar la metadata segun los items
    contexts = await getLwc(items);
  }

  if (contexts && !Array.isArray(contexts)) {
    contexts = [contexts];
  }
  return contexts;
}

function help() {
  console.log(
    "Este comando se conecta a la metadata de los LWC de Salesforce y en base a los templates genera:"
  );
  console.log(
    "1. Por cada lwc usa el template lwc.md para crear un diccionario de datos del componente en la carpeta " +
      DICTIONARY_FOLDER
  );
  console.log(
    "2. Crea un indice en la working folder usando el template lwcs.md"
  );
  console.log(
    "\nPuede llamarse para un objeto o varios, de la siguiente forma:"
  );
  console.log("yarn doc:create lwc <<componentName>>");
  console.log("yarn doc:create lwc <<componentName1>> <<componentName2>>");
}

async function execute({ items, opciones }) {
  // Busca la metadata
  let contexts = await getContext(items, opciones);

  if (!contexts || contexts.length === 0) {
    return;
  }

  // Arma el diccionario de cada LWC
  templateEngine.read("lwc");
  for (const context of contexts) {
    templateEngine.render(context, {
      helpers: {}
    });
    templateEngine.save(context.Name, DICTIONARY_FOLDER + "/lwc");
  }

  // Arma el documento indice del grupo de lwc
  contexts.sort(sortByName);
  templateEngine.read("lwcs");

  if ("o" in opciones) {
    const fileName = opciones.o ? opciones.o : DEFAULT_FILENAME;
    setLwcCache(fileName, contexts);
  }

  const lwcContext = { lwc: contexts, namespaces };
  templateEngine.render(lwcContext, {
    helpers: {}
  });
  const intro = opciones.m ? opciones.m : DEFAULT_INTRO;
  templateEngine.save(intro, WORKING_FOLDER);
}

module.exports = {
  prompt,
  help,
  execute
};
