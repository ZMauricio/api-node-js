const mysql = require('mysql');

const pool = mysql.createPool({
    // "user": "root",
    // "password": "123",
    // "database": "ecommerce",
    // "host": "localhost",
    // "port": 3306
    "connectionLimit" : 1000, //Número de conexões simultâneas
    "user": process.env.MYSQL_USER,
    "password": process.env.MYSQL_PASSWORD,
    "database": process.env.MYSQL_DATABASE,
    "host": process.env.MYSQL_HOST,
    "port": process.env.MYSQL_PORT
});

// Obs: params=[] define que o envio de parâmetros (params) é opcional
exports.execute = (query, params=[])=>{
    return new Promise((resolve, reject)=>{
        pool.query(query, params, (error, resultado, fields)=>{
            if(error) {
             reject(error);
            } else {
                resolve(resultado);
            }
        });
    });
};

/*
exports.execute = (query, params=[])=>{
    return new Promise((resolve, reject)=>{
        pool.getConnection((error, conn)=>{
         if(error) {
          reject(error);
          // tenho certeza que o else é desnecessário
         } else {
            conn.query(query, params, (error, resultado, fields)=>{
                conn.release();

                if(error) {
                 reject(error);
                } else {
                    resolve(resultado);
                }
            });
         }

        });
    });
};
*/

exports.pool = pool;