import User from '../models/User'
import {ValidationError, validationResult} from 'express-validator'
import {NextFunction, Request,Response} from 'express'

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Error } from 'mongoose'
import IUser from '../interfaces/User'
import ExtendedError from '../common/http-exception'

export const signup=(req:Request,res:Response,next:NextFunction)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        const error=new ExtendedError('validation failed',422)
        error.validationErrors=errors.array()
        throw error
    }
    const email=req.body.email
    const name=req.body.name
    const password=req.body.password
    
    bcrypt.hash(password,12)
    .then((hashedPassword:string) =>{
        const user=new User({
            name:name,
            email:email,
            password:hashedPassword
        })
        return user.save()    
    })
    .then(result=>{
        res.status(201).json({message:'User created',userId:result._id})
    })
    .catch((err:Error)=>{
        next(err)
    })
}

export const login=(req:Request,res:Response,next:NextFunction)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        const error=new ExtendedError('validation failed',422,errors.array())
        throw error
    }
    const email=req.body.email
    const password=req.body.password
    let loadedUser:IUser
    User.findOne({email:email})
    .then(user=>{
        if(!user){
            const error=new ExtendedError('A user with this email could not be found',401)
            throw error
        }
        loadedUser=user
        return bcrypt.compare(password,user.password)
    })
    .then(doMatch=>{
        if(!doMatch){
            const error=new ExtendedError('Password incorrect',401)
            throw error
        }
        const token=jwt.sign(
            {
            email:loadedUser.email,
            userId:loadedUser._id.toString()
            },
            'theSecretKeyforenvvarshere',{expiresIn:'3h'})
        return res.status(200).json({token:token,userId:loadedUser._id.toString()})
    })
    .catch((err:ExtendedError)=>{
        if(!err.statusCode){
            err.statusCode=500
        }
        next(err)
    })
}