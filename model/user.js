class User {

    constructor(firstName,lastName,emailId,password,userType,status) {
        this.firstName=firstName;
        this.lastName=lastName;
        this.emailId=emailId;
        this.password=password;
        this.userType=userType;
        this.status=status;
    }

    checkUserExistSQL() {
        let sql = `SELECT COUNT(*) as userCount FROM users where users.email LIKE '%${this.emailId}%'`;
        return sql;
    }

    getAddUserSQL() {
        let sql = `INSERT INTO users(first_name,last_name,email,password,user_type,status) VALUES('${this.firstName}','${this.lastName}','${this.emailId}','${this.password}','${this.userType}',${this.status})`;
        return sql;
    }

    checkUserAuthSQL(email,password) {
        let sql = `SELECT COUNT(*) as userCount FROM users where users.email = '${email}' AND users.password = '${password}'`;
        return sql;
    }

    fetchUserDetailsSQL(email) {
        let sql = `SELECT * FROM users where users.email = '${email}'`;
        return sql;
    }


}

export default User;
