'use strict';
const {Model} = require('sequelize');

const PROTECTED_ATTRIBUTES = ["password", "birth_date"];

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

//to hide password while retrieving
    toJSON(){
      const attributes = {...this.get()};
      for (const a of PROTECTED_ATTRIBUTES) {
        delete attributes[a];
      }
      return attributes;
      // return {...this.get(), password: undefined};
    }

  }
  User.init(
    {
      email :{
        type: DataTypes.STRING,
        allowNull: false,
        validate: { isEmail: true},
        unique: {msg: "Email must be unique."},
      },
      id :{
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      first_name:{
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull:{ msg: "First Name should not be null."},
          notEmpty: {msg: "First name should not be empty"}
        },
        // transforming the first name to all caps
        // get(){
        //   const rawValue = this.getDataValue("first_name");
        //   return rawValue ? rawValue.toUpperCase() : null;
        // },
      },
      middle_name:{
        type: DataTypes.STRING,
      },
      last_name:{
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull:{ msg: "last name Nameshould not be null."},
          notEmpty: {msg: "last name should not be empty"}
        },
      },
      fullname:{
        type: DataTypes.STRING,
        set(value) {
          this.setDataValue("fullname",
          this.first_name + " " + this.middle_name + " " + this.last_name);
        },
        
      },
      gender:{
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: {
            args: [['Male','Female']],
            msg: "gender should be male or female",
          },
      },
      }, 
      civil_status: {
      type: DataTypes.STRING,
      allowNull: false
      },
      birth_date : {
      type: DataTypes.DATE,
      allowNull: false,
      //! FIXED THIS ONE
      }, 
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'Active'
      },
  },
  {
    sequelize,
    timestamps: true,
    createdAt: "date_created",
    updatedAt: "date_updated",
    modelName: 'User',
    // tableName: "Customer"
  });
  return User;
};