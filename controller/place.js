import express from "express";
import env from '../env';
import Places from "google-places-web";

Places.apiKey = env.googleApiKey;

const NodeGeocoder = require('node-geocoder');
const geocoder = NodeGeocoder({
    provider: 'google',
    apiKey: Places.apiKey
});

const router = express.Router();

//Fetching specific location details (lat/long or reverse)
router.post("/current", (req, res) => {
    if(req.body.type && req.body.type !== "") {
        if (req.body.address && req.body.type === "address") {
            geocoder.geocode(req.body.address)
                .then(function(response) {
                    res.status(200).json({
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
                    data: response
                });
            })
            .catch(function(err) {
                res.status(400).json({
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

router.post("/autocomplete", (req, res) => {

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
