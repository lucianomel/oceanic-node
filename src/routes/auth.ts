import {Router} from 'express'
import * as authControllers from '../controllers/auth'
import {body} from 'express-validator'
import User from '../models/User'

const router=Router()

router.post('/login',[
    body('email')
    .normalizeEmail()
    .isEmail()
    .withMessage('Please enter a valid email'),
    body('password')
    .trim()
    .isLength({min:5})
    .withMessage('Password too short')
],authControllers.login)

router.post('/signup',[
    body('email')
    .normalizeEmail()
    .isEmail()
    .withMessage('Please enter a valid email')
    .custom((value,{req})=>{
        return User.findOne({email:value})
        .then(userDoc=>{
            if(userDoc){
                return Promise.reject('Email address already exists')
            }
        })
    }),
    body('password')
    .trim()
    .isLength({min:5})
    .withMessage('Password too short')
],
authControllers.signup)

export default router