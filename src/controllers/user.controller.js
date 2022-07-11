const db = require('../models');
const User = db.User;
const bcrypt = require("bcrypt");
const datatable = require(`sequelize-datatables`);


exports.findDataTable = (req, res) => {
  req.body = {
    draw: "1",
    columns: [
      {
        data: "full_name",
        name: "",
        searchable: "true",
        orderable: "true",
        search: {
          value: "",
          regex: "false",
        },
      },
    ],
    order: [
      {
        column: "0",
        dir: "asc",
      },
    ],
    start:"0",
    length: "10",
    search: {
      value: "",
      regex: "false",
    },
    _: "1478912938246",
  };
  
  datatable(User, req.body).then((result) => {
    //result is response for datatables
    //datatables helpful to not retrieve all at once the data in database
    res.json(result);
  });
};

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
    User.findAll({ where : {status : "Active" }}).then((data) => {
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
    const id = req.params.id;
    req.body.full_name = "";
  
    if (req.body.password) {
      req.body.password = await bcrypt.hash(
        req.body.password,
        parseInt(process.env.SALT_ROUNDS)
      );
    }
  
    User.update(req.body, { where: { id: id } })
      .then((result) => {
        console.log(result);
        if (result) {
          // retrieve updated details
          User.findByPk(id).then((data) => {
            res.send({
              error: false,
              data: data,
              message: [process.env.SUCCESS_UPDATE],
            });
          });
        } else {
          res.status(500).send({
            error: true,
            data: [],
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
exports.delete = (req, res) => {
  // to delete a user
  // only updating the status of the user
  const id = req.params.id;
  const body = { status: "Inactive"};
  
    User.update(body, { where: { id: id } })
      .then((result) => {
        console.log(result);
        if (result) {
          // retrieve updated details
          User.findByPk(id).then((data) => {
            res.send({
              error: false,
              data: data,
              message: [process.env.SUCCESS_UPDATE],
            });
          });
        } else {
          res.status(500).send({
            error: true,
            data: [],
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

