# Node.js FFmpeg Timelapse Renderer

![Screenshot der Anwendung](https//i.imgur.com/DeinScreenshot.png) Eine einfache Desktop-Anwendung, erstellt mit Node.js und Electron, um aus einem Ordner voller JPEG-Bilder ein flüssiges Zeitraffer-Video zu erstellen. Die Anwendung nutzt FFmpeg im Hintergrund für die Videoverarbeitung.

## ✨ Features

-   **Einfache Bedienung:** Wähle einfach einen Ordner mit Bildern und einen Speicherort aus.
-   **Flüssige Videos:** Nutzt den `minterpolate`-Filter von FFmpeg, um Zwischenbilder für eine weiche Bewegung zu generieren.
-   **Anpassbare Geschwindigkeit:** Eingabe- und Ausgabe-Framerate können frei eingestellt werden.
-   **Farbkorrektur:** Stellt sicher, dass die Farben aus den JPEG-Bildern korrekt in das Videoformat konvertiert werden.
-   **Live-Fortschritt:** Ein Fortschrittsbalken zeigt den aktuellen Stand der Konvertierung an.

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

2.  **Wähle den Bilder-Ordner** aus, der deine nummerierten oder mit Zeitstempel versehenen `.jpg`-Dateien enthält.

3.  **Wähle einen Speicherort** für das fertige Video.

4.  **Passe die Framerates** bei Bedarf an (Standard: 10 fps Input, 60 fps Output).

5.  Klicke auf **"Timelapse erstellen"** und warte, bis der Prozess abgeschlossen ist.

---
Erstellt mit ❤️ und Code.