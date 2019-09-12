import express from "express";
import db from "../db/database";
import User from "../model/user";
var jwt = require('jsonwebtoken');
var crypto = require('crypto');

const router = express.Router();

router.post("/register", (req, res, next) => {
    //read user information from request
    let user = new User(
        req.body.firstName,
        req.body.lastName,
        req.body.emailId,
        req.body.password,
        req.body.userType,
        req.body.status
    );

    //registering check
    if(req.body.emailId === "" || req.body.password === "" || req.body.firstName === "" || req.body.lastName === "") {
        res.status(400).json({
            message: "Stopp! All required fields are mandatory",
            status: 400
        });
    }
    else {
        user.password = crypto.createHash('sha256').update(req.body.password).digest('hex');
        db.query(user.checkUserExistSQL(), (err, data) => {
            if (!err) {
                if (data[0].userCount > 0) {
                    res.status(302).json({
                        message: "Ahhh! Same email already exist!",
                        status: 302
                    });
                }
                else {
                    db.query(user.getAddUserSQL(), (err, data) => {
                        if (err) {
                            res.status(500).json({
                                message: "Shhh! Internal server error",
                                status: 500
                            });
                        }
                        else {
                            let date = new Date();
                            res.status(200).json({
                                message: "Voila! Registration successful",
                                data: {
                                    userDetails: {
                                        emailId: req.body.emailId,
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
    let user = new User(
        req.body.emailId,
        req.body.password
    );

    if(req.body.emailId === "" || req.body.password === "" || req.body.firstName === "" || req.body.lastName === "") {
        res.status(400).json({
            message: "Stopp! All required fields are mandatory",
            status: 400
        });
    }
    else {
        user.emailId = req.body.emailId;
        user.password = crypto.createHash('sha256').update(req.body.password).digest('hex');
        db.query(user.checkUserAuthSQL(), (err, data) => {
            if (!err) {
                if (data[0].userCount == 1) {
                    db.query(user.fetchUserDetailsSQL(req.body.emailId), (err, data) => {
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
                                        userType: data[0].user_type,
                                        userId: data[0].id,loggedInAt: date.toTimeString()
                                    }, 'pond-webservice'),
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
                    message: "Shhh! Internal server error",
                    status: 500
                });
            }
        });
    }
});

module.exports = router;
