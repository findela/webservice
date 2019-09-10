import express from "express";
import db from "../db/database";
import Locator from "../model/locator";

const router = express.Router();

router.post("/add", (req, res, next) => {

    //read product information from request
    let locator = new Locator(
        req.body.location_name,
        req.body.geolocation,
        req.body.like_count,
        req.body.pattern,
        req.body.width,
        req.body.height,
        req.body.depth,
        req.body.calculate_in,
        req.body.user_id,
        req.body.status
    );
    db.query(locator.getAddLocatorSQL(), (err, data)=> {
        res.status(200).json({
            message:"Location added.",
            data: data.insertId
        });
    });
});

module.exports = router;
