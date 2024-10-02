const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(db) {
      db.User.hasMany(db.Post, { as: "posts", foreignKey: "user_id" });
      db.User.hasMany(db.People,{as:"follower" , foreignKey:"sender_id"});
      db.User.hasMany(db.People,{as:"following" , foreignKey:"receiver_id"});
    }
  }

  User.init({
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notNull: { msg: "name is required" } }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notNull: { msg: "username is required" } }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notNull: { msg: "email is required" } }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notNull: { msg: "password is required" } }
    },
    number: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notNull: { msg: "number is required" } }
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { 
        isIn: [['male', 'female']],
        notNull: { msg: "gender is required" } 
      }
    },
    verify: {
      type: DataTypes.BOOLEAN, 
      allowNull: false, 
      defaultValue: false,
      validate: { notNull: { msg: "verification status is required" }}
    },
    image: {
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'User',
    tableName:"User"
  });

  return User;
};
