import { DataTypes } from 'sequelize';
import Database from '../config/DatabaseConfig';
import { lengthValidationMessage, requiredValidationMessage } from '../utils/Messages';
import ChatBotList from './ChatBotList';
import { chatBotRoleList } from '../utils/Enums';

const ChatBotMessage = Database.define('aspire_chatbot_message', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    chatBotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'chatbot_id',
      references: {
          model: ChatBotList,
          key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      validate: {
        notNull: { msg: requiredValidationMessage},
      }
    },

    message: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: requiredValidationMessage},
        len: {
          args: [1, 10000],
          msg: lengthValidationMessage(1,10000)
        },
      }
    },

    role: {
        type: DataTypes.ENUM(...chatBotRoleList),
        allowNull: false,
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
    tableName: 'aspire_chatbot_message',
    timestamps: true, 
    createdAt: 'createdAt', 
    updatedAt: 'updatedAt',
  }
);

ChatBotMessage.belongsTo(ChatBotList, {
  foreignKey: 'chatBotId',
  as: "ChatBotMessageChatBotId",
});

export default ChatBotMessage;