class User {

    constructor(firstName,lastName,emailId,mobileNumber,userType,status) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.emailId = emailId;
        this.mobileNumber = mobileNumber;
        this.userType = userType;
        this.status = status;
    }

    //registering new user (Admin/Customer)
    getAddUserSQL() {
        let sql = `INSERT INTO users(first_name,last_name,email,mobile,user_type,status) VALUES('${this.firstName}','${this.lastName}','${this.emailId}','${this.mobileNumber}','${this.userType}',TRUE)`;
        return sql;
    }

    //Login Check - if email and password combination matches
    checkUserAuthSQL() {
        let sql = `SELECT COUNT(*) as userCount FROM users where users.mobile = '${this.mobileNumber}'`;
        return sql;
    }

    // Post authentication returning user details
    fetchUserDetailsSQL(mobile) {
        this.mobileNumber = mobile;
        let sql = `SELECT * FROM users where users.mobile = '${this.mobileNumber}'`;
        return sql;
    }
}

export default User;
