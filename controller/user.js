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
            if (data[0].userCount > 0) {
                res.status(302).json({
                    message: "Ahhh! Same email id already exist!",
                    data: data[0],
                    status: 302
                });
            }
            else {
                db.query(locator.getAddUserSQL(), (err, data) => {
                    res.status(201).json({
                        message: "Voila! Registration successful",
                        data: {
                            userId: data.insertId
                        },
                        status: 201
                    });
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
                        res.status(202).json({
                            message: "Great! Login successful.",
                            data: {
                                firstName: data[0].first_name,
                                lastName: data[0].last_name,
                                emailId: data[0].email,
                                userType: data[0].user_type
                            },
                            status: 202
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
                res.status(302).json({
                    message: "Ohhh! Credentials mismatched!",
                    data: data[0],
                    status: 302
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
