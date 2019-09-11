import mysql from "mysql";
import env from '../env';

const pool = mysql.createPool({
    connectionLimit : env.connectionLimit,
    host     : env.host,
    user     : env.user,
    password : env.password,
    database : env.database,
    debug    : env.debug
});

function executeQuery(sql, callback) {
    pool.getConnection((err,connection) => {
        if(err) {
            return callback(err, null);
        } else {
            if(connection) {
                connection.query(sql, function (error, results, fields) {
                    connection.release();
                    if (error) {
                        return callback(error, null);
                    }
                    return callback(null, results);
                });
            }
        }
    });
}

function query(sql, callback) {
    executeQuery(sql,function(err, data) {
        if(err) {
            return callback(err);
        }
        callback(null, data);
    });
}

module.exports = {
    query: query
}
