const Razorpay = require("razorpay")
const crypto = require("crypto")
const nodemailer = require("nodemailer");
const courtSchedules = require('../models/courtTimingSchema')
const payments = async (req, res) => {


    try {

        const slotData = await courtSchedules.findOne({ _id: req.body.slotId })

        if (slotData.bookedBY) {
            res.status(500).json({ message: "already slot  booked" })
        }
        // const instance = new Razorpay({
        //     key_id: "rzp_test_gVafHjAPUQlbXF",
        //     key_secret: "WqgyahvHCtLQTRwN5LS4Ho7i",
        // });
        const instance = new Razorpay({
            key_id: process.env.key_id,
            key_secret: process.env.key_secret,
        });


        const options = {
            amount: slotData.cost * 100, // amount in smallest currency unit
            currency: "INR",
            receipt: slotData._id,
        };

        const order = await instance.orders.create(options);

        if (!order) return res.status(500).send("Some error occured");

        res.json(order);
    } catch (error) {
        res.status(500).send(error);
    }

}

const paymentsuccess = async (req, res) => {

    try {


        const {
            orderCreationId,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
            receipt
        } = req.body;


        const shasum = crypto.createHmac("sha256", "WqgyahvHCtLQTRwN5LS4Ho7i");

        shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

        const digest = shasum.digest("hex");


        if (digest !== razorpaySignature)
            return res.status(400).json({ msg: "Transaction not legit!" });
        await courtSchedules.updateOne({ _id: receipt }, { $set: { bookedBY: req.userId }, $push: { paymentOrders: { userId: req.userId, razorpayPaymentId, timeStamp: new Date() } } })

        initiateEmail(receipt, razorpayPaymentId)


        res.json({
            msg: "success",
            orderId: razorpayOrderId,
            paymentId: razorpayPaymentId,

        });
    } catch (error) {
        res.status(500).send(error);
    }
}

const initiateEmail = async (id, razorpayPaymentId) => {
    const slotData = await courtSchedules.findOne({ _id: id }).populate('bookedBY').populate('courtId')

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {

            user: 'bookmycourt7@gmail.com',
            pass: process.env.password
        }
    });

    const { date, slot, cost, bookedBY, courtId } = slotData

    const info = await transporter.sendMail({
        from: '"bookmycourt7@gmail.com',
        // to: bookedBY.email,
        to: "harikrishnan183hari@gmail.com",
        subject: " Booking Confirmed",
        text: "Thanks for Booking",
        html: `<b>Hello ${bookedBY.firstname + '' + bookedBY.lastname}</b>
        <p> your booking at  on ${new Date(date)} at ${slot.name} has been confirmed with payment id ${razorpayPaymentId}</p> 
        `,
    });

    console.log("Message sent: %s", info.messageId);

}




module.exports = { payments, paymentsuccess }