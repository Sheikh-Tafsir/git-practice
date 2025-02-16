import { DataTypes } from 'sequelize';
import Database from '../config/DatabaseConfig';
import { lengthValidationMessage, requiredValidationMessage } from '../utils/Messages';
import Story from './Story';

const StoryDescription = Database.define('aspire_story_description', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    storyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'story_id',
      references: {
          model: Story,
          key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      validate: {
        notNull: { msg: requiredValidationMessage},
      }
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: requiredValidationMessage},
        len: {
          args: [1, 60],
          msg: lengthValidationMessage(1,60)
        },
      }
    },

    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: requiredValidationMessage},
        len: {
          args: [1, 8000],
          msg: lengthValidationMessage(1,8000)
        },
      }
    },

    image: {
        type: DataTypes.BLOB,
        allowNull:false,
        validate: {
            notNull: { msg: requiredValidationMessage},
        },
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
    tableName: 'aspire_story_description',
    timestamps: true, 
    createdAt: 'createdAt', 
    updatedAt: 'updatedAt',
  }
);

StoryDescription.belongsTo(Story, {
  foreignKey: 'storyId',
  as: "StoryDescriptionStoryId",
});

export default TaskDescription;