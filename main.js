import { ExportManager } from './exportManager.js';

// Assuming `simulatorInstance` and `canvasElement` exist in your app setup:
const exportManager = new ExportManager(simulatorInstance);

// Attach event listeners to UI controls
document.getElementById('btn-csv').addEventListener('click', () => exportManager.exportCSV());
document.getElementById('btn-snapshot').addEventListener('click', () => exportManager.exportSnapshot(canvasElement));
document.getElementById('btn-json').addEventListener('click', () => exportManager.exportJSONState());
document.getElementById('btn-localstore').addEventListener('click', () => exportManager.saveToLocalStorage());

// In your main simulation loop (e.g., inside requestAnimationFrame or update routine):
// Call logTick on each step to record metrics:
exportManager.logTick({
    s_ee: simulatorInstance.currentSEE,
    phi: simulatorInstance.currentPhi
});