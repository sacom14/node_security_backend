import { sequelize } from '../config/db.js';
import { DataTypes } from 'sequelize';

export const Player = sequelize.define('Player', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    position: {
        type: DataTypes.STRING,
        allowNull: false
    },
    team: {
        type: DataTypes.STRING,
        allowNull: false
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'players'
});