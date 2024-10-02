const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class People extends Model {
        static associate(db) {
            db.People.belongsTo(db.User, { as: "sender_user", foreignKey: "sender_id" });
            db.People.belongsTo(db.User, { as: "receiver_user", foreignKey: "receiver_id" });
        }
    }

    People.init({
        status: {
            type: DataTypes.STRING,
            trim: true,
            allowNull: false,
            validate: { isIn: [["pending", "accepted", "rejected"]], notNull: { msg: "field is required" } }
        }
    }, {
        sequelize,
        modelName: 'People',
        // indexes: [
        //     {
        //         unique: true,
        //         fields: ['sender_id', 'receiver_id']
        //     }
        // ]
    });

    return People;
};