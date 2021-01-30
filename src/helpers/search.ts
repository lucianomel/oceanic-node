import { FilterQuery } from "mongoose"
import ISearchQuery from "../interfaces/SearchDeptoQuery"

export const fillServicesIntoQuery=(servicesQueryArr:String[],data:any)=>{
    const servicesData=data.services
    for (const property in servicesData){
        if(servicesData[property]){
            const parsedProperty=property.split('_').join(' ')
            servicesQueryArr.push(parsedProperty)
        }
    }
}

export const createSearchQuery=(data:any,servicesQueryArr:String[])=>{
    let searchQuery:FilterQuery<ISearchQuery>={
        amenities:{$all:servicesQueryArr}
    }
    if(data.guests){
        searchQuery.guests=data.guests
    }
    if(data.dorms){
        searchQuery.dorms=data.dorms
    }
    if(data.bathrooms){
        searchQuery.bathrooms=data.bathrooms
    }
    if(data.location&&data.location!=='Cualquiera'){
        searchQuery.location=data.location
    }
    return searchQuery
}

export const getSortingOrder=(data:any)=>{
    if(data.sorting[0]==='createdAt'){
        return -1 //New arrivals
    }
    if(data.sorting[0]==='price'){
        if(data.sorting[1]==='higher'){
            return -1
        }else if(data.sorting[1]==='lower'){
            return 1
        }
    }
    if(data.sorting[0]==='rating'){
        return -1
    }
}

export const setDateQuery=(inputStartDate:Date,inputEndDate:Date)=>{
    return {
        $and:[
            {
                "reservationDates":{
                    $not:{
                        $elemMatch:{
                            "endDate":{
                                $gte:inputStartDate
                            }, 
                            "startDate":{
                                $lte:inputStartDate
                            } 
                        } 
                    }
                } 
            },
            {
                "reservationDates":{
                    $not:{
                        $elemMatch:{
                            "endDate":{
                                $gte:inputEndDate
                            }, 
                            "startDate":{
                                $lte:inputEndDate
                            } 
                        } 
                    }
                } 
            },
            {
                "reservationDates":{
                    $not:{
                        $elemMatch:{
                            "endDate":{
                                $lte:inputEndDate
                            }, 
                            "startDate":{
                                $gte:inputStartDate
                            } 
                        } 
                    }
                } 
            }
        ]
    }
}