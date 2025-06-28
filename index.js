import  bootstrap  from './src/app.controller.js'
import path from "node:path"
import * as dotenv from "dotenv"

import  express  from 'express'
dotenv.config(
    {path:path.join('./src/config/.env.prod')}
)
const app = express()
const port = process.env.PORT || 5000;


bootstrap(app , express)

  
app.listen(port, () => console.log(`Example app listening on port ${port}!`))