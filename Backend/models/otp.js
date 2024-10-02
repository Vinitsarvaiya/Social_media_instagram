const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Otp extends Model {
    static associate(models) {
    }
  }

  Otp.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notNull: { msg: "email is required" } }
    },
    otp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { notNull: { msg: "email is required" } }
      },
  }, {
    sequelize,
    modelName:'Otp',
    tableName:"Otp"
  });

  return Otp;
};