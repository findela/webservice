import express from "express";
import db from "../db/database";
import Locator from "../model/locator";

const router = express.Router();
const _ = require("lodash");

//Adding new locator
router.post("/add", (req, res, next) => {
    //read locator information from request
    let locator = new Locator(
        req.body.locationName,
        JSON.stringify(req.body.geolocation),
        req.body.pattern,
        req.body.width,
        req.body.height,
        req.body.depth,
        req.body.measureIn,
        req.body.userId,
        req.body.status
    );
    db.query(locator.getAddLocatorSQL(), (err, data)=> {
        if(err) {
            res.status(500).json({
                message: "Shhh! Internal server error",
                status: 500,
                data: err
            });
        }
        else if(!req.body.userId) {
            res.status(400).json({
                message: "Ohhh! User id not found or invalid",
                status: 400
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

//Fetching specific locator details (userId with null optional)
router.post("/details", (req, res, next) => {
    let locator = new Locator(
        req.body.locationId
    );
    if(!req.body.locationId || req.body.locationId === "") {
        res.status(400).json({
            message: "Ohhh! Location id not found or invalid",
            status: 400,
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
                if(data[0]) {
                    res.status(200).json({
                        message: "Bahh! Location details fetched successfully!",
                        data: {
                            locationDetails: data[0]
                        }
                    });
                }
                else {
                    res.status(200).json({
                        message: "No location entry found!",
                        code: 200
                    });
                }

            }
        });
    }
});


//Fetching locator list with details (userId with null optional)
router.post("/list", (req, res, next) => {
    //read locator information from request
    let locator = new Locator(
        req.body.userId,
        req.body.latitude,
        req.body.longitude
    );

    if(req.body.latitude && req.body.longitude) {
        db.query(locator.fetchListLocatorSQL(req.body.userId), (err, data)=> {
            if(err) {
                res.status(500).json({
                    message: "Shhh! Internal server error",
                    status: 500,
                    data: err
                });
            }
            else {
                let nearestLocationArray = [];
                const minRadius = 20.00;
                data.forEach(function(item) {
                    item.geolocation = JSON.parse(item.geolocation);
                    item.distanceInKm = parseFloat(distance(req.body.latitude,req.body.longitude,item.geolocation.lat,item.geolocation.lng,"K").toFixed(2));
                    if(item.distanceInKm <= minRadius) {
                        nearestLocationArray.push(item);
                    }
                });
                if(nearestLocationArray.length) {
                    res.status(200).json({
                        message: "Ummm! Location fetched successfully!",
                        data: {
                            nearestLocations : _.sortBy(nearestLocationArray,'distanceInKm')
                        }
                    });
                }
                else {
                    res.status(200).json({
                        message: "No data found!",
                        code: 200
                    });
                }
            }
        });
    }
    else {
        res.status(200).json({
            message: "Valid parameter missing",
            status: 200,
        });
    }

});


//haverson algorithm
function distance(lat1, lon1, lat2, lon2, unit) {
    let radlat1 = Math.PI * lat1/180;
    let radlat2 = Math.PI * lat2/180;
    let theta = lon1-lon2;
    let radtheta = Math.PI * theta/180;
    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) { dist = 1; }
    dist = Math.acos(dist);
    dist = dist * 180/Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit === "K") { dist = dist * 1.609344; }
    if (unit === "N") { dist = dist * 0.8684; }
    return dist;
}

module.exports = router;
