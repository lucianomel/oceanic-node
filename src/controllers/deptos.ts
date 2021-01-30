import {Request,Response,NextFunction} from 'express'
import { FilterQuery} from 'mongoose'
import ISearchQuery from '../interfaces/SearchDeptoQuery'
import Depto from '../models/Depto'
import * as searchHelper from '../helpers/search'
import {Types} from 'mongoose'
import moment, { Moment } from 'moment'

export const getDeptos=async (req:Request,res:Response,next:NextFunction)=>{
    let totalItems:Number
    const page=+req.query.page! ||1
    const ITEMS_PER_PAGE=+req.query.itemsPerPage!
    Depto.find().countDocuments()
    .then(numProducts=>{
      totalItems=numProducts
      return Depto.find().select('title subtitle introDescription rating address price super images')
    //   .sort({createdAt: -1})
      .skip((page-1)*ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE)
    })
    .then(deptos=>{
        return res.json({deptos:deptos,totalDeptos:totalItems})
    })
}
export const createDepto=(req:Request,res:Response,next:NextFunction)=>{
    const newDepto=new Depto(req.body)
    newDepto.save()
    .then(result=>{
        return res.json({message:'Depto created',depto:result})
    })
    .catch(err=>{
        console.log(err)
    })
}

export const searchDeptos=(req:Request,res:Response,next:NextFunction)=>{
    // Extracting body and query params
    const data=req.body
    const minPrice=data.priceRange.min
    const maxPrice=data.priceRange.max
    const page=+req.query.page! ||1
    const ITEMS_PER_PAGE=+req.query.itemsPerPage!
    const dates=data.dates

    // Landing query params
    let dateQuery:any={}
    let additionalLandingQuery={}
    console.log('landing search',data.landingSearch)
    if(data.landingSearch){
        const inputStartDate=new Date(data.landingSearch.startDate)
        const inputEndDate=new Date(data.landingSearch.endDate)
        const inputGuests=data.landingSearch.guests
        const inputLocation=data.landingSearch.location
        dateQuery=searchHelper.setDateQuery(inputStartDate,inputEndDate)
        additionalLandingQuery={
            guests:+inputGuests,
            location:inputLocation
        }
    }

    // Date params
    if(dates.startDate&&dates.endDate){
        const inputStartDate= new Date(dates.startDate)
        const inputEndDate=new Date(dates.endDate)
        dateQuery=searchHelper.setDateQuery(inputStartDate,inputEndDate)
    }

    // console.log(data)
    let servicesQueryArr:String[]=[]
    searchHelper.fillServicesIntoQuery(servicesQueryArr,data)
    let searchQuery:FilterQuery<ISearchQuery>=searchHelper.createSearchQuery(data,servicesQueryArr)
    // console.log(searchQuery)

    // Sorting config
    const sortingOrder=searchHelper.getSortingOrder(data) //New arrivals,price,rating
    // console.log(sortingQuery)

    let nrDeptosFound:Number=0
    Depto
        .find(searchQuery)
        .find(dateQuery).find(additionalLandingQuery)
        .select('title subtitle introDescription rating address price super images')
        .where('price').gte(minPrice).lt(maxPrice)
        .countDocuments()
    .then(nrDeptos=>{
        nrDeptosFound=nrDeptos
        return Depto
        .find(searchQuery)
        .where(dateQuery).find(additionalLandingQuery)
        .select('title subtitle introDescription rating address price super images')
        .where('price').gte(minPrice).lt(maxPrice)
        .sort({[data.sorting[0]]:sortingOrder,_id:1}) //Stable sort
        .skip((page-1)*ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE)
    })
    .then(deptos=>{
        console.log(deptos)
        return res.json({deptos:deptos,totalSearchedDeptos:nrDeptosFound})
    })
    .catch(err=>{
        console.log(err)
    })
}

export const getDepto=async(req:Request,res:Response,next:NextFunction)=>{
    const deptoId=req.params.deptoId
    // console.log(deptoId)
    const fetchedDeptoAndReview:any= await Depto.aggregate([
        {
            $match:{_id:Types.ObjectId(deptoId)}
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
        { 
            $unwind:{
                path: "$reviews",
                preserveNullAndEmptyArrays:true
            }
        },
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
    // .populate({path:'reservations',populate:'user'})
    // console.log(fetchedDepto)
    let deptoAndReviews=fetchedDeptoAndReview[0]
    console.log(deptoAndReviews)
    return res.json(
        {
            message:"Depto fetched succesfully",
            deptoAndReviews
        }
    )
}

export const deleteDepto=(req:Request,res:Response,next:NextFunction)=>{
    return res.json('deleteDepto')
}
export const updateDepto=(req:Request,res:Response,next:NextFunction)=>{
    return res.json('updateDepto')
}

    // const newDepto=new Depto({
    //     title:'Cabrero',
    //     subtitle:'Un lugar unico para vacacionar',
    //     introDescription:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec blandit id mi a maximus. Nam dictum imperdiet tellus, ut vestibulum erat semper eu. Duis malesuada erat sed <strong >ante tincidunt facilisis. Pellentesque augue nulla, pellentesque eget tortor nec, venenatis elementum est. Etiam tincidu',
    //     fullDescription:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec blandit id mi a maximus. Nam dictum imperdiet tellus, ut vestibulum erat semper eu. Duis malesuada erat sed <strong >ante tincidunt facilisis. Pellentesque augue nulla, pellentesque eget tortor nec, venenatis elementum est. Etiam tincidunt metus quis tincidunt sodales. Interdum et malesuada fames ac ante ipsum primis in faucibus.</strong> Ut quis ligula consequat, blandit nunc nec, vehicula ante. Etiam urna dui, sagittis ac bibendum at, condimentum eu ligula. Sed varius egestas libero, ut sodales justo',
    //     amenities:['Wifi','Aire acondicionado','Cocina','estacionamiento'],
    //     super:false,
    //     ambientes:['3 huespedes','2 dormitorio','2 camas','1 baño'],
    //     address:'Avenída Santandér # 42-70, Cartagena 12345, Colombia',
    //     images:['/cabrero_1.jpg','/cabrero_2.jpg','/cabrero_3.jpg'],
    //     price:500,
    //     reviews:[
    //         {
    //             author:'Pepe pepe',
    //             rating:3.5,
    //             comment:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec blandit id mi a maximus. Nam dictum imperdiet tellus, ut vestibulum erat semper eu. Duis malesuada erat sed <strong >ante tincidunt facilisis. Pellentesque augue nulla, pellentesque eget tortor nec, venenatis elementum est. Etiam tincidunt metus quis tincidunt sodales. Interdum et malesuada fames ac ante ipsum primis in faucibus.</strong> Ut quis ligula consequat, blandit nunc nec, vehicula ante. Etiam urna dui, sagittis ac bibendum at, condimentum eu ligula. Sed varius egestas libero, ut sodales justo'
    //         },
    //         {
    //             author:'Pepe pepe 2',
    //             rating:3,
    //             comment:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec blandit id mi a maximus. Nam dictum imperdiet tellus, ut vestibulum erat semper eu. Duis malesuada erat sed <strong >ante tincidunt facilisis. Pellentesque augue nulla, pellentesque eget tortor nec, venenatis elementum est. Etiam tincidunt metus quis tincidunt sodales. Interdum et malesuada fames ac ante ipsum primis in faucibus.</strong> Ut quis ligula consequat, blandit nunc nec, vehicula ante. Etiam urna dui, sagittis ac bibendum at, condimentum eu ligula. Sed varius egestas libero, ut sodales justo'
    //         }
    //     ],
    //     creator:new User({}),
    //     rating:3
    // })