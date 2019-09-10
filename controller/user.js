import express from "express";
import db from "../db/database";
import User from "../model/user";

const router = express.Router();

router.post("/register", (req, res, next) => {
    //read product information from request
    let locator = new User(
        req.body.firstName,
        req.body.lastName,
        req.body.emailId,
        req.body.password,
        req.body.userType,
        req.body.status
    );

    db.query(locator.checkUserExistSQL(), (err, data)=> {
        if(!err) {
            if(req.body.emailId === "" || req.body.password === "" || req.body.firstName === "" || req.body.lastName === "") {
                res.status(400).json({
                    message: "Stopp! All required fields are mandatory",
                    status: 400
                });
            }
            else {
                if (data[0].userCount > 0) {
                    res.status(302).json({
                        message: "Ahhh! Same email already exist!",
                        data: data[0],
                        status: 302
                    });
                }
                else {
                    db.query(locator.getAddUserSQL(), (err, data) => {
                        if(err) {
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
        }
        else {
            res.status(500).json({
                message: "Shhh! Internal server error",
                status: 500
            });
        }
    });
});

router.post("/login", (req, res, next) => {
    //read product information from request
    let locator = new User(
        req.body.emailId,
        req.body.password
    );

    db.query(locator.checkUserAuthSQL(req.body.emailId,req.body.password), (err, data)=> {
        if(!err) {
            if (data[0].userCount == 1) {
                db.query(locator.fetchUserDetailsSQL(req.body.emailId), (err, data) => {
                    if(!err) {
                        let date = new Date();
                        res.status(200).json({
                            message: "Great! Login successful",
                            data: {
                                userDetails : {
                                    firstName: data[0].first_name,
                                    lastName: data[0].last_name,
                                    emailId: data[0].email,
                                    userType: data[0].user_type,
                                    userId: data[0].id,
                                    loggedInAt: date.toTimeString()
                                }
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
                    data: data[0],
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
});

module.exports = router;
