const mongoose = require('mongoose')

const PublishHouseSchema = new mongoose.Schema({
    publisher:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users',
        required:true
    },
    datePublished:{
    type:Date,
     default: null,
     required:true
    },
    houseOverview:{
        type:Object,
        default:{
            houseName:'',
            houseAddress:'',
            houseType:'',
            state:'',
            localGovtArea:''
        },
        required:true

    },
    aboutHouse:{
       type:Object,
       default:{
        description:''
       } ,
       required:true
    },
    houseFeatures:{
        type:Object,
        default:{
            totalNumberOfBedRooms:'',
            totalNumberOfToilets:'',
             houseFenced:false,
             runningWater:false,
             prepaidMeter:false,
             smartHomeFeatures:false,
             laundryRoom:false,
             airConditioning:false,
             parkingSpace:false,
             garbageDisposalService:false,
             adequateLigting:false,
             storageSpace:false,
             petFriendly:false,
             emergencyExits:false,
             secureWindowsAndDoors:false,
             securitySystems:false,
             backyardGardenOrBalcony:false,
             swimmingPoolGym:false,
             Gym:false,
             maintenanceSupport:false,
             safePlayAreaForChildren:false
    
        },
        required:true
    },
    mediaUpload:{
        type:Array,
        default:[],
        required:true
    },
    rentalPrice:{
        type:Object,
        default:{
            monthlyOrYearlyRent:'',
            securityDeposit:'',
            applicationFee:'',
            maintenanceFee:'',
            petFees:'',
            rentalTerm:'',
            cleaningServices:'',
            totalDue:''
        },
        required:true
    },
   



})

module.exports = mongoose.model('PublishHouse',PublishHouseSchema)