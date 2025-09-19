const imageFolderInput = document.getElementById('imageFolder');
const outputFolderInput = document.getElementById('outputFolder');
const selectImageFolderBtn = document.getElementById('selectImageFolderBtn');
const selectOutputFolderBtn = document.getElementById('selectOutputFolderBtn');
const startBtn = document.getElementById('startBtn');
const progressBar = document.getElementById('progressBar');
const statusText = document.getElementById('status');
const inputRate = document.getElementById('inputRate');
const outputRate = document.getElementById('outputRate');

// Ordnerauswahl-Buttons
selectImageFolderBtn.addEventListener('click', async () => {
    const filePath = await window.electronAPI.openImageDialog();
    if (filePath) imageFolderInput.value = filePath;
});

selectOutputFolderBtn.addEventListener('click', async () => {
    const filePath = await window.electronAPI.openOutputDialog();
    if (filePath) outputFolderInput.value = filePath;
});

// Start-Button
startBtn.addEventListener('click', () => {
    const options = {
        imageFolder: imageFolderInput.value,
        outputFolder: outputFolderInput.value,
        inputFrameRate: inputRate.value,
        outputFrameRate: outputRate.value
    };

    if (!options.imageFolder || !options.outputFolder) {
        statusText.innerText = 'Fehler: Bitte wähle einen Bilder- und einen Ausgabeordner aus.';
        return;
    }

    statusText.innerText = 'Starte Verarbeitung...';
    progressBar.style.width = '0%';
    startBtn.disabled = true;

    window.electronAPI.startProcessing(options);
});

// Listener für den Fortschritt
window.electronAPI.onUpdateProgress((percent) => {
    progressBar.style.width = `${percent}%`;
    statusText.innerText = `Verarbeite: ${Math.round(percent)}%`;
});

// Listener für das Ende
window.electronAPI.onProcessingDone((message) => {
    progressBar.style.width = '100%';
    statusText.innerText = message;
    startBtn.disabled = false;
});

// Listener für Fehler
window.electronAPI.onProcessingError((message) => {
    statusText.innerText = message;
    progressBar.style.width = '0%';
    startBtn.disabled = false;
});