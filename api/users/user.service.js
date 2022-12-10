const pool = require("../../config/database");

module.exports = {
    create: (data, callBack) => {
        pool.query(
            `insert into admin_users(name, email, password, createdDate, endDate, isActive) values(?,?,?,?,?,?)`,
            [
                data.name,
                data.email,
                data.password,
                data.createdDate,
                data.endDate,
                data.isActive
            ],
            (error, results, fields) => {
                if (error){
                    return callBack(error)
                }
                return callBack(null, results)
            }
        );
    },
    
    getUsers: callBack => {
        pool.query(
            `select admin_id, name, email, createdDate, endDate, isActive from admin_users`,
            [],
            (error, results, fields) => {
                if(error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },

    getUserByUserId: (id, callBack) => {
        pool.query(
            `select admin_id, name, email, createdDate, endDate, isActive from admin_users where email= ?`,
            [id],
            (error, results, fields) => {
                if(error){
                    return callBack(error);
                }
                return callBack(null, results[0]);
            }
        );
    },

    updateUser: (data, callBack) => {
        pool.query(
            `update admin_users set name=?, email=?, password=? where admin_id=?`,
            [
                data.name,
                data.email,
                data.password,
                data.admin_id
            ],
            (error, results, fields) => {
                if(error){
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },

    deleteUser: (data, callBack) => {
        pool.query(
            `delete from admin_users where admin_id=?`,
            [
                data.admin_id
            ],
            (error, results, fields) => {
                if(error){
                    return callBack(error);
                }
                return callBack(null, results.affectedRows);
            }
        );
    },

    getUserByUserEmail: (email, callBack) => {
        pool.query(
            `select * from admin_users where email= ?`,
            [email],
            (error, results, fields) => {
                console.log("Results==>",results);
                if(error){
                    return callBack(error);
                }
                return callBack(null, results[0]);
            }
        );
    }
};