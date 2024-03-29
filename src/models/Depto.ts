import {Schema,model} from 'mongoose'
import IDepto from '../interfaces/Depto'

const deptoSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    avatar:{
        type:String
    },
    category:{
        type:String
    },
    subtitle:{
        type:String,
        required:true
    },
    introDescription:{
        type:String,
        required:true
    },
    fullDescription:{
        type:String,
        required:true
    },
    amenities:{
        type:[String],
        required:true
    },
    super:{
        type:Boolean,
        required:false,
        default:false
    },
    rooms:{
        type:[String],
        required:true
    },
    address:{
        type:String,
        required:true
    },
    images:{
        type:[{
            path:{
                type:String,
                required:true
            },
            description:{
                type:String
            }
        }],
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    reviews:{
        type:[{
            type:Schema.Types.ObjectId,
            ref:'Review'
        }]
    },  
    creator:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    rating:{
        type:Number,
        required:false
    },
    location:{
        type:String,
        required:true
    },
    dorms:{
        type:Number,
        required:true
    },
    guests:{
        type:Number,
        required:true
    },
    bathrooms:{
        type:Number,
        required:true
    },
    reservations:{
        type:[{
            type:Schema.Types.ObjectId,
            ref:'Reservation'
        }]
    },
    reservationDates:{
        type:[{
            startDate:Date,
            endDate:Date
        }],
        default:[]
    },
    ratingParams:{
        cleaning:{
            type:Number
        },
        location:{
            type:Number
        },
        priceQuality:{
            type:Number
        },
        wifi:{
            type:Number
        },
        services:{
            type:Number
        },
        confort:{
            type:Number
        }
    },
    policies:{
        checkIn:{
            type:String
        },
        checkOut:{
            type:String
        },
        cancelation:{
            type:String
        },
        depositDamages:{
            type:Number
        },
        kids:{
            allowed:{
                type:Boolean
            },
            tariff:{
                type:Number
            }
        },
        pets:{
            allowed:{
                type:Boolean
            },
            tariff:{
                type:Number
            }
        },
        paymentAllowed:{
            type:String
        }
    },
    FAQ:{
        type:[
            {
                question:{
                    type:String
                },
                answear:{
                    type:String
                }
            }
        ]
    }
},{timestamps:true})

export default model('Depto',deptoSchema)
// module.exports=model('Depto',deptoSchema)
