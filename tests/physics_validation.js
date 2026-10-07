import { WaveEquationSolver } from '../physics/dynamics/WaveEquationSolver.js';

export function runEnergyConservationTest() {
    console.group("v3.1 Verification Test: Energy Conservation Check");

    const gridSize = 32;
    // Instantiate with zero damping (damping = 1.0) and wave speed c = 0.5
    const solver = new WaveEquationSolver(gridSize, 1.0, 0.5);

    // Inject a localized disturbance at the center
    const center = Math.floor(gridSize / 2);
    solver.disturb(center, center, 5.0);
    
    // Step once to initialize velocity history (Verlet bootstrap)
    solver.step(0.1);

    const initialEnergy = solver.calculateTotalEnergy();
    console.log(`Initial Total Energy (E_0): ${initialEnergy.toExponential(6)}`);

    let maxDrift = 0;
    const steps = 500;

    // Run unforced evolution for 500 steps
    for (let i = 0; i < steps; i++) {
        solver.step(0.1);
        const currentEnergy = solver.calculateTotalEnergy();
        const drift = Math.abs(currentEnergy - initialEnergy) / (initialEnergy || 1);
        if (drift > maxDrift) {
            maxDrift = drift;
        }
    }

    const finalEnergy = solver.calculateTotalEnergy();
    console.log(`Final Total Energy:       ${finalEnergy.toExponential(6)}`);
    console.log(`Maximum Relative Drift:   ${maxDrift.toExponential(6)}`);

    const threshold = 1e-5;
    if (maxDrift < threshold) {
        console.assert(true, `PASS: Energy conservation verified. Max drift ${maxDrift.toExponential(4)} < ${threshold}`);
    } else {
        console.error(`FAIL: Energy drift exceeded threshold! Drift: ${maxDrift.toExponential(4)}`);
    }

    console.groupEnd();
    return maxDrift < threshold;
}