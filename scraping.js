const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('node:fs')
const url = 'https://elpais.com/ultimas-noticias/'



const noticias =[];

async function scrapingNoticias() {
try{
    const response = await axios.get(url);
    if(response.status === 200){
        const html = await response.data;
        const $ = cheerio.load(html)
    
        
        $('.b-st_a').find('article').each((index, element)=>{
            const noticia = {
                titulo: $(element).find('h2').text(),
                imagen: $(element).find('img').attr('src'),
                descripcion: $(element).find('p').text(),
                enlace: $(element).find('a').attr('href')
            };
            noticias.push(noticia)
                
                
        })
        fs.writeFileSync('noticias.json', JSON.stringify(noticias, null, 2));


    }

}catch(err){
    console.log("error en el catch",err)

}
}
scrapingNoticias()
