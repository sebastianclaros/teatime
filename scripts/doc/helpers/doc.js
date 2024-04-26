const fs = require("fs");
const prompts = require("prompts");

// Logica especificas de cada componente
const helpers = {
  object: require("./object"),
  class: require("./class"),
  lwc: require("./lwc"),
  metadata: require("./metadata"),
  new: require("./new")
};

async function prompt(config) {
  const componentes = Object.keys(helpers);
  componentes.push("help");
  const componenteInvalido = !componentes.includes(config.componente);
  if (componenteInvalido) {
    config.componente = undefined;
  }
  if (!config.componente) {
    const response = await prompts({
      type: "select",
      name: "componente",
      initial: config.componente,
      message: componenteInvalido
        ? "El componente no es valido, seleccione uno por favor"
        : "Seleccione un Componente",
      choices: componentes.map((componente) => {
        return { title: componente, value: componente };
      })
    });
    config.componente = response.componente;
  }
}

function help() {
  console.info(
    "Este comando es un automatizador de documentacion basada en templates"
  );
  console.info("Puede ejecutar los siguentes comandos:");
  Object.keys(helpers).forEach((comando) => {
    console.info(`yarn doc:create ${comando}`);
  });
}

function newArgument(argumentos) {
  return {
    template: argumentos[0],
    filename: argumentos[1],
    context: argumentos[2]
  };
}

function dictionaryArguments(argumentos) {
  const opciones = [];
  const items = [];
  // Si viene una lista de argumentos separa opciones (-flag=valor) y los items
  if (Array.isArray(argumentos)) {
    argumentos.forEach((argumento) => {
      if (argumento.startsWith("-")) {
        const desde = argumento.startsWith("--") ? 2 : 1;
        const [flag, valor] = argumento.substring(desde).split("=");

        opciones[flag] = valor;
      } else {
        items.push(argumento);
      }
    });
    return { items, opciones };
  }

  return { items: [argumento], opciones };
}
async function execute({ componente, argumentos }) {
  if (componente === "help") {
    help();
  } else {
    const helper = helpers[componente];

    if (argumentos[0] === "help") {
      helper.help();
    } else {
      const config =
        componente === "new"
          ? newArgument(argumentos)
          : dictionaryArguments(argumentos);
      if (typeof helper.prompt === "function") {
        await helper.prompt(config);
      }
      const context = await helper.execute(config);
    }
  }
}

module.exports = {
  prompt,
  help,
  execute
};
