class Product {

    constructor(name,price) {
        this.prd_id=0;
        this.prd_name=name;
        this.prd_price=price;
    }

    getAddProductSQL() {
        let sql = `INSERT INTO products(prd_name, prd_price) VALUES('${this.prd_name}',${this.prd_price})`;
        return sql;
    }

    static getProductByIdSQL(prd_id) {
        let sql = `SELECT * FROM products WHERE PRD_ID = ${prd_id}`;
        return sql;
    }

    static deleteProductByIdSQL(prd_id) {
        let sql = `DELETE FROM products WHERE PRD_ID = ${prd_id}`;
        return sql;
    }

    static getAllProductSQL() {
        let sql = `SELECT * FROM products`;
        return sql;
    }
}

export default Product;
