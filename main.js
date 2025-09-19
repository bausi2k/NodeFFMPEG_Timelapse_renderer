// main.js

const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;

ffmpeg.setFfmpegPath(ffmpegPath);

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('dialog:openImageDirectory', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({ properties: ['openDirectory'] });
    if (!canceled) return filePaths[0];
});

ipcMain.handle('dialog:openOutputDirectory', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({ properties: ['openDirectory'] });
    if (!canceled) return filePaths[0];
});

ipcMain.on('start-processing', (event, options) => {
    const { imageFolder, outputFolder, inputFrameRate, outputFrameRate, enableInterpolation, rotation } = options;
    const outputVideo = path.join(outputFolder, 'timelapse_final.mp4');

    const imageFiles = fs.readdirSync(imageFolder)
        .filter(file => file.toLowerCase().endsWith('.jpg'))
        .sort()
        .map(file => path.join(imageFolder, file));

    if (imageFiles.length === 0) {
        event.sender.send('processing-error', 'Keine JPEG-Bilder im Ordner gefunden!');
        return;
    }

    const listFileContent = imageFiles.map(file => `file '${file.replace(/\\/g, '/')}'`).join('\n');
    const listFilePath = path.join(app.getPath('temp'), 'imagelist.txt');
    fs.writeFileSync(listFilePath, listFileContent);

    const ffmpegCommand = ffmpeg()
        .input(listFilePath)
        .inputFormat('concat')
        .inputOptions(['-safe 0', `-r ${inputFrameRate}`, '-color_range 2']);

    const videoFilters = [];

    switch (rotation) {
        case '90_cw': videoFilters.push('transpose=1'); break;
        case '90_ccw': videoFilters.push('transpose=2'); break;
        case '180': videoFilters.push('transpose=1,transpose=1'); break;
    }

    if (enableInterpolation) {
        videoFilters.push(`minterpolate=fps=${outputFrameRate}`);
    } else {
        ffmpegCommand.outputOptions([`-r ${outputFrameRate}`]);
    }

    if (videoFilters.length > 0) {
        ffmpegCommand.videoFilter(videoFilters.join(','));
    }

    ffmpegCommand
        .outputOptions(['-c:v libx264', '-pix_fmt yuv420p', '-colorspace bt709', '-color_primaries bt709', '-color_trc bt709', '-color_range 1'])
        .output(outputVideo)
        .on('progress', (progress) => { event.sender.send('update-progress', progress); })
        .on('end', () => {
            event.sender.send('processing-done', `Video erfolgreich erstellt: ${outputVideo}`);
            shell.showItemInFolder(outputVideo);
            fs.unlinkSync(listFilePath);
        })
        .on('error', (err) => {
            event.sender.send('processing-error', 'Fehler: ' + err.message);
            fs.unlinkSync(listFilePath);
        })
        .run();
});