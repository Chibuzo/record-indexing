'use strict';

module.exports = (sequelize, DataTypes) => {
    const VideoSession = sequelize.define('VideoSession', {
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
        user: {
            type: DataTypes.STRING
        },
        file: {
            type: DataTypes.TEXT('tiny')
        },
        local_file: {
            type: DataTypes.STRING
        },
        transcript: {
            type: DataTypes.TEXT
        },
        word_time_offset: {
            type: DataTypes.TEXT
        },
        timestamp: {
            type: DataTypes.BIGINT
        }
    }, {
        tableName: 'videosession'
    });

    return VideoSession;
}