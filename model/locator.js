class Locator {

    constructor(locationName,geolocation,pattern,width,height,depth,userId,status) {
        this.location_name=locationName;
        this.geolocation=geolocation;
        this.pattern=pattern;
        this.width=width;
        this.height=height;
        this.depth=depth;
        this.user_id=userId;
        this.status=status;
    }

    getAddLocatorSQL() {
        let sql = `INSERT INTO locators(location_name,geolocation,pattern,width,height,depth,user_id,status) VALUES('${this.location_name}','${this.geolocation}','${this.pattern}',${this.width},${this.height},${this.depth},${this.user_id},${this.status})`;
        return sql;
    }

    fetchListLocatorSQL(userId) {
        let sql = "";
        if(userId !== "") {
            this.user_id = userId;
            sql = `SELECT locators.id as locationId, location_name as locationName, like_count as likeCount, 
                    geolocation, pattern as locationPattern, width as locationWidth, depth as locationDepth, 
                    height as locationLength, calculate_in as locationCalculatedBy, locators.status as locationStatus,
                    locators.created_at as createdAt FROM locators where locators.user_id = '${this.user_id}' order by id desc`;
        }
        else {
            sql = `SELECT locators.id as locationId, location_name as locationName, like_count as likeCount, geolocation, 
                    pattern as locationPattern, width as locationWidth, depth as locationDepth, 
                    height as locationLength, calculate_in as locationCalculatedBy, locators.status as locationStatus,
                    locators.created_at as createdAt , users.first_name as userFirstName, users.last_name as userLastName, 
                    users.email as userEmailId FROM locators left join users on users.id = locators.user_id 
                    where locators.status = 1 order by locators.id DESC `;
        }
        return sql;
    }

    fetchDetailLocatorSQL(locationId) {
        let sql = `SELECT locators.id as locationId, location_name as locationName, like_count as likeCount, geolocation, 
                    pattern as locationPattern, width as locationWidth, depth as locationDepth, 
                    height as locationLength, calculate_in as locationCalculatedBy, locators.status as locationStatus,
                    locators.created_at as createdAt , users.first_name as userFirstName, users.last_name as userLastName, 
                    users.email as userEmailId FROM locators left join users on users.id = locators.user_id 
                    where locators.id = ${locationId}`;
        return sql;
    }
}

export default Locator;
