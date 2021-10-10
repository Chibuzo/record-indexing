const speech = require('@google-cloud/speech');
const fs = require('fs');
const path = require('path');

const client = new speech.SpeechClient();

const transcribeAudio = async audioFilePath => {
    const audio = {
        content: fs.readFileSync(path.resolve(__dirname, '../', audioFilePath)).toString('base64'),
    };

    const config = {
        enableWordTimeOffsets: true,
        encoding: 'OGG_OPUS',
        sampleRateHertz: 48000,
        languageCode: 'en-US',
    };

    const [response] = await client.recognize({ audio, config });
    return response.results.length ? response.results[0].alternatives[0] : { transcript: '', words: [] };
}

module.exports = {
    transcribeAudio
}