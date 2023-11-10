const COURT = require('../models/courtSchema')
const mongoose = require('mongoose')
const multer = require('multer');
const courtSchedules = require('../models/courtTimingSchema');
const court = require('../models/courtSchema');
const ObjectId = require('mongoose').Types.ObjectId



const registerNewCourt = (req, res) => {

    
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
           
            res.status(500).json({ message: "Failed to fetch court data" });
        });
};

const addCourtTimings = (req, res) => {
    try {
       

        let currentDate = new Date(req.body.date.startDate);
        const endDate = new Date(req.body.date.endDate);
        const timingObjectArray = [];

        while (currentDate <= endDate) {
            
            for (i = 0; i < req.body.schedules.length; i++) {

                timingObjectArray.push({
                    date: JSON.parse(JSON.stringify(currentDate)), // Change 'data' to 'date'
                    slot: {
                        name: req.body.schedules[i].name,
                        id: req.body.schedules[i].id
                    },
                    cost: req.body.cost,
                    courtId: req.body.courtId
                });
            }

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

const getLatestUpdateDate = (req, res) => {
    try {
        courtSchedules.find({ courtId: req.query.courtId }).sort({ date: 1 }).limit(1).select('date').then((resp) => {

          
            let latestDate = new Date(resp[0]?.date)
            res.status(200).json({ minDate: latestDate })
        })
    } catch (error) {
        res.status(500).json(error)
    }
}


const getAllCourtData = (req, res) => {
    COURT.find().then((resp) => {
        res.status(200).json({ court: resp })
    })
        .catch((err) => {
            res.status(400).json({ message: "something wrong" })
        })
}

const getslotData = (req, res) => {
    try {
       
       
        courtSchedules.aggregate([
            {
                $match: {
                    courtId: new ObjectId(req.query.courtId),
                    date: new Date(req.query.date.split("T")[0]),
                    "slot.id": { $gt:parseInt(req.query.currentHour) }
                    // "slot.id": { $gt:parseInt(-1) }
                }
            },
            {
                $lookup: {
                    from: "courts",
                    localField: 'courtId',
                    foreignField: '_id',
                    as: "courts"
                }
            },
            {
                $project: {
                    _id:1,
                    date:1,
                    slot:1,
                    cost:1,
                    bookedBY:1,
                    courts:{$arrayElemAt:['$courts',0]}
                }
            }
        
        ])
        .then((resp)=>{
            
            res.status(200).json(resp)
        })
    .catch(err => {
       
    })
        } catch (error) {

}
    }



module.exports = { registerNewCourt, getMyCourtData, getSingleCourtData, addCourtTimings, getLatestUpdateDate, getAllCourtData, getslotData }