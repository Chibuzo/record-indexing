'use strict';

module.exports = (sequelize, DataTypes) => {
    const ChatSession = sequelize.define('ChatSession', {
        content_type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        room_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        session_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        author_id: {
            type: DataTypes.INTEGER,
        },
        author: {
            type: DataTypes.STRING
        },
        message: {
            type: DataTypes.TEXT
        },
        timestamp: {
            type: DataTypes.DATE
        }
    }, {
        tableName: 'chatsession'
    });

    return ChatSession;
}