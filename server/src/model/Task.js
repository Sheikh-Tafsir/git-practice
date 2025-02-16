import { DataTypes } from 'sequelize';
import Database from '../config/DatabaseConfig';
import { lengthValidationMessage, requiredValidationMessage } from '../utils/Messages';
import User from './User';

const Task = Database.define('aspire_task', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    prompt: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: { msg: requiredValidationMessage},
        notEmpty: { msg: requiredValidationMessage},
        len: {
          args: [1, 1000],
          msg: lengthValidationMessage(1,1000)
        },
      }
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
      references: {
          model: User,
          key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      validate: {
        notNull: { msg: requiredValidationMessage},
      }
    },

    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW,
        field: 'updated_at'
    }
  },
  
  {
    tableName: 'aspire_task',
    timestamps: true, 
    createdAt: 'createdAt', 
    updatedAt: 'updatedAt',
  }
);

Task.belongsTo(User, {
  foreignKey: 'userId',
  as: "TaskUserId",
});

export default Task;