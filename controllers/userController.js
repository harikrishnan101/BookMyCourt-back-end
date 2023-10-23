const COURT = require('../models/courtSchema')

const multer = require('multer')
const registerNewCourt = (req, res) => {

    console.log(req.query);
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



module.exports = { registerNewCourt, getMyCourtData,getSingleCourtData }