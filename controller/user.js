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
        req.body.otpNumber,
        req.body.otpStatus,
        req.body.password,
        req.body.userType,
        req.body.status
    );

    //registering check
    if(req.body.mobileNumber === "" || req.body.firstName === "" || req.body.lastName === "") {
        res.status(400).json({
            message: "Stopp! All required fields are mandatory",
            status: 400
        });
    }
    else {
        user.password = (req.body.password === "" ? '' : crypto.createHash('sha256').update(req.body.password).digest('hex'));
        db.query(user.checkUserExistSQL(), (err, data) => {
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

                            let apiMobileData = {
                                firstName: req.body.firstName,
                                mobileNumber: req.body.mobileNumber,
                                otpNumber: Math.floor(1000 + Math.random() * 9000),
                                otpStatus: 0
                            };
                            let date = new Date();

                            apiMobileData['userId'] = data.insertId;
                            db.query(user.getAddMobileOTP(apiMobileData), (err, data) => {
                                if (err) {
                                    res.status(500).json({
                                        message: "Shhh! Internal server error",
                                        status: 500,
                                        data: err
                                    });
                                }
                                else {
                                    sendMobileOTP(apiMobileData);
                                    res.status(200).json({
                                        message: "Howdy! OTP sent successfully",
                                        data: {
                                            mobileNumber: req.body.mobileNumber,
                                            requestId: data.insertId,
                                            userId : apiMobileData.userId,
                                            requestedAt: date.toTimeString(),
                                        },
                                        status: 200
                                    });
                                }
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
    let user = new User(
        req.body.mobileNumber
    );

    if(req.body.mobileNumber === "") {
        res.status(400).json({
            message: "Stopp! Mobile field is mandatory",
            status: 400
        });
    }
    else {
        user.mobileNumber = req.body.mobileNumber;
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
                                        mobileNumber: data[0].mobileNumber,
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

function sendMobileOTP (data) {
    http.get(
        env.mobileApi.host+"authkey="+
        env.mobileApi.apiKey+
        "&mobiles="+data.mobileNumber+
        "&message=Hello "+data.firstName+", your otp is "+
        data.otpNumber+"&sender="+
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
