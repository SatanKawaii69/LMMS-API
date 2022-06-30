// import modules/packages
const express = require("express");
const dotenv = require("dotenv");
const db = require("./src/models");

//routes
const userRoute = require("./src/routes/user.routes");

// initialize app
var app = express();

// parse req of content-type - application/json
app.use(express.json());

// parse req of content-type - application/x-www-form-urlencoded
app.use(
    express.urlencoded({
        extended: true,
    })
);

// get config variables from env
dotenv.config();

//testing the connection to database
db.sequelize
.authenticate()
.then(() => {
    console.log('Connection has been established succesfully.');
})
.catch((err) => {
    console.error('Unable to connect to the database: ',err);
});

if (process.env.ALLOW_SYNC === "true"){
db.sequelize.
sync({ alter: true})
.then(() => console.log("Done adding/updating the database based on the models."));
}

//all request will go here first (middleware)
app.use((req, res, next) =>{
    // you can check session here
    console.log("Request has been sent!");
    //console.log("Request has been sent to" + req.url);
    next();
});

app.get("/", (req, res) => {
    res.json({ message: "Welcome to LMMS API" });
});
//${process.env.API_VERSION}
app.use(`${process.env.API_VERSION}/user`, userRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});