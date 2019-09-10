var crypto = require('crypto');

class User {

    constructor(firstName,lastName,emailId,password,userType,status) {
        this.firstName=firstName;
        this.lastName=lastName;
        this.emailId=emailId;
        this.password=password;
        this.userType=userType;
        this.status=status;
    }

    // checking if specific user already exists
    checkUserExistSQL() {
        let sql = `SELECT COUNT(*) as userCount FROM users where users.email LIKE '%${this.emailId}%'`;
        return sql;
    }

    //registering new user (Admin/Customer)
    getAddUserSQL() {
        this.password = crypto.createHash('sha256').update(this.password).digest('hex');
        let sql = `INSERT INTO users(first_name,last_name,email,password,user_type,status) VALUES('${this.firstName}','${this.lastName}','${this.emailId}','${this.password}','${this.userType}',${this.status})`;
        return sql;
    }

    //Login Check - if email and password combination matches
    checkUserAuthSQL(email,password) {
        this.emailId = email;
        this.password = crypto.createHash('sha256').update(password).digest('hex');
        let sql = `SELECT COUNT(*) as userCount FROM users where users.email = '${this.emailId}' AND users.password = '${this.password}'`;
        return sql;
    }

    // Post authentication returning user details
    fetchUserDetailsSQL(email) {
        this.emailId = email;
        let sql = `SELECT * FROM users where users.email = '${this.emailId}'`;
        return sql;
    }


}

export default User;
