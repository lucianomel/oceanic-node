import {Request,Response,NextFunction} from 'express'
import Depto from '../models/Depto';
import Review from '../models/Review';
import mongoose from 'mongoose'

// Call only if depto is available
export const createReview=async (req:Request,res:Response,next:NextFunction)=>{
    const reviewData=req.body
    const deptoId=reviewData.depto
    const newReview=new Review(reviewData)
    try{
        const review:any= await Review.create(newReview)
        const depto:any=await Depto.findById(deptoId)
        console.log(depto)
        depto.reviews=depto.reviews.concat(review._id)
        depto.save()

        return res.json({message:'Review created succesfully',review:review})
    }catch(err){
        console.log(err)
    }
}
export const getReviews=async (req:Request,res:Response,next:NextFunction)=>{
    const deptoId=req.params.deptoId
    
    try{
        const reviewsFetched:any=await Depto.aggregate([
            {
                $match:{_id:mongoose.Types.ObjectId(deptoId)}
            },
            {
                $lookup:{
                    from:"users",
                    localField:"creator",
                    foreignField:"_id",
                    as:"creator"
                }
            },
            {
                $lookup:{
                    from:"reviews",
                    localField:"reviews",
                    foreignField:"_id",
                    as:"reviews"
                }
            },
            { $unwind: "$reviews" },
            {
                $lookup:{
                    from:"users",
                    localField:"reviews.author",
                    foreignField:"_id",
                    as:"reviews.author"
                }
            },
            {
                $group:{
                    _id:"$_id",
                    reviews:{$push:"$reviews"},
                    depto:{$first:"$$ROOT"},  
                }
            },
            {
                $unset:"depto.reviews"
            }
        ])
        return res.json({message:'Review fetched succesfully',review:reviewsFetched})
    }catch(err){
        console.log(err)
    }
}