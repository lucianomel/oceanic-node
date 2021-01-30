import {Request,Response,NextFunction} from 'express'
import Depto from '../models/Depto';
import Reservation from "../models/Reservation";


// Call only if depto is available
export const createReservation=async (req:Request,res:Response,next:NextFunction)=>{
    const data=req.body
    const newReservation=new Reservation(data)
    try{
        const reservation:any= await Reservation.create(newReservation)
        const depto:any=await Depto.findById(data.depto)
        // console.log(depto)
        depto.reservations=depto.reservations.concat(reservation._id)
        depto.reservationDates=depto.reservationDates.concat({
            startDate:reservation.startDate,
            endDate:reservation.endDate
        })  
        depto.save()

        return res.json({message:'Reservation created succesfully',reservation:reservation})
    }catch(err){
        console.log(err)
    }
}