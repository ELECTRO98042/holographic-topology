import { ExportManager } from './exportManager.js';
import { FaultInjector } from './faultInjector.js';

// Assuming `simulatorInstance` and `canvasElement` exist in your app setup:
const exportManager = new ExportManager(simulatorInstance);
const faultInjector = new FaultInjector(simulatorInstance);

// Attach export event listeners to UI controls
document.getElementById('btn-csv').addEventListener('click', () => exportManager.exportCSV());
document.getElementById('btn-snapshot').addEventListener('click', () => exportManager.exportSnapshot(canvasElement));
document.getElementById('btn-json').addEventListener('click', () => exportManager.exportJSONState());
document.getElementById('btn-localstore').addEventListener('click', () => exportManager.saveToLocalStorage());

// Attach fault injection event listeners to UI controls (v2.2.2)
document.getElementById('btn-spike').addEventListener('click', () => faultInjector.injectSpike(2.0));
document.getElementById('btn-boundary').addEventListener('click', () => faultInjector.toggleBoundaryAnomaly());
document.getElementById('btn-noise').addEventListener('click', () => faultInjector.injectPhaseNoise());
document.getElementById('btn-clear-faults').addEventListener('click', () => faultInjector.clearFaults());

// In your main simulation loop (e.g., inside requestAnimationFrame or update routine):
// Call logTick on each step to record metrics:
exportManager.logTick({
    s_ee: simulatorInstance.currentSEE,
    phi: simulatorInstance.currentPhi
});