import express from "express";
import db from "../db/database";
import Locator from "../model/locator";
import env from '../env';
import Places from "google-places-web";

Places.apiKey = env.googleApiKey;

const NodeGeocoder = require('node-geocoder');
const geocoder = NodeGeocoder({
    provider: 'google',
    apiKey: Places.apiKey
});
const router = express.Router();

//Adding new locator
router.post("/add", (req, res, next) => {
    //read locator information from request
    let locator = new Locator(
        req.body.locationName,
        req.body.geolocation,
        req.body.pattern,
        req.body.width,
        req.body.height,
        req.body.depth,
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
                res.status(200).json({
                    message: "Bahh! Location details fetched successfully!",
                    data: {
                        locationDetails: data[0]
                    }
                });
            }
        });
    }
});


//Fetching specific location details (lat/long or reverse)
router.post("/map/current", (req, res, next) => {
    if(req.body.type && req.body.type !== "") {
        if (req.body.address && req.body.type === "address") {
            geocoder.geocode(req.body.address)
            .then(function(response) {
                res.status(200).json({
                    message: "Bahh! Location details fetched successfully!",
                    data: response
                });
            })
            .catch(function(err) {
                res.status(400).json({
                    message: "Ohh! Location couldn't be fetched!",
                    data: err
                });
            });
        }
        else if (req.body.latitude && req.body.longitude && req.body.type === "geoLocation") {
            geocoder.reverse({lat:req.body.latitude, lon:req.body.longitude})
            .then(function(response) {
                res.status(200).json({
                    message: "Bahh! Location details fetched successfully!",
                    data: response
                });
            })
            .catch(function(err) {
                res.status(400).json({
                    message: "Ohh! Location couldn't be fetched!",
                    data: err
                });
            });
        }
        else {
            res.status(400).json({
                message: "Ohh! Validation error or invalid key!",
                status: 400,
            });
        }
    }
    else {
        res.status(400).json({
            message: "Ohh! Validation error or invalid key!",
            status: 400,
        });
    }
});

router.post("/places/autocomplete", (req, res, next) => {

    Places.autocomplete({ input: req.body.partialAddress})
    .then(results => {
        let arrayData = [];
        let count = 0;
        results.predictions.forEach(function(item) {
            Places.details({ placeid: item.place_id })
            .then(response => {
                item.geo_location = response.result.geometry.location;
                arrayData.push(item);
                count++;
                if(results.predictions.length === count) {
                    res.status(200).json({
                        data: arrayData
                    });
                }
            })
            .catch(function(err) {
                res.status(400).json({
                    data: err
                });
            });
        });
    })
    .catch(function(err) {
        res.status(400).json({
            data: err
        });
    });

});

module.exports = router;
