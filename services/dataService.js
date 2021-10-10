const fs = require('fs/promises');
const path = require('path');
const ffmpegService = require('./ffmpegService');
const speechToTextService = require('./speehToTextService');
const ChatSession = require('../models').ChatSession;
const VideoSession = require('../models').VideoSession;
const { sequelize } = require('../models');

const readFile = async filename => {
    const response = await fs.readFile(path.resolve(__dirname, '../data/', filename));
    return JSON.parse(response);
}

const extractData = async data_type => {
    const filename = {
        chat: 'chat.json',
        video: 'video.json'
    };
    const data = await readFile(filename[data_type]);
    return process[data_type](data);
}

const ingestChat = async data => {
    const rawChat = filterChat(data.frames);
    const chats = rawChat.map(chat => (
        {
            content_type: chat.content_type,
            timestamp: chat.timestamp,
            author: chat.author,
            author_id: chat.authorId,
            message: chat.data.text,
            room_id: '644292cb-2952-4eb0-838f-36ae41520e2f',
            session_id: '4706c86f-91e8-459e-baf9-ed2fe3ed82a3'
        })
    );
    return ChatSession.bulkCreate(chats);
}

const ingestVideo = async data => {
    // select av type
    const videoData = data.frames.filter(d => d.type === 'av').map(d => ({
        ...d,
        content_type: d.type,
        room_id: 'c21d6420-28a7-4746-aa98-022b7446ffdc',
        session_id: '7df4e513-3dd8-48db-b095-0f01367c299b',
        local_file: d.file.match(/user-.+\.mp4/)[0]
    }));

    const transcribedData = await Promise.all(videoData.map(async vid => {
        // convert video to audio
        const videoPath = 'media/' + vid.local_file;
        const audioFilePath = await ffmpegService.convertVideoToAudio(videoPath);

        // convert audio to text
        const { transcript, words } = await speechToTextService.transcribeAudio(audioFilePath);

        const wordsWithTimestamp = words.map(word => (
            {
                ...word,
                timestamp: vid.timestamp + (Number(word.startTime.seconds) + (word.startTime.nanos / 1000000000))
            })
        );

        return {
            ...vid,
            transcript,
            word_time_offset: JSON.stringify(wordsWithTimestamp)
        }
    }));

    return VideoSession.bulkCreate(transcribedData);
}

const search = async raw_keywords => {
    const keywords = raw_keywords.split(',').join(' | ');

    const sql = `SELECT message, timestamp, room_id room, session_id session FROM chatsession
                 WHERE ts @@ to_tsquery('english', '${keywords}')
                 UNION SELECT transcript message, timestamp, room_id room, session_id session FROM videosession
                 WHERE ts @@ to_tsquery('english', '${keywords}')`;

    const [result] = await sequelize.query(sql);
    if (!result.length) throw new Error('No messages were found');
    return result;
}

const filterChat = data => {
    return data.reduce((chats, frame) => {
        if (frame.type === 'delta' && frame.event.path && frame.event.path[0] === 'chat') {
            const delta = frame.event.delta && frame.event.delta.find(d => d.insert).insert[0] || '';
            delta && chats.push({
                ...delta,
                content_type: frame.type,
                timestamp: frame.timestamp
            });
        }
        return chats;
    }, []);
}

const process = {
    chat: ingestChat,
    video: ingestVideo
};

module.exports = {
    extractData,
    search
}