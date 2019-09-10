class Locator {

    constructor(locationName,geolocation,likedCount,pattern,width,height,depth,calculatedBy,userId,status) {
        this.location_name=locationName;
        this.geolocation=geolocation;
        this.like_count=likedCount;
        this.pattern=pattern;
        this.width=width;
        this.height=height;
        this.depth=depth;
        this.calculate_in=calculatedBy;
        this.user_id=userId;
        this.status=status;
    }

    getAddLocatorSQL() {
        let sql = `INSERT INTO locators(location_name,geolocation,like_count,pattern,width,height,depth,calculate_in,user_id,status) VALUES('${this.location_name}','${this.geolocation}',${this.like_count},'${this.pattern}',${this.width},${this.height},${this.depth},'${this.calculate_in}',${this.user_id},${this.status})`;
        return sql;
    }

    fetchListLocatorSQL(userId) {
        let sql = "";
        if(userId !== "") {
            this.user_id = userId;
            sql = `SELECT * FROM locators where locators.user_id = '${this.user_id}' order by id desc `;
        }
        else {
            sql = `SELECT * FROM locators order by id DESC `;
        }
        return sql;
    }

    fetchDetailLocatorSQL(locationId) {
        let sql = `SELECT * FROM locators where locators.id = '${locationId}'`;
        return sql;
    }
}

export default Locator;
