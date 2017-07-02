const bcrypt = require('bcrypt-nodejs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: {
          args: [2, 30],
          msg: 'Username length must be between 2 and 30 characters'
        }
      }
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [3, 30],
          msg: 'Fullname length must be between 3 and 30 characters'
        }
      }
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: {
          args: true,
          msg: 'Not a valid email'
        },
        len: {
          args: [6, 128],
          msg: 'Email length must be between 6 and 128 characters'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [6, 20],
          type: null,
          msg: 'Password length must be between 6 and 20 characters'
        }
      }
    }
  }, {
    classMethods: {
      associate(models) {
        // associations can be defined here
        User.hasMany(models.Document, {
          foreignKey: 'userId',
          onDelete: 'CASCADE',
        });
        User.belongsTo(models.Role, {
          foreignKey: 'roleId',
          onDelete: 'CASCADE',
        });
      }
    },
    instanceMethods: {
      generatePasswordHash: (user) => {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8), null);
      },
      validatePassword: (password, user) => {
        return bcrypt.compareSync(password, user.password);
      },
    },
    hooks: {
      beforeCreate: (user) => {
        user.generatePasswordHash(user);
      },
      afterUpdate: (user) => {
        user.generatePasswordHash(user);
      }
    }
  });
  return User;
};
