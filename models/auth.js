import { sequelize } from '../config/db.js';
import { DataTypes } from 'sequelize';

export const Coordinator = sequelize.define('coordinator', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
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
        validate: {
            len: [6, 100]
        }
    },
}, {
    tableName: 'coordinators',
    timestamps: true
});