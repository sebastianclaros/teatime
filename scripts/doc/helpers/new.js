const templateEngine = require("./template")(".", "md");
const fs = require("fs");
const prompts = require("prompts");
const WORKING_FOLDER = process.env.INIT_CWD || ".";

async function prompt(config) {
  const templates = templateEngine.getTemplates();
  const templateInexistente = !templates.includes(config.template);
  if (templateInexistente) {
    config.template = undefined;
  }
  if (!config.template) {
    const response = await prompts({
      type: "select",
      name: "template",
      initial: config.template,
      message: templateInexistente
        ? "El template no es valido, seleccione uno por favor"
        : "Seleccione un template",
      choices: templates.map((template) => {
        return { title: template, value: template };
      })
    });
    if (!response.template) {
      return;
    }
    config.template = response.template;
  }

  if (!config.filename) {
    const response = await prompts({
      type: "text",
      name: "filename",
      initial: config.filename || config.template,
      message: "Nombre del archivo (sin extension)"
    });

    config.filename = response.filename;
  }
}

function help() {
  console.log(
    "Este comando es un boilerplate de documentos basados en los templates de la carpeta scripts/templates/create."
  );
  console.log(
    "El objetivo es que antes de crear un componente de documentacion se pueda armar es esqueleto de forma estandar."
  );
  console.log(
    "Por ejemplo si se quiere documentar los servicios de un proceso se puede correr:"
  );
  console.log("> npm run doc new servicios");
  console.log("Si quiere correr el modo interactivo solo ejecute:");
  console.log("> npm run doc");
}

async function readPipedInput() {
  let data = "";
  for await (const chunk of process.stdin) data += chunk;

  return data;
}

// async function readPipedInput() {
//     const stdin = process.stdin;
//     let data = '';

//     stdin.setEncoding('utf8');

//     stdin.on('data', function (chunk) {
//       data += chunk;
//     });

//     stdin.on('end', function () {
//       return  data;
//     });
// }

async function execute({ template, filename, context }) {
  if (!template || !filename) {
    return;
  }
  const formulas = {
    today: Date.now(),
    filename: filename
  };
  let view;

  if (context) {
    const contextFile = WORKING_FOLDER + "/" + context;
    if (fs.existsSync(contextFile)) {
      const content = fs.readFileSync(contextFile, "utf8");
      view = JSON.parse(content);
    }
  } else {
    const content = await readPipedInput();
    view = JSON.parse(content);
  }
  templateEngine.read(template);
  templateEngine.render(view ? Object.assign(view, formulas) : formulas);
  templateEngine.save(filename, WORKING_FOLDER);
}

module.exports = {
  prompt,
  help,
  execute
};
