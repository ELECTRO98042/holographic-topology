export class FaultInjector {
    constructor(simulator) {
        this.simulator = simulator;
        this.activeFaults = new Set();
    }

    // Inject a localized energy spike or metric perturbation
    injectSpike(magnitude = 1.5) {
        if (this.simulator.parameters) {
            this.simulator.parameters.energyDensity = (this.simulator.parameters.energyDensity || 1.0) * magnitude;
        }
        if (this.simulator.perturbMatrix) {
            this.simulator.perturbMatrix(magnitude);
        }
        this.activeFaults.add('Energy Spike');
        this.logFaultEvent('Energy Spike injected with magnitude ' + magnitude);
    }

    // Toggle boundary reflectivity anomaly (simulate acoustic/holographic barrier failure)
    toggleBoundaryAnomaly() {
        if (typeof this.simulator.boundaryReflectivity === 'number') {
            this.simulator.boundaryReflectivity = this.simulator.boundaryReflectivity > 0.5 ? 0.1 : 0.95;
            const state = this.simulator.boundaryReflectivity > 0.5 ? 'High Reflectivity' : 'Boundary Leakage / Low Reflectivity';
            this.activeFaults.add('Boundary Anomaly');
            this.logFaultEvent('Boundary condition toggled to: ' + state);
        }
    }

    // Inject phase noise / wave interference disturbance
    injectPhaseNoise() {
        if (typeof this.simulator.addWaveNoise === 'function') {
            this.simulator.addWaveNoise(0.4);
        }
        this.activeFaults.add('Phase Noise');
        this.logFaultEvent('Stochastic phase noise injected into wave interference matrix.');
    }

    // Clear active perturbations and restore baseline parameters
    clearFaults() {
        this.activeFaults.clear();
        if (this.simulator.resetParameters) {
            this.simulator.resetParameters();
        }
        this.logFaultEvent('All fault injections cleared. Parameters restored to baseline.');
    }

    logFaultEvent(message) {
        console.warn(`[FaultInjector v2.2.2] ${new Date().toISOString()} - ${message}`);
    }
}