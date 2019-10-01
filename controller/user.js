import express from "express";
import db from "../db/database";
import User from "../model/user";
import env from '../env';

let jwt = require('jsonwebtoken');
let crypto = require('crypto');

const http = require('http');
const router = express.Router();

router.post("/register", (req, res, next) => {
    //read user information from request
    let user = new User(
        req.body.firstName,
        req.body.lastName,
        req.body.emailId,
        req.body.mobileNumber,
        req.body.userType
    );

    //registering check
    if(req.body.mobileNumber === "" || req.body.firstName === "" || req.body.lastName === "") {
        res.status(400).json({
            message: "Stopp! All required fields are mandatory",
            status: 400
        });
    }
    else {
        db.query(user.checkUserAuthSQL(), (err, data) => {
            if (!err) {
                if (data[0].userCount > 0) {
                    res.status(302).json({
                        message: "Ahhh! Same mobile or email already exist!",
                        status: 302
                    });
                }
                else {

                    db.query(user.getAddUserSQL(), (err, data) => {
                        if (err) {
                            res.status(500).json({
                                message: "Shhh! Internal server error",
                                status: 500,
                                data: err
                            });
                        }
                        else {
                            let date = new Date();
                            res.status(200).json({
                                message: "Voila! Registration successful",
                                data: {
                                    userDetails: {
                                        emailId: req.body.emailId,
                                        mobileNumber: req.body.mobileNumber,
                                        firstName: req.body.firstName,
                                        lastName: req.body.lastName,
                                        userId: data.insertId,
                                        createdAt: date.toTimeString()
                                    }
                                },
                                status: 200
                            });
                        }
                    });
                }
            }
            else {
                res.status(500).json({
                    message: "Shhh! Internal server error",
                    status: 500
                });
            }
        });
    }
});


//login check
router.post("/login", (req, res, next) => {
    //read product information from request

    if(req.body.mobileNumber === "") {
        res.status(400).json({
            message: "Stopp! Mobile field is mandatory",
            status: 400
        });
    }
    else {
        let user = new User(
            req.body.mobileNumber
        );
        user.mobileNumber = parseInt(req.body.mobileNumber);
        db.query(user.checkUserAuthSQL(), (err, data) => {
            if (!err) {
                if (data[0].userCount == 1) {
                    db.query(user.fetchUserDetailsSQL(req.body.mobileNumber), (err, data) => {
                        if (!err) {
                            let date = new Date();
                            res.status(200).json({
                                message: "Great! Login successful",
                                data: {
                                    userAccessToken : jwt.sign(
                                    {
                                        firstName: data[0].first_name,
                                        lastName: data[0].last_name,
                                        emailId: data[0].email,
                                        mobileNumber: data[0].mobile,
                                        userType: data[0].user_type,
                                        userId: data[0].id,
                                        loggedInAt: date.toTimeString()
                                    }, env.mobileApi.senderId),
                                },
                                status: 200
                            });
                        }
                        else {
                            res.status(500).json({
                                message: "Shhh! Internal server error",
                                status: 500
                            });
                        }
                    });
                }
                else {
                    res.status(401).json({
                        message: "Ohhh! Credentials mismatched!",
                        status: 401
                    });
                }
            }
            else {
                res.status(500).json({
                    message: "Shh! Internal server error",
                    status: 500
                });
            }
        });
    }
});


//OTP check
router.post("/auth/otp", (req, res, next) => {
    //read product information from request

    if(req.body.mobileNumber === "") {
        res.status(400).json({
            message: "Stopp! Mobile field is mandatory",
            status: 400
        });
    }
    else {
        let user = new User(
            req.body.mobileNumber
        );

        let otpData = {
            mobileNumber: parseInt(req.body.mobileNumber),
            otpId:  Math.floor(1000 + Math.random() * 9000),
            status: req.body.otpStatus
        };

        db.query(user.getUserOtpSQL(otpData), (err, data) => {
            if (!err) {
                res.status(200).json({
                    message: "Great! OTP sent successfully",
                    data: {
                        tokenId: otpData.tokenId,
                        mobileNumber: otpData.mobileNumber,
                        otp: otpData.otpId
                    },
                    status: 200
                });
                sendMobileOTP(otpData);
            }
            else {
                res.status(500).json({
                    message: "Shh! Internal server error",
                    status: 500,
                    data: err
                });
            }
        });
    }
});

function sendMobileOTP (data) {
    http.get(
        env.mobileApi.host+"authkey="+
        env.mobileApi.apiKey+
        "&mobiles="+data.mobileNumber+
        "&message=Hello "+env.mobileApi.senderId+" Admin, your otp is "+
        data.otpId+"&sender="+
        env.mobileApi.senderId+
        "&route="+env.mobileApi.apiRoute+
        "&country="+env.mobileApi.countryCode, (resp) => {
            let data = '';
            resp.on('end', () => {
                console.log(JSON.parse(data));
            });
        }
    ).on("error", (err) => {
        console.log("Error: " + err.message);
    });
}

module.exports = router;
