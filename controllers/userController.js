const COURT = require('../models/courtSchema')

const multer = require('multer');
const courtSchedules = require('../models/courtTimingSchema');
const court = require('../models/courtSchema');
const registerNewCourt = (req, res) => {

    // console.log(req.query);
    const fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "public/venderCourts");
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + "-" + file.originalname);
        }
    });

    const upload = multer({ storage: fileStorage }).single("image");

    upload(req, res, (err) => {

        // console.log(req.file.filename,req.filename);
        COURT({
            name: req.query.name,
            location: req.query.location,
            userId: req.userId,
            cost: req.query.cost,
            about: req.query.about,
            image: req?.file?.filename || 'defaultimage.jpg'
        }).save()
            .then(response => {
                res.status(200).json({ message: "court registration successfull" })
            })
            .catch(res => {
                // console.log(res);
                res.status(403).json({ message: "court registration failed" })
            })
    })
}

const getMyCourtData = (req, res) => {
    // Extract userId from the request or from wherever it should come from
    const userId = req.userId; // Make sure this is where userId comes from

    if (!userId) {
        return res.status(400).json({ message: "Missing userId" });
    }

    COURT.find({ userId: userId })
        .then(response => {
            res.status(200).json({ data: response });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ message: "Failed to fetch court data" });
        });
};



const getSingleCourtData = (req, res) => {
    // Extract userId from the request or wherever it should come from
    const userId = req.userId; // Make sure this is where userId comes from

    if (!userId) {
        return res.status(400).json({ message: "Missing userId" });
    }

    COURT.findOne({ _id: req.query.courtId })
        .then(response => {
            if (response) {
                res.status(200).json({ data: response });
            } else {
                res.status(404).json({ message: "Court not found" });
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ message: "Failed to fetch court data" });
        });
};

const addCourtTimings = (req, res) => {
   try {
     console.log(req.body);
 
     let currentDate = new Date(req.body.date.startDate);
     const endDate = new Date(req.body.date.endDate);
     const timingObjectArray = [];
 
     while (currentDate <= endDate) {
         req.body.schedules.forEach((obj) => { // Use 'forEach' instead of 'foreach'
             timingObjectArray.push({
                 date: currentDate, // Change 'data' to 'date'
                 slot: {
                     name: obj.name,
                     id: obj.id
                 },
                 cost: req.body.cost,
                 courtId: req.body.courtId
             });
         });
 
         currentDate.setDate(currentDate.getDate() + 1);
     }
 
     courtSchedules.insertMany(timingObjectArray)
         .then((resp) => {
             res.status(200).json({ message: "Schedule added successfully" });
         })
   } catch (error) {
    res.status(500).json(error)
   }

}

const getLatestUpdateDate=(req,res)=>{
   try {
     courtSchedules.find({courtId:req.query.courtId}).sort({date:1}).limit(1).select('date').then((resp)=>{
 
         console.log("hello");
         let latestDate=new Date(resp[0]?.date)
         res.status(200).json({minDate:latestDate})
     })
   } catch (error) {
    res.status(500).json(error)
   }
}


const getAllCourtData=(req,res)=>{
    COURT.find().then((resp)=>{
        res.status(200).json({court:resp})
    })
    .catch((err)=>{
        res.status(400).json({message:"something wrong"})
    })
}

const getslotData=(req,res)=>{
   courtSchedules.aggregate([
{
    $match:{

    courtId:req.query.courtId,
    date
    }
}


   ])
}



module.exports = { registerNewCourt,getMyCourtData,getSingleCourtData,addCourtTimings,getLatestUpdateDate,getAllCourtData,getslotData}