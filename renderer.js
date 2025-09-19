// renderer.js

// --- Element-Referenzen ---
const imageFolderInput = document.getElementById('imageFolder');
const outputFolderInput = document.getElementById('outputFolder');
const selectImageFolderBtn = document.getElementById('selectImageFolderBtn');
const selectOutputFolderBtn = document.getElementById('selectOutputFolderBtn');
const startBtn = document.getElementById('startBtn');
const progressBar = document.getElementById('progressBar');
const statusText = document.getElementById('status');
const inputRateSlider = document.getElementById('inputRate');
const outputRateSlider = document.getElementById('outputRate');
const inputRateValue = document.getElementById('inputRateValue');
const outputRateValue = document.getElementById('outputRateValue');
const enableInterpolationCheckbox = document.getElementById('enableInterpolation');
const rotationOption = document.getElementById('rotationOption');

// --- Event Listeners ---

selectImageFolderBtn.addEventListener('click', async () => {
    const filePath = await window.electronAPI.openImageDialog();
    if (filePath) imageFolderInput.value = filePath;
});

selectOutputFolderBtn.addEventListener('click', async () => {
    const filePath = await window.electronAPI.openOutputDialog();
    if (filePath) outputFolderInput.value = filePath;
});

inputRateSlider.addEventListener('input', (event) => {
    inputRateValue.innerText = event.target.value;
});

outputRateSlider.addEventListener('input', (event) => {
    outputRateValue.innerText = event.target.value;
});

startBtn.addEventListener('click', () => {
    const options = {
        imageFolder: imageFolderInput.value,
        outputFolder: outputFolderInput.value,
        inputFrameRate: inputRateSlider.value,
        outputFrameRate: outputRateSlider.value,
        enableInterpolation: enableInterpolationCheckbox.checked,
        rotation: rotationOption.value
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

// --- IPC Listener vom Backend ---

window.electronAPI.onUpdateProgress((progress) => {
    if (progress.percent) {
        const cappedPercent = Math.min(progress.percent, 100);
        progressBar.style.width = `${cappedPercent}%`;
    }
    
    const timemark = progress.timemark || '00:00:00.00';
    const fps = progress.currentFps || 0;
    const frames = progress.frames || 0;

    statusText.innerText = `Zeit gerendert: ${timemark} | Geschwindigkeit: ${fps} fps | Frames: ${frames}`;
});

window.electronAPI.onProcessingDone((message) => {
    progressBar.style.width = '100%';
    statusText.innerText = message;
    startBtn.disabled = false;
});

window.electronAPI.onProcessingError((message) => {
    statusText.innerText = message;
    progressBar.style.width = '0%';
    startBtn.disabled = false;
});