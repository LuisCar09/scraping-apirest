
const express = require('express');
const app = express();
app.use(express.json());
const fs = require('node:fs')
app.use(express.urlencoded({ extended: true }));
let id = 0
let noticias = []
let proximoId = ""


app.get('/scraping', async (req, res) => {
    leerDatos();

    res.json(noticias)
})


app.get('/noticias/:id', (req, res) => {
    leerDatos();
    const id = parseInt(req.params.id);
    const findIndex = noticias.findIndex(noticia => noticia.id === id)

    if (findIndex === -1) {
        res.status(404).json({ 'Error': 'No encuentra la noticia por el id}' })
    } else {
        res.json(noticias[findIndex])
    }
})


app.post('/noticias', async (req, res) => {
    leerDatos();
    const { titulo, imagen, enlace, descripcion } = req.body
    const nuevaNoticia = {
        id: noticias.length + 1,
        titulo,
        imagen,
        enlace,
        descripcion
    }

    noticias.push(nuevaNoticia)
    guardarDatos()
    res.status(201).json({ 'message': 'successfully' })
})


app.put("/noticias/:id", (req, res) => {
    leerDatos()
    const idNoticia = parseInt(req.params.id)
    const { titulo, imagen, enlace, descripcion } = req.body
    const findIndex = noticias.findIndex(noticia => noticia.id === idNoticia)


    if (findIndex === -1) {

        res.status(404).json({ error: "noticia no encontrado" })

    } else {
        noticias[findIndex] = {
            ...noticias[findIndex],
            titulo: titulo || noticias[findIndex].titulo,
            imagen: imagen || noticias[findIndex].imagen,
            enlace: enlace || noticias[findIndex].enlace,
            descripcion: descripcion || noticias[findIndex].descripcion,

        }
        guardarDatos()
        res.json(noticias)
    }
})


app.delete('/noticias/:id', async (req, res) => {
    leerDatos();
    const id = parseInt(req.params.id);
    const findIndex = noticias.findIndex(noticia => noticia.id === id)

    if (findIndex === -1) {
        res.status(404).send('No encuentra la noticia por el id')
    } else {
        noticias = noticias.filter(noticia => noticia.id !== id)
        guardarDatos()
        res.json(noticias)

    }
})


    

app.listen(3000,()=>{
    console.log('Escuchando en http://localhost:3000')
})



// Leer datos desde el archivo JSON
function leerDatos() {
    try {
      const data = fs.readFileSync('noticias.json', 'utf-8');
       noticias = JSON.parse(data);
       
    } catch (error) {
      console.error('Error al leer el archivo noticias.json:', error.message);
    }
  }
  
  // Guardar datos en el archivo JSON
function guardarDatos() {
    fs.writeFileSync('noticias.json', JSON.stringify(noticias, null, 2));
}