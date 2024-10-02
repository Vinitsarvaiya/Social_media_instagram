const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(db) {
        db.Post.belongsTo(db.User, { as: "user", foreignKey: "user_id" });
    }
  }

  Post.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notNull: { msg: "title is required" } }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notNull: { msg: "description is required" } }
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notNull: { msg: "image is required" } }
    },
  }, {
    sequelize,
    modelName: 'Post',
    tableName:"Post"
  });

  return Post;
};
