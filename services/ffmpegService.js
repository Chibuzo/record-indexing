const { exec } = require("child_process");
const path = require('path');

const convertVideoToAudio = videoFilePath => {
    return new Promise((resolve, reject) => {
        const fullVideoPath = path.resolve(__dirname, '../', videoFilePath);
        const audioFilePath = fullVideoPath.split('.')[0] + '.ogg';
        const command = `ffmpeg -i ${fullVideoPath} -t 50 -vn -f ogg -acodec libopus -ac 1 ${audioFilePath}`;

        exec(command, { shell: true }, (err) => {
            if (err) return reject(err);

            return resolve(audioFilePath);
        });
    });
}

module.exports = {
    convertVideoToAudio
}