import express from 'express'

import mainRoutes from './routes/main'

const app=express()

app.use('/',mainRoutes) 

app.listen(8080)