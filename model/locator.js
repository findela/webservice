class Locator {

    constructor(location_name,geolocation,like_count,pattern,width,height,depth,calculate_in,user_id,status) {
        this.location_name=location_name;
        this.geolocation=geolocation;
        this.like_count=0;
        this.pattern=pattern;
        this.width=width;
        this.height=height;
        this.depth=depth;
        this.calculate_in=calculate_in;
        this.user_id=user_id;
        this.status=status;
    }

    getAddLocatorSQL() {
        let sql = `INSERT INTO locators(location_name,geolocation,like_count,pattern,width,height,depth,calculate_in,user_id,status) VALUES('${this.location_name}','${this.geolocation}',${this.like_count},'${this.pattern}',${this.width},${this.height},${this.depth},'${this.calculate_in}',${this.user_id},${this.status})`;
        return sql;
    }
}

export default Locator;
