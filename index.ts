import http from 'http'
import 'dotenv/config'
import {App} from "./src/app";


const PORT: number = Number( process.env.PORT )




const app: any = new App()




app.listen(PORT, () => {
    console.log( `Server running on port ${PORT}`)
})
