// Comandos validos
const doc = require("./helpers/doc");
let config = { componente: process.argv[2], argumentos: process.argv.slice(3) };

doc.prompt(config).then(() => {
  try {
    if (config.componente && config.argumentos) {
      doc.execute(config);
    }
  } catch (e) {
    console.error(e);
  }
});
