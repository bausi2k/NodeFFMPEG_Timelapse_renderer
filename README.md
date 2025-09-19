# Node.js FFmpeg Timelapse Renderer

![Screenshot der Anwendung](https://i.imgur.com/DeinScreenshot.png) Eine einfache Desktop-Anwendung, erstellt mit Node.js und Electron, um aus einem Ordner voller JPEG-Bilder ein flüssiges Zeitraffer-Video zu erstellen. Die Anwendung nutzt FFmpeg im Hintergrund für die Videoverarbeitung.

## ✨ Features

-   **Einfache Bedienung:** Wähle einfach einen Ordner mit Bildern und einen Speicherort aus.
-   **Video-Rotation:** Optionale Drehung des finalen Videos um 90° (im oder gegen den Uhrzeigersinn) oder 180°.
-   **Flüssige Videos:** Nutzt optional den `minterpolate`-Filter von FFmpeg, um Zwischenbilder für eine weiche Bewegung zu generieren.
-   **Anpassbare Geschwindigkeit:** Eingabe- und Ausgabe-Framerate können einfach über Slider (1-60 fps) eingestellt werden.
-   **Farbkorrektur:** Stellt sicher, dass die Farben aus den JPEG-Bildern korrekt in das Videoformat konvertiert werden.
-   **Detaillierter Fortschritt:** Zeigt die bereits gerenderte Videolänge, Verarbeitungsgeschwindigkeit (fps) und die Anzahl der erstellten Frames an.
-   **Automatisches Öffnen:** Nach erfolgreicher Erstellung wird der Ordner mit der fertigen Videodatei automatisch geöffnet.

## 🚀 Setup & Installation

Um das Projekt lokal auszuführen, benötigst du [Node.js](https://nodejs.org/).

1.  **Klone das Repository:**
    ```bash
    git clone [https://github.com/bausi2k/NodeFFMPEG_Timelapse_renderer.git](https://github.com/bausi2k/NodeFFMPEG_Timelapse_renderer.git)
    ```

2.  **Wechsle in das Projektverzeichnis:**
    ```bash
    cd NodeFFMPEG_Timelapse_renderer
    ```

3.  **Installiere alle Abhängigkeiten:**
    ```bash
    npm install
    ```
    *(Dieser Befehl lädt Electron, fluent-ffmpeg und die FFmpeg-Binärdateien herunter.)*

## ⚙️ Verwendung

1.  **Starte die Anwendung:**
    ```bash
    npm start
    ```

2.  Wähle den **Bilder-Ordner** und den **Speicherort**.

3.  Passe die **Framerates**, die **Rotation** und die **Interpolation** nach Wunsch an.

4.  Klicke auf **"Timelapse erstellen"** und warte, bis der Prozess abgeschlossen ist.

---
Erstellt mit ❤️ und Code.