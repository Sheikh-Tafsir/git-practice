import { DataTypes } from 'sequelize';
import Database from '../config/DatabaseConfig';
import { lengthValidationMessage, requiredValidationMessage } from '../utils/Messages';
import Task from './Task';

const TaskDescription = Database.define('aspire_task_description', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    taskId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'task_id',
      references: {
          model: Task,
          key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      validate: {
        notNull: { msg: requiredValidationMessage},
      }
    },

    step: {
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

    done: {
        type: DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue: false,
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
    tableName: 'aspire_task_description',
    timestamps: true, 
    createdAt: 'createdAt', 
    updatedAt: 'updatedAt',
  }
);

TaskDescription.belongsTo(Task, {
  foreignKey: 'taskId',
  as: "TaskDescriptionTaskId",
});

export default TaskDescription;