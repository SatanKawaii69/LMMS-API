const db = require('../models');
const User = db.User;
const bcrypt = require("bcrypt");

//create n save new user
exports.create = async (req, res) => {
    //get full name
    req.body.fullname = "";

    //encrypt password witht the help of bcrypt
    req.body.password = await bcrypt.hash(
        req.body.password, parseInt(process.env.SALT));


    User.create(req.body).then((data) => {
        res.send({
            error : false,
            data: data,
            message: [process.env.SUCCESS_CREATE],
        });
    }).catch((err) => {
        res.status(500).send({
            error: true,
            data: [],
            message: err.errors.map((e) => e.message),
        });
    });

};

//retrieve all user from database
exports.findAll = (req, res) => {
    User.findAll().then((data) => {
        res.send({
            error : false,
            data: data,
            message: [process.env.SUCCESS_RETRIEVED],
        });
    }).catch((err) => {
        res.status(500).send({
            error: true,
            data: [],
            message: err.errors.map((e) => e.message),
        });
    });

};
    
//find a single user with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    User.findByPk(id).then((data) => {
        res.send({
            error : false,
            data: data,
            message: [process.env.SUCCESS_RETRIEVED],
        });
    }).catch((err) => {
        res.status(500).send({
            error: true,
            data: [],
            message: err.errors.map((e) => e.message),
        });
    });
//or you can use find one with where clause
    // User.findOne({where: {id: id, status : 'Active'}})
    // .then((data) => {
    //     res.send({
    //         error : false,
    //         data: data,
    //         message: ["Users is retrieved Successfully."],
    //     });
    // }).catch((err) => {
    //     res.status(500).send({
    //         error: true,
    //         data: [],
    //         message: err.errors.map((e) => e.message),
    //     });
    // });
};

//update a user by the id in the request
exports.update = async (req, res) => {
    req.body.fullname = "";
    const id = req.params.id;
    

    if (req.body.password){
        req.body.password = await bcrypt.hash(
            req.body.password,
            parseInt(process.env.SALT)
        );
    }

    User.update(req.body, {
        where: {id: id},
    }).then((result) => {
        console.log(result);
        if (result){
            //success
            //{include: ["created"]}
            User.findByPk(id).then((data) => {
                res.send({
                    error : false,
                    data: data,
                    message: [process.env.SUCCESS_UPDATE],
                });
            });
        }else{
            //error in updating
            res.status(500).send({
                error: true,
                data: [],
                //err.errors.map((e) => e.message
                message: ["Error in updating a record"],
            });
        }
    })
    .catch((err) => {
        res.status(500).send({
            error: true,
            data: [],
            message: err.errors.map((e) => e.message) || process.env.GENERAL_ERROR_MSG,

        });
    });
};

//delete a user with specified id in the request
exports.delete = (req, res) => {};

