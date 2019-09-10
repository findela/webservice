class User {

    constructor(firstName,lastName,emailId,password,userType,status) {
        this.firstName=firstName;
        this.lastName=lastName;
        this.emailId=emailId;
        this.password=password;
        this.userType=userType;
        this.status=status;
    }

    getAddUserSQL() {
        let sql = `INSERT INTO users(first_name,last_name,email,password,user_type,status) VALUES('${this.firstName}','${this.lastName}','${this.emailId}','${this.password}','${this.userType}',${this.status})`;
        return sql;
    }
}

export default User;
