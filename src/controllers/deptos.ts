import {Request,Response,NextFunction} from 'express'

const ITEMS_PER_PAGE=5

export const getDeptos=(req:Request,res:Response,next:NextFunction)=>{
    const page=req.params.page
    return res.json('getDeptos!')
}

export const searchDeptos=(req:Request,res:Response,next:NextFunction)=>{
    // const searchData=req.body.searchData
    return res.json('searchDeptos')
}
export const createDepto=(req:Request,res:Response,next:NextFunction)=>{
    return res.json('createDepto')
}
export const deleteDepto=(req:Request,res:Response,next:NextFunction)=>{
    return res.json('deleteDepto')
}
export const updateDepto=(req:Request,res:Response,next:NextFunction)=>{
    return res.json('updateDepto')
}