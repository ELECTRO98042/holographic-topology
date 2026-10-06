/**
 * PerformanceManager - v2.2.4
 * Handles frame budget monitoring, offscreen canvas buffering,
 * and adaptive field density scaling for 60 FPS performance.
 */
export class PerformanceManager {
    constructor(targetFPS = 60) {
        this.targetFrameTime = 1000 / targetFPS;
        this.lastFrameTime = performance.now();
        this.frameDelta = 0;
        this.fpsHistory = [];
        this.maxHistorySize = 60;
        
        // Dynamic adaptive controls
        this.qualityScale = 1.0; // Dynamic scale factor [0.5 - 1.0]
        this.isThrottled = false;

        // Offscreen buffer for boundary geometry
        this.offscreenCanvas = document.createElement('canvas');
        this.offscreenCtx = this.offscreenCanvas.getContext('2d');
    }

    /**
     * Call at the beginning of each simulation tick
     */
    beginFrame() {
        this.frameStartTime = performance.now();
    }

    /**
     * Call at the end of each simulation tick to evaluate frame budget
     */
    endFrame() {
        const now = performance.now();
        this.frameDelta = now - this.frameStartTime;
        const currentFPS = 1000 / (now - this.lastFrameTime);
        this.lastFrameTime = now;

        this.fpsHistory.push(currentFPS);
        if (this.fpsHistory.length > this.maxHistorySize) {
            this.fpsHistory.shift();
        }

        this.adaptQuality();
    }

    /**
     * Automatically adjusts quality scale if performance dips below target budget
     */
    adaptQuality() {
        const avgFPS = this.getAverageFPS();
        
        // If dropping below 50 FPS, drop quality scale
        if (avgFPS < 50 && this.qualityScale > 0.5) {
            this.qualityScale = Math.max(0.5, this.qualityScale - 0.05);
            this.isThrottled = true;
        } else if (avgFPS > 58 && this.qualityScale < 1.0) {
            this.qualityScale = Math.min(1.0, this.qualityScale + 0.02);
            if (this.qualityScale === 1.0) this.isThrottled = false;
        }
    }

    getAverageFPS() {
        if (this.fpsHistory.length === 0) return 60;
        const sum = this.fpsHistory.reduce((acc, val) => acc + val, 0);
        return sum / this.fpsHistory.length;
    }

    /**
     * Resizes offscreen buffer to match main canvas dimensions
     */
    resizeOffscreenBuffer(width, height) {
        this.offscreenCanvas.width = width;
        this.offscreenCanvas.height = height;
    }

    /**
     * Cache static boundary fields into offscreen buffer
     */
    cacheStaticBoundary(drawCallback) {
        this.offscreenCtx.clearRect(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height);
        drawCallback(this.offscreenCtx);
    }

    /**
     * Draw cached boundary onto main context
     */
    renderCachedBoundary(mainCtx) {
        mainCtx.drawImage(this.offscreenCanvas, 0, 0);
    }
}