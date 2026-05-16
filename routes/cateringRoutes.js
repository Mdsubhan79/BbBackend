const express = require("express");
const router = express.Router();

const CateringService = require("../models/CateringService");
const CateringBooking = require("../models/CateringBooking");



/* =========================================
   GET ALL CATERING SERVICES
========================================= */

router.get("/services", async (req, res) => {

    try {

        const services = await CateringService.find({
            active: true
        });

        res.json({
            success: true,
            services
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

});



/* =========================================
   ADMIN ADD SERVICE
========================================= */

router.post("/admin/add-service", async (req, res) => {

    try {

        const newService = new CateringService(req.body);

        await newService.save();

        res.json({
            success: true,
            message: "Service Added",
            data: newService
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

});



/* =========================================
   ADMIN UPDATE SERVICE
========================================= */

router.put("/admin/update-service/:id", async (req, res) => {

    try {

        const updated = await CateringService.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json({
            success: true,
            message: "Updated Successfully",
            data: updated
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

});



/* =========================================
   DELETE SERVICE
========================================= */

router.delete("/admin/delete-service/:id", async (req, res) => {

    try {

        await CateringService.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Deleted Successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

});



/* =========================================
   CREATE BOOKING
========================================= */

router.post("/book", async (req, res) => {

    try {

        const booking = new CateringBooking(req.body);

        await booking.save();

        res.json({
            success: true,
            message: "Booking Created",
            booking
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

});



/* =========================================
   CHECK DATE AVAILABILITY
========================================= */

router.post("/check-date", async (req, res) => {

    try {

        const { date } = req.body;

        const booking = await CateringBooking.findOne({
            date
        });

        if (booking) {

            return res.json({
                available: false
            });

        }

        res.json({
            available: true
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

});



/* =========================================
   ADMIN ALL BOOKINGS
========================================= */

router.get("/admin/bookings", async (req, res) => {

    try {

        const bookings = await CateringBooking.find()
        .sort({ createdAt: -1 });

        res.json({
            success: true,
            bookings
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

});



/* =========================================
   UPDATE BOOKING STATUS
========================================= */

router.put("/admin/update-booking/:id", async (req, res) => {

    try {

        const booking = await CateringBooking.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json({
            success: true,
            booking
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

});

module.exports = router;