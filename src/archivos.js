const fs = require('node:fs/promises');

async function leerInstrumentos(rutaArchivo) {
  try {
    const contenido = await fs.readFile(rutaArchivo, 'utf8');
    return JSON.parse(contenido);
  } catch (error) {
    throw new Error(`No se pudo leer o interpretar el archivo de instrumentos: ${error.message}`);
  }
}

async function escribirInstrumentos(rutaArchivo, instrumentos) {
  try {
    await fs.writeFile(rutaArchivo, JSON.stringify(instrumentos, null, 2));
    console.log("Archivo de instrumentos JSON escrito correctamente.");
  } catch (error) {
    console.error(`No se pudo escribir el archivo de instrumentos: ${error.message}`);
  }
}

module.exports = {
  leerInstrumentos,
  escribirInstrumentos
};