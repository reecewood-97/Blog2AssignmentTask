const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Blog, { foreignKey: 'userId' });
    }

    async validatePassword(password) {
      return await bcrypt.compare(password, this.getDataValue('password'));
    }

    static async hashPassword(password) {
      const salt = await bcrypt.genSalt(10);
      return await bcrypt.hash(password, salt);
    }
  }

  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        if (value && (value.startsWith('$2a$') || value.startsWith('$2b$'))) {
          this.setDataValue('password', value);
        } else if (value) {
          const salt = bcrypt.genSaltSync(10);
          const hash = bcrypt.hashSync(value, salt);
          this.setDataValue('password', hash);
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User'
  });

  return User;
};
