class Locator {

    constructor(locationName,geolocation,pattern,width,height,depth,measureIn,userId,status) {
        this.location_name = locationName;
        this.geolocation = geolocation;
        this.pattern = pattern;
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.measureIn = measureIn;
        this.userId = userId;
        this.status = status;
    }

    getAddLocatorSQL() {
        let sql = `INSERT INTO locators(location_name,geolocation,pattern,width,height,depth,measure_in,user_id,status) VALUES('${this.location_name}','${this.geolocation}','${this.pattern}',${this.width},${this.height},${this.depth},'${this.measureIn}',${this.userId},${this.status})`;
        return sql;
    }

    fetchListLocatorSQL(userId) {
        let sql = `SELECT locators.id as locationId, measure_in as measureIn, location_name as locationName,geolocation, pattern as locationPattern, width as locationWidth, depth as locationDepth,height as locationLength, locators.status as locationStatus, locators.created_at as createdAt FROM locators`;
        if(userId) {
            this.userId = userId;
            sql = sql+` where locators.user_id = '${this.userId}'`;
        }
        sql += ` order by id desc`;
        return sql;
    }

    fetchDetailLocatorSQL(locationId) {
        let sql = `SELECT locators.id as locationId, location_name as locationName, measure_in as measureIn, geolocation, pattern as locationPattern, width as locationWidth, depth as locationDepth, height as locationLength, locators.status as locationStatus,locators.created_at as createdAt , users.first_name as userFirstName, users.last_name as userLastName, users.email as userEmailId FROM locators left join users on users.id = locators.user_id where locators.id = ${locationId}`;
        return sql;
    }
}

export default Locator;
