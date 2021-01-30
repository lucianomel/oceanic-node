import {Document, ObjectId} from 'mongoose'

export default interface IDepto extends Document{
    title:string;
    subtitle:string;
    introDescription:string;
    fullDescription:string;
    amenities:string[];
    super:boolean;
    rooms:string[];
    address:string;
    images:object[];
    price:number;
    reviews:Array<ObjectId>;
    creator:ObjectId;
    rating:Number;
    location:string;
    dorms:number;
    guests:number;
    bathrooms:number;
    reservations:Array<ObjectId>;
    reservationDates:Array<Object>;
}