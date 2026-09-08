const express = require('express');
const path = require('node:path');
const { leerInstrumentos, escribirInstrumentos } = require('./archivos');

const PORT = 3000;

async function main() {
  try {
    const rutaArchivo = path.join(__dirname, '../datos/instrumentos.json');

    let instrumentos = await leerInstrumentos(rutaArchivo);

    const app = express();

    app.use(express.json());

    // 1. Ruta raíz / bienvenida
    app.get('/', (req, res) => {
      console.log("Solicitud entrante recibida en la raíz");
      res.status(200).json({ mensaje: 'API de Catálogo de Instrumentos Musicales disponible 🎵' });
    });

    // 2. Listado de instrumentos (con soporte para filtrar por ?familia=...)
    app.get('/api/instrumentos', (req, res) => {
      const { familia } = req.query;

      if (familia) {
        const filtrados = instrumentos.filter(
          (ins) => ins.familia.toLowerCase() === familia.toLowerCase()
        );
        return res.status(200).json(filtrados);
      }

      res.status(200).json(instrumentos);
    });

    // 3. Detalle de un instrumento por su ID
    app.get('/api/instrumentos/:id', (req, res) => {
      const idBuscado = Number(req.params.id);
      const instrumento = instrumentos.find((ins) => ins.id === idBuscado);

      if (!instrumento) {
        return res.status(404).json({ error: 'Instrumento no encontrado con ese identificador.' });
      }

      res.status(200).json(instrumento);
    });

    // 4. Creación de un nuevo instrumento (con escritura asíncrona en archivo)
    app.post('/api/instrumentos', async (req, res) => {
      const { nombre, familia, origen, descripcion, disponible } = req.body;

      if (
        !nombre ||
        !familia ||
        !origen ||
        !descripcion ||
        disponible === undefined
      ) {
        return res.status(400).json({ error: 'Faltan campos obligatorios o el campo disponible es inválido.' });
      }

      const nuevoId = instrumentos.length > 0 ? instrumentos[instrumentos.length - 1].id + 1 : 1;

      const nuevoInstrumento = {
        id: nuevoId,
        nombre,
        familia,
        origen,
        descripcion,
        disponible
      };

      instrumentos.push(nuevoInstrumento);

      try {
        await escribirInstrumentos(rutaArchivo, instrumentos);
        res.status(201).json(nuevoInstrumento);
      } catch (error) {
        console.error('Error al guardar el archivo:', error.message);
        res.status(500).json({ error: 'No se pudo guardar el instrumento en el archivo.' });
      }
    });

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('Error de inicio crítico: No se pudo leer o interpretar el archivo JSON de instrumentos.', error.message);
    process.exit(1);
  }
}

main();