import { Document } from "mongoose";

export default interface ISearchQuery extends Document {
    amenities:String[],
    location:String,
    guests?:Number,
    dorms?:Number,
    bathrooms?:Number
}