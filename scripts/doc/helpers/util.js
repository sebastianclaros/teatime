const DOCS_FOLDER = process.cwd() + "/docs";
const DICTIONARY_FOLDER = process.cwd() + "/docs/diccionarios";
const WORKING_FOLDER = process.env.INIT_CWD || ".";
const DEFAULT_METADATAFILENAME = DOCS_FOLDER + "/metadata.json";

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

function mergeArray(baseArray, newArray) {
  if (!Array.isArray(newArray) && !Array.isArray(baseArray)) {
    return [];
  }
  // Si el new esta vacio
  if (!Array.isArray(newArray) || newArray.length == 0) {
    return baseArray;
  }
  // Si el base esta vacio
  if (!Array.isArray(baseArray) || baseArray.length == 0) {
    return newArray;
  }
  // Sino filtra y concatena
  const notIncludeInBaseArray = (a) => baseArray.indexOf(a) === -1;
  return baseArray.concat(newArray.filter(notIncludeInBaseArray));
}

function getMetadataArray(fileName, props) {
  const mergeObject = (root, childs) => {
    for (const item of childs) {
      for (const key of props) {
        root[key] = mergeArray(root[key], item[key]);
      }
    }
    return root;
  };
  const getItemsFromTree = (node, parentPath) => {
    const items = [];
    if (Array.isArray(node)) {
      for (const item of node) {
        items.push(...getItemsFromTree(item, parentPath));
      }
    } else {
      const folder = node.folder || node.name;
      node.path = parentPath ? `${parentPath}/${folder}` : folder;
      if (node.childs) {
        // Borra el childs, pero le deja hasChilds en true para saber si es una hoja del arbol
        let { childs, ...itemToAdd } = node;
        itemToAdd.hasChilds = true;
        const childItems = getItemsFromTree(childs, node.path);
        items.push(mergeObject(itemToAdd, childItems));
        items.push(...childItems);
      } else {
        items.push(node);
      }
    }
    return items;
  };

  const metadata = getMetadata(fileName);
  if (Array.isArray(metadata)) {
    return getItemsFromTree({ folder: DOCS_FOLDER, childs: metadata });
  } else {
    return getItemsFromTree(metadata, "");
  }
}

function getMetadata(fileName = DEFAULT_METADATAFILENAME) {
  const fullName =
    fileName.indexOf("/") != -1 ? fileName : WORKING_FOLDER + "/" + fileName;
  if (!fs.existsSync(fullName)) {
    throw new Error(
      `No existe el archivo ${fullName}. Debe ser un json con la metadata`
    );
  }
  const content = fs.readFileSync(fullName);
  try {
    return JSON.parse(content);
  } catch {
    throw new Error(`Archivo invalido: el  ${fileName} debe ser un json`);
  }
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
      `Archivo invalido: el  ${fileName} debe ser un json generado por el flag -o`
    );
  }
}

function splitFilename(fullname, defaultFolder) {
  let filename = fullname;
  let folder = defaultFolder;
  const separatorIndex = fullname.lastIndexOf("/");
  if (separatorIndex !== -1) {
    folder = fullname.substring(0, separatorIndex);
    filename = fullname.substring(separatorIndex + 1);
  }
  return { filename, folder };
}

module.exports = {
  DICTIONARY_FOLDER,
  DOCS_FOLDER,
  WORKING_FOLDER,
  DEFAULT_INTRO,
  splitFilename,
  getMetadataArray,
  getNamesByExtension,
  sortByLabel,
  sortByName,
  getObjectsCache,
  getClassesCache,
  setObjectsCache,
  setClassesCache,
  verFecha
};
