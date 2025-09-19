const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const fs = require('fs');
const path = require('path');

// Setze den Pfad zur FFmpeg-Anwendung
ffmpeg.setFfmpegPath(ffmpegPath);

// --- KONFIGURATION ---
const imageFolder = './bilder'; // Der Ordner mit deinen JPEG-Dateien
const outputVideo = 'timelapse_final.mp4';
const inputFrameRate = 10; // Wie schnell die Bilder eingelesen werden (bestimmt die Geschwindigkeit)
const outputFrameRate = 60; // Die finale, flüssige Bildrate des Videos

// 1. Alle Bilddateien aus dem Ordner lesen und sortieren
console.log('Lese und sortiere Bilddateien...');
const imageFiles = fs.readdirSync(imageFolder)
    .filter(file => file.toLowerCase().endsWith('.jpg')) // Nur JPEG-Dateien berücksichtigen
    .sort() // Einfache alphabetische Sortierung funktioniert bei deinem Zeitstempel-Format
    .map(file => path.join(imageFolder, file)); // Vollständigen Pfad erstellen

if (imageFiles.length === 0) {
    console.error('Keine JPEG-Bilder im Ordner gefunden!');
    process.exit(1);
}

// 2. Eine temporäre Liste für den concat-Demuxer erstellen
const listFileContent = imageFiles.map(file => `file '${file}'`).join('\n');
const listFilePath = './imagelist.txt';
fs.writeFileSync(listFilePath, listFileContent);
console.log(`Temporäre Bildliste '${listFilePath}' wurde erstellt.`);


// 3. Den FFmpeg-Befehl mit fluent-ffmpeg erstellen
console.log('Starte die Video-Erstellung mit FFmpeg...');
ffmpeg()
    // --- EINGABE-EINSTELLUNGEN ---
    .input(listFilePath) // Die erstellte Liste als Eingabe verwenden
    .inputFormat('concat') // Den concat-Demuxer nutzen
    .inputOptions([
        '-safe 0', // Notwendig für den concat-Demuxer
        `-r ${inputFrameRate}`, // Eingabebildrate (Geschwindigkeit)
        '-color_range 2' // JPEGs als "Full Range" deklarieren
    ])

    // --- VIDEOFILTER FÜR FLÜSSIGKEIT ---
    .videoFilter(`minterpolate=fps=${outputFrameRate}`)

    // --- AUSGABE-EINSTELLUNGEN ---
    .outputOptions([
        '-c:v libx264', // Video-Codec
        '-pix_fmt yuv420p', // Pixel-Format für Kompatibilität
        '-colorspace bt709', // Farbstandards für HD-Video
        '-color_primaries bt709',
        '-color_trc bt709',
        '-color_range 1' // Video als "Limited Range" ausgeben
    ])
    .output(outputVideo)

    // --- PROZESS-EVENTS ---
    .on('start', (commandLine) => {
        console.log('Folgender FFmpeg-Befehl wird ausgeführt:');
        console.log(commandLine);
    })
    .on('progress', (progress) => {
        if (progress.percent) {
            process.stdout.write(`Verarbeite: ${Math.floor(progress.percent)}% - Frame: ${progress.frames}\r`);
        }
    })
    .on('end', () => {
        console.log('\nVideo wurde erfolgreich erstellt!');
        // Temporäre Liste löschen
        fs.unlinkSync(listFilePath);
    })
    .on('error', (err) => {
        console.error('\nEin Fehler ist aufgetreten: ' + err.message);
        // Temporäre Liste löschen
        fs.unlinkSync(listFilePath);
    })

    // --- PROZESS STARTEN ---
    .run();