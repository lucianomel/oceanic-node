import jwt from 'jsonwebtoken'
import { NextFunction,Request,Response} from 'express'
import ExtendedError from '../common/http-exception'

declare global {
    namespace Express {
      interface Request {
        userId: string|boolean
      }
    }
}

export default (req:Request,res:Response,next:NextFunction)=>{
    const authHeader=req.get('Authorization')
    if(!authHeader){
        const error=new ExtendedError('Not authenticated',401)
        throw error
    }
    const token=authHeader.split(' ')[1]
    let decodedToken
    try{
        decodedToken=<any>jwt.verify(token,'theSecretKeyforenvvarshere')
    }catch(err){
        err.statusCode=500
        throw err
    }
    if(!decodedToken){
        const error=new ExtendedError('Not Authenticated.',401)
        throw error
    }
    req.userId=decodedToken.userId
    next()
}