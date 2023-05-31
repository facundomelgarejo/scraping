//const axios = require('axios');
import axios from 'axios'

//const cheerio = require('cheerio');
import cheerio from 'cheerio'


//const express = require('express')
import express from 'express'
const app = express();
app.use(express.json())


//const cors = require("cors");
import cors from 'cors'
app.use(cors());

// ---------------------------------------------------------------------------------- OBTENER VALOR UVA / UVI DEL BCRA -----------------------------------------------------

var uva;
var uvi;
//const { getElementById } = require('domutils');
let b = true;
function getValorUvaUvi(){



axios.get('https://www.bcra.gob.ar/PublicacionesEstadisticas/Principales_variables.asp')
  .then(response => {
    
    const html = response.data;
    const $ = cheerio.load(html);
    
   
    $('tr').each((index, element) => {    // Encuentra todas las filas (tr) en el HTML y las itera

      // ----------------- Obtener valor del UVA ----------------------
      // Busca la celda (td) que contiene el valor que buscas
      const $tduva = $(element).find('td').filter((i, el) => /.*(UVA).*/i.test($(el).text()));
      // Si la celda fue encontrada, imprime el valor de la celda y la fila completa

      let filaCompletauva = $(element).html()
      const columnasuva =  filaCompletauva.split('</td>')
      const tercerColumnauva = columnasuva[2]
      
      let elementotduva;
      if ($tduva.length > 0) {
        //console.log(`Valor encontrado: ${$td.text()}`);
        if (b){ //Con este if ignoro el primer elemento, ya que es un UVA que no me interesa.
          b = false
        } else {
          elementotduva = tercerColumnauva.split('>')
          uva = Object.values(elementotduva)[1]
          
        }
       
       
        
      }
      // ----------------- Fin Obtener valor del UVA ----------------------


      // ----------------- Obtener valor del UVI ----------------------
      // Busca la celda (td) que contiene el valor que buscas
      const $tduvi = $(element).find('td').filter((i, el) => /.*(UVI).*/i.test($(el).text()));
      // Si la celda fue encontrada, imprime el valor de la celda y la fila completa

      let filaCompletauvi = $(element).html()
      const columnasuvi =  filaCompletauvi.split('</td>')
      const tercerColumnauvi = columnasuvi[2]
      
   
      if ($tduvi.length > 0) {
        //console.log(`Valor encontrado: ${$td.text()}`);
        const elementotduvi = tercerColumnauvi.split('>')
        uvi = Object.values(elementotduvi)[1]
        
      }
      // ----------------- Fin Obtener valor del UVI ----------------------

    
    
    })

  })
  .catch(error => {
    console.log(error);
  });

}

getValorUvaUvi();

  // --------------------------------------------------------------- OBTENER VALOR DEL DOLAR MAYORISTA Y MINORISTA DEL BNA -------------------------------------------
  var band = true;
  var valorDolarMinoristaCompraBNA;
  var valorDolarMinoristaVentaBNA;
  var valorDolarMayoristaCompraBNA;
  var valorDolarMayoristaVentaBNA;
axios.get('https://www.bna.com.ar/Personas')
.then(response => {
  
  const html = response.data;
  const $ = cheerio.load(html);

  $('tr').each((index, element) => {
    const $dolarventamayorista = $(element).find('td').filter((i, el) => /.*(Dolar U.S.A).*/i.test($(el).text())); // 1) busco la fila td que contenga la palabra Dolar USA
    
    if ($dolarventamayorista.length > 0) { //Encontre un td con Dolar USA
      if (band){ //La primera vez, agarra el dolar minorista (es el que esta primero)

        let filaCompletaDolarMinorista = $(element).html() //Como es el primer, agarro toda la fila
        const columnasDolarMinorista =  filaCompletaDolarMinorista.split('</td>') //separo por columnas

        let segundaColumnaDolarMinorista = Object.values(columnasDolarMinorista)[1] //posicion 1 = compra
        valorDolarMinoristaCompraBNA = segundaColumnaDolarMinorista.split('>')[1] //Aca ya obtengo el valor, despues le saco 2 decimales, y le cambio punto por coma
        valorDolarMinoristaCompraBNA = parseFloat(valorDolarMinoristaCompraBNA).toFixed(2)
        valorDolarMinoristaCompraBNA = valorDolarMinoristaCompraBNA.replace(".", ",")
       

        let tercerColumnaDolarMinorista = Object.values(columnasDolarMinorista)[2] //posicion 2 = venta
        valorDolarMinoristaVentaBNA = tercerColumnaDolarMinorista.split('>')[1] //Aca ya obtengo el valor, despues le saco 2 decimales, y le cambio punto por coma
        valorDolarMinoristaVentaBNA = parseFloat(valorDolarMinoristaVentaBNA).toFixed(2)
        valorDolarMinoristaVentaBNA = valorDolarMinoristaVentaBNA.replace(".", ",")
        
        band = false
      } else {//La segunda vez, agarra el dolar mayorista
        
        let filaCompletaDolarMayorista = $(element).html()
        const columnasDolarMayorista =  filaCompletaDolarMayorista.split('</td>')
        let segundaColumnaDolarMayorista = Object.values(columnasDolarMayorista)[1] //posicion 1 = compra
        valorDolarMayoristaCompraBNA = segundaColumnaDolarMayorista.split('>')[1] //Aca ya obtengo el valor, despues le saco 2 decimales, y le cambio punto por coma
        valorDolarMayoristaCompraBNA = parseFloat(valorDolarMayoristaCompraBNA).toFixed(2)
        valorDolarMayoristaCompraBNA = valorDolarMayoristaCompraBNA.replace(".", ",")

        let tercerColumnaDolarMayorista = Object.values(columnasDolarMayorista)[2] //posicion 2 = venta
        valorDolarMayoristaVentaBNA = tercerColumnaDolarMayorista.split('>')[1] //Aca ya obtengo el valor, despues le saco 2 decimales, y le cambio punto por coma
        valorDolarMayoristaVentaBNA = parseFloat(valorDolarMayoristaVentaBNA).toFixed(2)
        valorDolarMayoristaVentaBNA = valorDolarMayoristaVentaBNA.replace(".", ",")
        
      }
    }
  })
  
})
.catch(error => {
  console.log(error);
});




// --------------------------------------------------------------- OBTENER VALOR DEL DOLAR EN SANTANDER -------------------------------------------
var cont = 0;
var valorDolarVentaSantander;
var valorDolarCompraSantander;
axios.get('https://www.infodolar.com/cotizacion-dolar-entidad-banco-santander-rio.aspx')
.then(response => { 

  const html = response.data;
  const $ = cheerio.load(html);

  $('tr').each((index, element) => {
    const $dolarventasantander = $(element).find('td').filter((i, el) => /.*(Banco Santander Río).*/i.test($(el).text()));
    cont ++
    if($dolarventasantander.length > 0 ){
      /* saco los valores de compra */
      let columnaCompra = $(element).html().split('<td')[2] //Agarro toda la segunda columna (de compra)
      valorDolarCompraSantander =  (columnaCompra).split(">")[0]
      valorDolarCompraSantander = Object.values(valorDolarCompraSantander.split('$')[1])
      valorDolarCompraSantander = valorDolarCompraSantander[1] +  valorDolarCompraSantander[2] + valorDolarCompraSantander[3] + valorDolarCompraSantander[4] +  valorDolarCompraSantander[5] + valorDolarCompraSantander[6] 

      /* saco los valores de venta */
      let columnaVenta = $(element).html().split('<td')[3] //Agarro toda la tercer columna (de venta)
      valorDolarVentaSantander =  (columnaVenta).split(">")[1]
      valorDolarVentaSantander = Object.values(valorDolarVentaSantander.split('$')[1])
      valorDolarVentaSantander = valorDolarVentaSantander[1] +  valorDolarVentaSantander[2] + valorDolarVentaSantander[3] + valorDolarVentaSantander[4] +  valorDolarVentaSantander[5] + valorDolarVentaSantander[6] 


    }
  })

})
.catch(error => {
  console.log(error);
});




//settings 

app.set('json spaces', 2)

//rutes 

app.get('/api/uva-uvi', (req, res) => {
    getValorUvaUvi();
    res.json({"UVA": uva, "UVI": uvi})
})

app.get('/api/dolar', (req, res) => {
  res.json({
    "santander": {
                  "compra": valorDolarCompraSantander, 
                  "venta": valorDolarVentaSantander
                  },
    "banco-nacion":{
                  "minorista":{ 
                              "compra": valorDolarMinoristaCompraBNA,
                              "venta": valorDolarMinoristaVentaBNA
                              },
                  "mayorista": {
                              "compra": valorDolarMayoristaCompraBNA,
                              "venta": valorDolarMayoristaVentaBNA
                              }
    }  
  })
})


export default app;





/*
  node 
  axios //para requets
  cheerio //para trabajar con el DOM
  npm install jsdom //para madnar al front(?)
  
  */