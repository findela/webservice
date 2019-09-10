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
    db.query(locator.getAddUserSQL(), (err, data)=> {
        console.log(err);
        res.status(200).json({
            message:"New user added",
            data: data.insertId
        });
    });
});

module.exports = router;
