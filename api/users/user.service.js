"use strict";

const nodemailer = require("nodemailer");
const pool = require("../../config/database");
const { genSaltSync, hashSync, compareSync } = require("bcrypt");

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
                if (error) {
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
                if (error) {
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
                if (error) {
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
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },

    resetPasswordLink: async (data, callBack) => {

        let isUserPresent = 0;
        var generator = require('generate-password');
        var newpassword = generator.generate({
            length: 10,
            numbers: true
        });

        pool.query(
            `select * from admin_users where email= ?`,
            [data.email],
            async (error, results, fields) => {
                // console.log(" users Results==>", results);
                if (error) {
                    // console.log("if condition came");
                    return callBack(error);
                }
                else {
                    // console.log("else condition came");
                    let transporter = nodemailer.createTransport({
                        host: "smtp-relay.sendinblue.com",
                        port: 587,
                        secure: false,
                        auth: {
                            user: "******************",
                            pass: "******************",
                        },
                    });

                    // console.log("Results before if ===>", results);

                    if (results[0]) {
                        console.log("New Password is ===>", newpassword);
                        let name = results[0].name;

                        let info = await transporter.sendMail({
                            from: '"Administrator" <resetpassword@donotreplay.com>', // sender address
                            to: data.email, // list of receivers
                            subject: "Forgot Password", // Subject line
                            text: "This is regarding forgot your account password.", // plain text body
                            html: `<p>Dear ${name},</p><p>You have requested for password reset request, please find a new temporary password for login. <br><br>
                                    Your temporary password is - <b> ${newpassword} </b> </p><p>Regards,<br>Admin</p>`, // html body
                        });

                        console.log("Sent Email to ===>>", data.email);

                        // console.log("Message sent: %s", info.messageId);

                        // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

                        const salt = genSaltSync(10);
                        newpassword = hashSync(newpassword, salt);
                        // console.log("New Password is ===>", newpassword);

                        pool.query(
                            `update admin_users set password=? where email=?`,
                            [
                                newpassword,
                                data.email
                            ],
                            (error, results, fields) => {
                                if (error) {
                                    return callBack(error);
                                }
                                // console.log("Reset password result Services==> ", results);
                                return callBack(null, results);
                            }
                        );
                        // console.log("Results in services at 0 place ==>", results[0]);
                        //return callBack(null, results[0]);
                    }

                    else {
                        // console.log("Results in services at 0 place ==>", results);
                        console.log("User is not present....");
                        return callBack(null, results[0]);
                    }

                    //return callBack(null, results);
                }
            }
        );

    },

    resetPassword: (data, callBack) => {

        console.log("Reset Password called!!");
        pool.query(
            `update admin_users set password=? where email=?`,
            [
                data.password,
                data.email
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                console.log("Reset password result==> ", results);
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
                if (error) {
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
                console.log("Results==>", results);
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results[0]);
            }
        );
    }
};