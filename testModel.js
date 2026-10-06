/**
 * TestModel - Mock data provider for holographic topology simulation
 * Generates synthetic Ryu-Takayanagi Entanglement Entropy (S_EE) and Phi (Φ) data.
 */
export class TestModel {
    constructor() {
        this.currentSEE = 1.0;
        this.currentPhi = 0.5;
        this.time = 0;
        
        // Mock canvas context and elements for headless testing if needed
        this.canvasElement = { width: 800, height: 600 };
        this.ctx = {
            clearRect: () => {},
            drawImage: () => {},
            beginPath: () => {},
            arc: () => {},
            fill: () => {}
        };
    }

    drawStaticBoundaryGrid(ctx) {
        // Mock static boundary render logic
        ctx.beginPath();
    }

    clearCanvas() {
        // Mock canvas clear
    }

    stepPhysics(qualityScale) {
        this.time += 0.05 * qualityScale;
        // Generate synthetic wave data for S_EE and Phi
        this.currentSEE = 2.0 + Math.sin(this.time) * 0.8 + (Math.random() * 0.1);
        this.currentPhi = 1.5 + Math.cos(this.time * 0.7) * 0.5 + (Math.random() * 0.05);
    }

    renderDynamicNodes() {
        // Mock dynamic node rendering
    }
}