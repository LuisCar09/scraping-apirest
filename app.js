
const express = require('express');
const app = express();
app.use(express.json());
const fs = require('node:fs')
app.use(express.urlencoded({ extended: true }));
let id = 0
let noticias =[]
let proximoId = ""


app.get('/scraping',async(req,res)=>{
    let noticiasNuevas = leerDatos();
    console.log(noticiasNuevas)
    res.send('Ruta scraping')
})

app.delete('/noticias/:id',async (req,res)=>{
    const id = parseInt( req.params.id);
   
    const news = await leerDatos()
    const findIndex = news.findIndex(ne => ne.id === id)
    console.log(noticias.length)
    
    //console.log(findIndex)
    if(findIndex === -1){
        res.status(404).send('No encuentra la noticia por el id')
    }else{
        noticias = noticias.filter(noticia => noticia.id !== id)
        fs.writeFileSync('noticias.json', JSON.stringify(noticias, null, 2));
        res.json(noticias)

    }
})


/*app.delete('/noticias/:indice', (req, res) => {

    const indice = req.params.indice;
  
    if (!noticias[indice]) {
  
      res.status(404).json({ mensaje: 'Noticia no encontrada' });
  
    } else {
  
      noticias.splice(indice, 1);
  
      fs.writeFileSync('noticias.json', JSON.stringify(noticias, null, 2));
  
      res.json({ mensaje: 'Noticia eliminada con éxito' });
  
    }
  
  });*/


app.get('/noticias/:id',(req,res)=>{
    const id = req.params.id;
    const noticia = noticias[id];
    if(!noticia){
        res.status(404).send('No encuentra la noticia por el id')
    }else{
        res.json(noticia)
    }
})

app.put("/noticias/:id",(req, res) => {

    const idNoticia = parseInt(req.params.id)
    const nuevoTitulo = req.body.titulo || ""
    const nuevaImagen = req.body.imagen || ""
    const nuevoEnlace = req.body.enlace || ""
    const nuevaDescripcion = req.body.descripcion || ""
    console.log(nuevoTitulo,nuevaDescripcion,nuevaImagen,nuevoEnlace)
    const news = leerDatos()
    //console.log(news)
    const findIndex = news.findIndex(ne => ne.id === idNoticia)
    //console.log(findIndex)
    
    if(findIndex === -1) {
    
    res.status(404).json({error: "noticia no encontrado"})
    
    } else {
        fs.writeFileSync('noticias.json', JSON.stringify(noticias, null, 2));
    
    noticias[findIndex] = {
    ...noticias[findIndex], 
    
    titulo: nuevoTitulo || noticias[findIndex].titulo, 
    imagen: nuevaImagen || noticias[findIndex].imagen,
    enlace: nuevoEnlace || noticias[findIndex].enlace,
    descripcion: nuevaDescripcion || noticias[findIndex].descripcion,
     
    }
    
    res.json(noticias)
    
    }
    
    })

    app.post('/noticias',async (req,res)=>{
        noticias = await leerDatos();
        
        const nuevaNoticia = {
            id: crypto.randomUUID(),
            titulo: "este el titulo de la noticia",
            imagen: "enlace a la imagen",
            enlace: "este es el enlace",
            descripcion: "esta es la descripcion"
        }
       
        
        noticias.push(nuevaNoticia)
        fs.writeFileSync('noticias.json', JSON.stringify(noticias, null, 2));
        res.status(201).json(noticias)
    })




app.listen(3000,()=>{
    console.log('Escuchando en http://localhost:3000')
})



// Leer datos desde el archivo JSON
function leerDatos() {
    try {
      const data = fs.readFileSync('noticias.json', 'utf-8');
       noticias = JSON.parse(data);
       noticias.forEach((noticia,index) => {
        noticias[index] = {id: id++,...noticia}
       });
       return noticias
    } catch (error) {
      console.error('Error al leer el archivo noticias.json:', error.message);
    }
  }
  
  // Guardar datos en el archivo JSON
  function guardarDatos() {
    fs.writeFileSync('noticias.json', JSON.stringify(noticias, null, 2));
  }