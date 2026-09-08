
const fs = require('node:fs/promises');

async function leerInstrumentos(rutaArchivo) {
  try {
    const contenido = await fs.readFile(rutaArchivo, 'utf8');
    return JSON.parse(contenido);
  } catch (error) {
  
    console.error
    (`No se pudo leer o interpretar el archivo de instrumentos: ${error.message}`);
  }
}

module.exports = {
  leerInstrumentos
};