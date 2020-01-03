import express from "express";
import db from "../db/database";
import Locator from "../model/locator";

const router = express.Router();
const _ = require("lodash");

//Adding new locator
router.post("/add", (req, res) => {
    //read locator information from request
    let locator = new Locator(
        req.body.locationName,
        JSON.stringify(req.body.geolocation),
        req.body.pattern,
        (!req.body.height || false) ? null : req.body.height,
        req.body.width,
        req.body.depth,
        req.body.measureIn,
        req.body.userId,
        req.body.status
    );
    if(req.body.pattern === "CIRCLE" && !req.body.width || req.body.width === undefined) {
        req.body['width'] = null;
    }
    db.query(locator.getAddLocatorSQL(), (err, data)=> {
        if(err) {
            res.status(500).json({
                message: "Shh! Internal server error",
                status: 500,
                data: err
            });
        }
        else if(!req.body.userId) {
            res.status(400).json({
                message: "Ohh! User id not found or invalid",
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

//updating new locator
router.post("/update", (req, res) => {
    //read locator information from request
    let locator = new Locator(
        req.body.locationName,
        JSON.stringify(req.body.geolocation),
        req.body.pattern,
        (!req.body.height || false) ? null : req.body.height,
        req.body.width,
        req.body.depth,
        req.body.measureIn,
        req.body.userId,
        req.body.status,
        req.body.locationId
    );

    db.query(locator.getUpdateLocatorSQL(req.body.locationId), (err, data)=> {
        if(err) {
            res.status(500).json({
                message: "Shh! Internal server error",
                status: 500,
                data: err
            });
        }
        else if(!req.body.userId) {
            res.status(400).json({
                message: "Ohh! User id not found or invalid",
                status: 400
            });
        }
        else {
            let date = new Date();
            res.status(200).json({
                message: "Champo! Location updated successfully!",
                data: {
                    locationDetails: {
                        locationId: req.body.locationId,
                        createdAt: date.toTimeString()
                    }
                }
            });
        }
    });
});

//Fetching specific locator details (userId with null optional)
router.post("/details", (req, res) => {
    let locator = new Locator(
        req.body.locationId
    );
    if(!req.body.locationId || req.body.locationId === "") {
        res.status(400).json({
            message: "Ohhh! Location id invalid",
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
                    data[0].geolocation = JSON.parse(data[0].geolocation);
                    data[0].calculatedDetails = calculateArea(data[0].locationWidth,data[0].locationLength,data[0].locationDepth,data[0].measureIn);
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
                        status: 404
                    });
                }

            }
        });
    }
});


//Fetching locator list with details (userId with null optional)
router.post("/list", (req, res) => {
    //read locator information from request
    let locator = new Locator(
        req.body.userId,
        req.body.latitude,
        req.body.longitude,
        req.body.distanceInKm,
        req.body.locationPattern
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
                const maxRadius = 50.00;
                let calculationType = ["meter", "feet"];
                data.forEach(function(item) {
                    item.geolocation = item.geolocation !== 'undefined' ? JSON.parse(item.geolocation) : '';
                    item.distanceInKm = parseFloat(distance(req.body.latitude,req.body.longitude,item.geolocation.lat,item.geolocation.lng,"K").toFixed(2));
                    //console.log(item.distanceInKm);
                    if(req.body.distanceInKm && req.body.locationPattern) {
                        if(item.locationPattern === req.body.locationPattern.toUpperCase() &&
                            item.distanceInKm <= req.body.distanceInKm) {
                            nearestLocationArray.push(item);
                        }
                    }
                    else if(req.body.distanceInKm) {
                        if(item.distanceInKm <= req.body.distanceInKm) {
                            nearestLocationArray.push(item);
                        }
                    }
                    else if(req.body.locationPattern) {
                        if(item.locationPattern === req.body.locationPattern.toUpperCase()) {
                            nearestLocationArray.push(item);
                        }
                    }
                    else {
                        item.distanceInKm <= maxRadius ? nearestLocationArray.push(item) : '';
                    }

                    if(calculationType.includes(item.measureIn.toLowerCase())) {
                        item['calculatedDetails'] = calculateArea(item.locationWidth,item.locationLength,item.locationDepth,item.measureIn)
                    }
                });
                if(nearestLocationArray.length) {
                    res.status(200).json({
                        message: "Ummm! Location fetched successfully!",
                        status: 200,
                        data: {
                            nearestLocations : _.sortBy(nearestLocationArray,'distanceInKm')
                        }
                    });
                }
                else {
                    res.status(200).json({
                        message: "No data found!",
                        status: 404
                    });
                }
            }
        });
    }
    else {
        res.status(200).json({
            message: "Valid parameter missing",
            status: 400,
        });
    }
});

//deleting locator details by id
router.post("/delete", (req, res) => {

    let locator = new Locator(
        req.body.locationId
    );
    if(!req.body.locationId || req.body.locationId === "") {
        res.status(400).json({
            message: "Ohhh! Location id invalid",
            status: 400,
        });
    }
    else {
        db.query(locator.deleteDetailLocatorSQL(req.body.locationId), (err, data) => {
            if (err) {
                res.status(500).json({
                    message: "Shhh! Internal server error",
                    data: err,
                    status: 500
                });
            }
            else {
                if(data) {
                    res.status(200).json({
                        status: 200,
                        message: "Bahh! Location details deleted successfully!",
                    });
                }
                else {
                    res.status(200).json({
                        message: "No location entry found!",
                        status: 404
                    });
                }

            }
        });
    }
});


//Fetching locator list with details (userId with null optional)
router.post("/calculate", (req, res) => {
    //read locator information from request
    let data = {};
    let calculationType = ["meter", "feet"];
    let message = '';

    //for circle check
    if(!req.body.height) {
        req.body.height = null;
    }
    if(req.body.width && req.body.depth && req.body.measureIn) {
        if(calculationType.includes(req.body.measureIn.toLowerCase())) {
            data = calculateArea(req.body.width,req.body.height,req.body.depth,req.body.measureIn)
        }
        else {
            message = "Unsupported locator measurement type";
        }
        res.status(200).json({
            message: message,
            status: 200,
            data: data
        });
    }
    else {
        res.status(200).json({
            message: "Valid parameter missing",
            status: 400,
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


//Formula Implementation - reservoir calculation
function calculateArea(w,l,d,unit) {
    let data = {};
    data.liters =
        (l===null && unit.toLowerCase() === "feet") ? Math.ceil(28.32 * ((3.14 * (w / 2) * (w / 2)) * d)) :
        (l!=null && unit.toLowerCase() === "feet") ? Math.ceil(28.32 * (w * l * d)) :
        (l===null) ? Math.ceil(1000 * ((3.14 * (w / 2) * (w / 2)) * d)) : (1000 * (w * l * d));
    data.imperialGallons = Math.ceil(0.22 * data.liters);
    data.usGallons = Math.ceil(1.200095 * data.imperialGallons);
    return data;
}

module.exports = router;
