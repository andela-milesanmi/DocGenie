'use strict';
module.exports = function(sequelize, DataTypes) {
  var Document = sequelize.define('Document', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        min: 3,
      }
    },
    access: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: public,
      validate: {
        isIn: [['private', 'public', 'role']]
      },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        min: 10,
      },
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      Document.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
      });
      }
    }
  });
  return Document;
};
