const DOCS_FOLDER = process.cwd() + "/docs";
const DICTIONARY_FOLDER = process.cwd() + "/docs/diccionarios";
const WORKING_FOLDER = process.env.INIT_CWD || ".";
const DEFAULT_INTRO = "intro";
const fs = require("fs");

function sortByName(objA, objB) {
  return objA.Name > objB.Name ? 1 : objA.Name < objB.Name ? -1 : 0;
}

function sortByLabel(objA, objB) {
  return objA.label > objB.label ? 1 : objA.label < objB.label ? -1 : 0;
}

function verFecha() {
  try {
    const fecha = new Date(this);
    return fecha.toLocaleString("es", {
      day: "numeric",
      year: "2-digit",
      month: "long"
    });
  } catch (e) {
    console.log(e);
    return this;
  }
}

// Devuelve la lista de nombres de archivos de una extension de una carpeta, sin la extension.
function getNamesByExtension(folder, extension) {
  const allFiles = fs.readdirSync(folder);
  const filterFiles = [];

  for (const fullname in allFiles) {
    if (fullname.endsWith(extension)) {
      filterFiles.push(fullname.replace("." + extension, ""));
    }
  }
  return filterFiles;
}

function setContextCache(fileName, items, propName, filterFn) {
  const fullName =
    fileName.indexOf("/") != -1 ? fileName : WORKING_FOLDER + "/" + fileName;
  let allitems;
  if (fs.existsSync(fullName)) {
    const cache = getContextCache(fileName);
    const filterCache = cache[propName].filter(filterFn);
    allitems = filterCache.concat(items);
  } else {
    allitems = items;
  }
  fs.writeFileSync(
    fileName,
    JSON.stringify({ [propName]: allitems }, null, "\t")
  );
}

function setClassesCache(fileName, items) {
  const itemKeys = items.map((item) => item.Name);
  filterFn = (item) => !itemKeys.includes(item.Name);
  setContextCache(fileName, items, "classes", filterFn);
}
function setObjectsCache(fileName, items) {
  const itemKeys = items.map((item) => item.fullName);
  filterFn = (item) => !itemKeys.includes(item.fullName);
  setContextCache(fileName, items, "objects", filterFn);
}

function getClassesCache(fileName) {
  return getContextCache(fileName).classes;
}

function getObjectsCache(fileName) {
  return getContextCache(fileName).objects;
}

function getContextCache(fileName) {
  const fullName =
    fileName.indexOf("/") != -1 ? fileName : WORKING_FOLDER + "/" + fileName;
  if (!fs.existsSync(fullName)) {
    throw new Error(
      `No existe el archivo ${fullName}. Debe ser un json generado por el flag -o`
    );
  }
  const content = fs.readFileSync(fullName);
  try {
    return JSON.parse(content);
  } catch {
    throw new Error(
      "Archivo invalido: el  ${fileName} debe ser un json generado por el flag -o"
    );
  }
}

module.exports = {
  DICTIONARY_FOLDER,
  DOCS_FOLDER,
  WORKING_FOLDER,
  DEFAULT_INTRO,
  getNamesByExtension,
  sortByLabel,
  sortByName,
  getObjectsCache,
  getClassesCache,
  setObjectsCache,
  setClassesCache,
  verFecha
};
