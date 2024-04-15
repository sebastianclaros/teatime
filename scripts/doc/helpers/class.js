const sf = require("./connect");
const prompts = require("prompts");
const templateEngine = require("./template")("dictionary", "md");

const {
  getClassesCache,
  setClassesCache,
  sortByName,
  getNamesByExtension,
  verFecha,
  splitFilename,
  DICTIONARY_FOLDER,
  DOCS_FOLDER,
  WORKING_FOLDER,
  DEFAULT_INTRO
} = require("./util");
const DEFAULT_FILENAME = DOCS_FOLDER + "/.classes.json";

async function getClasses(clases) {
  try {
    await sf.connect();
    const classRecords = await sf.getClasses(clases);
    return classRecords;
  } catch (e) {
    console.error(e);
  }
}

const dictionaryClasses = getNamesByExtension(
  DICTIONARY_FOLDER + "/classes",
  "md"
);

async function prompt(config) {}

async function getContext(items, opciones) {
  let contexts;

  // flag -i lee del archivo cache
  if (opciones && "i" in opciones) {
    const allClasses = getClassesCache(
      opciones.i ? opciones.i : DEFAULT_FILENAME
    );
    contexts = allClasses.filter((clase) => items.includes(clase.Name));
  } else if (opciones && "r" in opciones) {
    // flag -r lee del archivo cache pero vuelve a buscar la metadata
    contexts = getClassesCache(opciones.r ? opciones.r : DEFAULT_FILENAME);
    const itemsEnCache = contexts.map((clase) => clase.Name);
    contexts = await getClasses(itemsEnCache);
  } else {
    // Sino buscar la metadata segun los items
    contexts = await getClasses(items);
  }

  if (contexts && !Array.isArray(contexts)) {
    contexts = [contexts];
  }
  return contexts;
}

function help() {
  console.info(
    "Este comando se conecta a la metadata de las clases de Salesforce (fuentes) y en base a los templates genera:"
  );
  console.info(
    "1. Por cada clase usa el template class.md para crear un diccionario de datos de la clase en la carpeta " +
      DICTIONARY_FOLDER
  );
  console.info(
    "2. Crea un indice en la working folder usando el template classes.md"
  );
  console.info(
    "\nPuede llamarse para un objeto o varios, de la siguiente forma:"
  );
  console.info("yarn doc:create class AccountController.cls");
  console.info(
    "yarn doc:create class AccountController.cls CaseController.cls"
  );
}

function classLink() {
  const name = this.Name;
  return `./diccionarios/classes/${name}`;
}

function classLinkGraph() {
  const name = this.Name;
  return `./diccionarios/classes/${name}`;
}

function linkToType() {
  const fullType = this.replace("<", "~").replace(">", "~");
  const types = fullType.split("~");
  for (const t in types) {
    if (dictionaryClasses.includes(t)) {
      fullType.replace(t, `[{t}](./diccionarios/classes/{t})`);
    }
  }
  return fullType;
}

function filterByPublic() {
  return this.modifiers.includes("public") || this.modifiers.includes("global");
}

function scopeModifiers() {
  const modifiers = [];

  if (this.modifiers.includes("public") || this.modifiers.includes("global")) {
    modifiers.push(`+`);
  }
  if (this.modifiers.includes("private")) {
    modifiers.push(`-`);
  }
  if (this.modifiers.includes("protected")) {
    modifiers.push(`#`);
  }
  return modifiers.join(" ");
}

function modifiers() {
  const modifiers = [];

  if (this.modifiers.includes("abstract")) {
    attributes.push(`*`);
  }
  if (this.modifiers.includes("override")) {
    modifiers.push(`o`);
  }
  if (this.modifiers.includes("static") || this.modifiers.includes("final")) {
    modifiers.push(`$`);
  }
  return modifiers.join(" ");
}

function classAttributes() {
  const attributes = [];

  // if (this.isValid === "true") {
  //   attributes.push(`![Encripted](/img/password_60.png)`);
  // }
  if (this.SymbolTable.tableDeclaration.modifiers.includes("static")) {
    attributes.push(`$`);
  }
  if (
    this.SymbolTable.tableDeclaration.modifiers.includes("public") ||
    this.SymbolTable.tableDeclaration.modifiers.includes("global")
  ) {
    attributes.push(`+`);
  }
  if (this.SymbolTable.tableDeclaration.modifiers.includes("private")) {
    attributes.push(`-`);
  }
  if (this.SymbolTable.tableDeclaration.modifiers.includes("protected")) {
    attributes.push(`#`);
  }
  if (this.SymbolTable.tableDeclaration.modifiers.includes("global")) {
    attributes.push(`G`);
  }

  return attributes.join(" ");
}

function getInnerClasses(classes) {
  let ret = [];

  for (const clase of classes) {
    if (clase.SymbolTable?.innerClasses?.length > 0) {
      const innerClases = clase.SymbolTable.innerClasses.map((subclase) => {
        subclase.namespace =
          (clase.namespace ? clase.namespace + "." : "") + clase.Name;
        return {
          Name: subclase.name,
          type: "inner",
          namespace: subclase.namespace,
          SymbolTable: subclase
        };
      });
      ret = ret.concat(innerClases);
      const subInner = getInnerClasses(clase.SymbolTable.innerClasses);
      ret = ret.concat(subInner);
    }
  }
  return ret;
}

async function execute({ items, opciones }) {
  const classNames = items.map((clase) => clase.replace(".cls", ""));

  // Busca la metadata
  let contexts = await getContext(classNames, opciones);

  if (!contexts || contexts.length === 0) {
    return;
  }

  // Arma el diccionario de cada Clase
  templateEngine.read("class");
  for (const context of contexts) {
    templateEngine.render(context, {
      helpers: {
        verFecha,
        modifiers,
        linkToType,
        classLinkGraph,
        filterByPublic
      }
    });
    templateEngine.save(context.Name, DICTIONARY_FOLDER + "/classes");
  }

  // Saca las innerClass y las pone como clases con namespace
  const innerClasses = getInnerClasses(contexts);
  let namespaces = {};
  if (innerClasses.length > 0) {
    templateEngine.read("class-inner");
    for (const context of innerClasses) {
      templateEngine.render(context, {
        helpers: { verFecha, modifiers, linkToType }
      });
      templateEngine.save(
        context.Name,
        DICTIONARY_FOLDER + "/classes/" + context.namespace,
        { create: true }
      );
      // arma un mapa de namespace con el array de sus innerclases
      if (namespaces[context.namespace] === undefined) {
        namespaces[context.namespace] = [context.Name];
      } else {
        namespaces[context.namespace].push(context.Name);
      }
    }
    contexts = contexts.concat(innerClasses);
  }

  // Arma el documento indice del grupo de clases
  contexts.sort(sortByName);
  templateEngine.read("classes");

  if ("o" in opciones) {
    const fileName = opciones.o ? opciones.o : DEFAULT_FILENAME;
    setClassesCache(fileName, contexts);
  }

  const classContext = { classes: contexts, namespaces };
  templateEngine.render(classContext, {
    helpers: {
      verFecha,
      modifiers,
      linkToType,
      filterByPublic,
      classLinkGraph,
      classLink
    }
  });
  const intro = opciones.m ? opciones.m : DEFAULT_INTRO;
  const { folder, filename } = splitFilename(intro, WORKING_FOLDER);
  templateEngine.save(filename, folder);
}

module.exports = {
  prompt,
  help,
  execute
};

/**
 * TODO
 * innerClass
 * annotations
 * locations links
 * complex types Map<Class, Class>
 * relaciones composicion, etc
 */

/* annotations
@AuraEnabled
@TestSetup
@TestVisible
@IsTest
@Future

@Deprecated
@InvocableMethod
@InvocableVariable
@JsonAccess
@NamespaceAccessible
@ReadOnly
@RemoteAction
@SuppressWarnings

@ReadOnly

REST API 
@RestResource(urlMapping='/nombremiapi')
@HttpDelete
@HttpGet
@HttpPatch
@HttpPost
@HttpPut
*/
