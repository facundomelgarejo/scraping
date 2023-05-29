import app from './app.js'

//const config = require('./config.js')
import {PORT} from './config.js'

//empezando el servidor
app.listen(PORT, () => {
    console.log('server on port', PORT)
})