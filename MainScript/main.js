import { ExportManager } from './exportManager.js';
import { FaultInjector } from './faultInjector.js';
import { PhiVisualizer } from './phiVisualizer.js';
import { PerformanceManager } from './performanceManager.js';

// Assuming `simulatorInstance` and `canvasElement` exist in your app setup:
const exportManager = new ExportManager(simulatorInstance);
const faultInjector = new FaultInjector(simulatorInstance);
const perfManager = new PerformanceManager(60);

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

// Initialize offscreen buffer for boundary rendering
perfManager.resizeOffscreenBuffer(canvasElement.width, canvasElement.height);

// Cache static boundary layout once or on resize
perfManager.cacheStaticBoundary((offCtx) => {
    simulatorInstance.drawStaticBoundaryGrid(offCtx);
});

// Instantiate telemetry visualizer targeting the new canvas
const phiCanvas = document.getElementById('phi-canvas');
const phiVisualizer = new PhiVisualizer(phiCanvas);

// Inside your main simulation render/update loop:
function simulationLoop() {
    perfManager.beginFrame();

    // 1. Render static geometry via offscreen cache
    simulatorInstance.clearCanvas();
    perfManager.renderCachedBoundary(simulatorInstance.ctx);

    // 2. Step physics and dynamic field nodes (scaled by adaptive quality factor)
    simulatorInstance.stepPhysics(perfManager.qualityScale);
    simulatorInstance.renderDynamicNodes();

    // 3. Feed real-time metrics into the visualizer and logger (with performance data)
    phiVisualizer.update(simulatorInstance.currentPhi, simulatorInstance.currentSEE);
    exportManager.logTick({
        s_ee: simulatorInstance.currentSEE,
        phi: simulatorInstance.currentPhi,
        fps: perfManager.getAverageFPS()
    });

    perfManager.endFrame();
    requestAnimationFrame(simulationLoop);
}

requestAnimationFrame(simulationLoop);
}
