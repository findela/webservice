import express from "express";
import db from "../db/database";
import Locator from "../model/locator";

const router = express.Router();

//Adding new locator
router.post("/add", (req, res, next) => {
    //read locator information from request
    let locator = new Locator(
        req.body.locationName,
        req.body.geolocation,
        req.body.likedCount,
        req.body.pattern,
        req.body.width,
        req.body.height,
        req.body.depth,
        req.body.calculatedBy,
        req.body.userId,
        req.body.status
    );
    db.query(locator.getAddLocatorSQL(), (err, data)=> {
        if(err) {
            res.status(500).json({
                message: "Shhh! Internal server error",
                status: 500
            });
        }
        else if(!req.body.userId) {
            res.status(401).json({
                message: "Ohhh! User id not found or invalid",
                status: 401
            });
        }
        else {
            let date = new Date();
            res.status(200).json({
                message: "Champo! Location added successfully!",
                data: {
                    locationDetails: {
                        locationId: data.insertId,
                        createdAt: date.toTimeString()
                    }
                }
            });
        }
    });
});

//Fetching locator list with details (userId with null optional)
router.post("/list", (req, res, next) => {
    //read locator information from request
    let locator = new Locator(
        req.body.userId
    );
    db.query(locator.fetchListLocatorSQL(req.body.userId), (err, data)=> {
        if(err) {
            res.status(500).json({
                message: "Shhh! Internal server error",
                status: 500,
                data: err
            });
        }
        else {
            res.status(200).json({
                message: "Ummm! Location fetched successfully!",
                data: {
                    locationDetails: data
                }
            });
        }
    });
});

//Fetching specific locator details (userId with null optional)
router.post("/list/details", (req, res, next) => {
    //read locator information from request
    let locator = new Locator(
        req.body.locationId
    );
    if(!req.body.locationId || req.body.locationId === "") {
        res.status(401).json({
            message: "Ohhh! Location id not found or invalid",
            status: 401,
        });
    }
    else {
        db.query(locator.fetchDetailLocatorSQL(req.body.locationId), (err, data) => {
            if (err) {
                res.status(500).json({
                    message: "Shhh! Internal server error",
                    data: err,
                    status: 500
                });
            }
            else {
                res.status(200).json({
                    message: "Bahhh! Location details fetched successfully!",
                    data: {
                        locationDetails: data[0]
                    }
                });
            }
        });
    }
});

module.exports = router;
