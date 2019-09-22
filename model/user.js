class User {

    constructor(firstName,lastName,emailId,mobileNumber,otpNumber,otpStatus,password,userType,status) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.emailId = emailId;
        this.mobileNumber = mobileNumber;
        this.otpNumber = otpNumber;
        this.otpStatus = otpStatus;
        this.password = password;
        this.userType = userType;
        this.status = status;
    }

    // checking if specific user already exists
    checkUserExistSQL() {
        let sql = `SELECT COUNT(*) as userCount FROM users where users.mobile LIKE '%${this.mobileNumber}%' OR users.email LIKE '%${this.emailId}%'`;
        return sql;
    }

    //registering new user (Admin/Customer)
    getAddUserSQL() {
        let sql = `INSERT INTO users(first_name,last_name,email,mobile,password,user_type,status) VALUES('${this.firstName}','${this.lastName}','${this.emailId}','${this.mobileNumber}','${this.password}','${this.userType}',FALSE)`;
        return sql;
    }

    //otp validation new user (Admin/Customer)
    getAddMobileOTP(data) {
        let sql = `INSERT INTO otp(otp,otp_status,user_id) VALUES(${data.otpNumber},${data.otpStatus},${data.userId})`;
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
