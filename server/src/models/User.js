import { Model, DataTypes } from "sequelize";
import { sequelize } from "./Sequelize.js";

export class User extends Model {};

User.init({
    username: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    currentBattle: {
        type: DataTypes.STRING
    }
}, {
    sequelize,
    tableName: "user"
});