const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Blog extends Model {
    static associate(models) {
      Blog.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }

  Blog.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Blog'
  });

  return Blog;
};
