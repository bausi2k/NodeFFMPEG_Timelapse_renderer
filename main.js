const { app, BrowserWindow, ipcMain, dialog } = require('electron');
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
            // Wichtig: Ermöglicht die Kommunikation zwischen UI und Backend
            preload: path.join(__dirname, 'preload.js')
        }
    });

    win.loadFile('index.html');
    // Optional: Entwickler-Tools öffnen
    win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Listener für Ordnerauswahl (Bilder)
ipcMain.handle('dialog:openImageDirectory', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openDirectory']
    });
    if (canceled) {
        return;
    } else {
        return filePaths[0];
    }
});

// Listener für Ordnerauswahl (Output)
ipcMain.handle('dialog:openOutputDirectory', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openDirectory']
    });
    if (canceled) {
        return;
    } else {
        return filePaths[0];
    }
});


// Listener, der den Konvertierungsprozess startet
ipcMain.on('start-processing', (event, options) => {
    const { imageFolder, outputFolder, inputFrameRate, outputFrameRate } = options;
    const outputVideo = path.join(outputFolder, 'timelapse_final.mp4');

    // 1. Bilder einlesen und sortieren
    const imageFiles = fs.readdirSync(imageFolder)
        .filter(file => file.toLowerCase().endsWith('.jpg'))
        .sort()
        .map(file => path.join(imageFolder, file));

    if (imageFiles.length === 0) {
        event.sender.send('processing-error', 'Keine JPEG-Bilder im Ordner gefunden!');
        return;
    }

    // 2. Temporäre Liste erstellen
    const listFileContent = imageFiles.map(file => `file '${file.replace(/\\/g, '/')}'`).join('\n');
    const listFilePath = path.join(app.getPath('temp'), 'imagelist.txt');
    fs.writeFileSync(listFilePath, listFileContent);

    // 3. FFmpeg-Prozess starten
    ffmpeg()
        .input(listFilePath)
        .inputFormat('concat')
        .inputOptions(['-safe 0', `-r ${inputFrameRate}`, '-color_range 2'])
        .videoFilter(`minterpolate=fps=${outputFrameRate}`)
        .outputOptions([
            '-c:v libx264',
            '-pix_fmt yuv420p',
            '-colorspace bt709',
            '-color_primaries bt709',
            '-color_trc bt709',
            '-color_range 1'
        ])
        .output(outputVideo)
        .on('progress', (progress) => {
            // Fortschritt an die UI senden
            if (progress.percent) {
                event.sender.send('update-progress', progress.percent);
            }
        })
        .on('end', () => {
            event.sender.send('processing-done', `Video erfolgreich erstellt: ${outputVideo}`);
            fs.unlinkSync(listFilePath); // Temporäre Datei löschen
        })
        .on('error', (err) => {
            event.sender.send('processing-error', 'Fehler: ' + err.message);
            fs.unlinkSync(listFilePath); // Temporäre Datei löschen
        })
        .run();
});