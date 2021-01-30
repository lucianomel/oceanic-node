import {Document, ObjectId} from 'mongoose'

export default interface IUser extends Document{
    _id:ObjectId,
    name:string,
    email:string,
    password:string,
    status:string,
    reviews:ObjectId
}