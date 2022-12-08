const { response } = require("express");
const { create, getUsers, getUserByUserId, updateUser, deleteUser, getUserByUserEmail } =  require("./user.service");
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken"); 

module.exports = {
    createUser: (req, res) => {
        const body = req.body
        console.log(body);
        console.log("Print Password --->>", body.password);
        console.log("Print Name --->>", body.name);
        console.log("Print Email --->>", body.email);
        const salt = genSaltSync(10);
        body.password = hashSync(body.password,salt);
        create(body, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: 0,
                    message: "DB Connection Error."
                });
            }
            return res.status(200).json({
                success: 1,
                data: results,
                message: "New User Created Sucessfully"
            });
        });
    },

    getUserByUserId: (req, res) => {
        const id = req.params.id;
        getUserByUserId(id, (err, results) => {
            if(err){
                console.log(err);
                return;
            }
            if(!results){
                return res.json({
                    success: 0,
                    message: "Record Not Found."
                });
            }
            return res.json({
                success: 1,
                data: results
            });
        }); 
    },

    getUsers: (req, res) => {
        getUsers((err, results) => {
            if(err){
                console.log(err);
                return;
            }
            return res.json({
                success: 1,
                data: results
            });
        });
    },

    updateUser: (req, res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);
        updateUser(body, (err, results) => {
            if(err){
                console.log(results)
                console.log(err);
                return res.json({
                    success: 0,
                    message: "Filed to update User Details."
                });ś
            }
            if(!results){
                return res.json({
                    success: 0,
                    message: "Filed to update User Details."
                });
            }
            console.log(results)
            return res.json({
                success: 1,
                message: "User Details Updated Successfully."
            });
        });
    },

    deleteUser: (req, res) => {
        const data = req.body;
        deleteUser(data, (err, results) => {
            if(err){
                console.log(err);
                return;
            }
            if(!results){
                console.log(results);
                return res.json({
                    success: 0,
                    message: "Record Not Found."
                });
            }
            return res.json({
                success: 1,
                message: "User Deleted Successfully."
            });
        });
    },

    login: (req, res) => {
        const body = req.body;
        getUserByUserEmail(body.email, (err, results) => {
            if(err){
                console.log(err);
            }
            if(!results){
                return res.json({
                    success: 0,
                    message: "Invalid Email or Password."
                });
            }

            const result = compareSync(body.password, results.password);
            if(result){
                results.password = undefined;
                const jsontoken = sign({ result: results }, "abcdQ123", {
                    expiresIn: "30m"
                });
                return res.json({
                    success: 1,
                    message: "Login Successfully.",
                    token: jsontoken
                });
            }
            else{
                return res.json({
                    success: 0,
                    message: "Invalid Email or Password."
                });
            }
        });
    }

};