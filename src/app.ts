import express, { NextFunction, Response,Request } from 'express'
import mongoose from 'mongoose'

import mainRoutes from './routes/main'
import authRoutes from './routes/auth'

import {errorHandler} from './middleware/error-middleware'
import {notFoundHandler} from './middleware/notFound-middleware'

const app=express()
require('dotenv').config()
app.use(express.json())

// To avoid the CORS error - fetch
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*') // can lock down the domain that have access, for example can put codepen.io there. Star says every domain is allowed
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, PATCH, DELETE') //can allow GET, POST, PUT, PATCH, DELETE, ...
    res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization')
    next()
})

app.use('/',mainRoutes) 
app.use('/',authRoutes)

// Error middleware
app.use(errorHandler)
// 404 middleware
app.use(notFoundHandler)

mongoose.connect(process.env.MONGO_URI as string)
.then(result=>{
    app.listen(8080)
})
.catch(err=> console.log(err))