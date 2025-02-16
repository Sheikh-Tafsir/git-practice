import { DataTypes } from 'sequelize';
import Database from '../config/DatabaseConfig';
import { lengthValidationMessage, requiredValidationMessage } from '../utils/Messages';
import User from './User';

const ChatBotList = Database.define('aspire_chatbot_list', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: { msg: requiredValidationMessage},
        notEmpty: { msg: requiredValidationMessage},
        len: {
          args: [1, 100],
          msg: lengthValidationMessage(1,100)
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

    messageCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'message_count',
      defaultValue: 0,
      // validate: {
      //   notNull: { msg: requiredValidationMessage},
      // }
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
    tableName: 'aspire_chatbot_list',
    timestamps: true, 
    createdAt: 'createdAt', 
    updatedAt: 'updatedAt',
  }
);

ChatBotList.belongsTo(User, {
  foreignKey: 'userId',
  as: "ChatBotListUserId",
});

export default ChatBotList;