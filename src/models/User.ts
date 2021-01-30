import {Schema,model} from 'mongoose'
import IUser from '../interfaces/User'

const userSchema:Schema=new Schema({
    username:{
        type:String,
        required:true
    },
    avatar:{
        type:String
    },
    country:{

    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:'new user'
    },
    phoneNumber:{
        type:String,
    },
    paymentInfo:{
        type:{
            name:{
                type:String
            },
            surname:{
                type:String
            },
            address:{
                type:String
            },
            zipCode:{
                type:String
            }
        }
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:'Review'
        }
    ]
},{timestamps:true})

export default model<IUser>('User',userSchema)