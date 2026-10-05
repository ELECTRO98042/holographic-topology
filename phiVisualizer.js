export class PhiVisualizer {
    constructor(canvasElement) {
        this.canvas = canvasElement;
        this.ctx = this.canvas.getContext('2d');
        this.history = [];
        this.maxHistory = 100;
    }

    // Record and push new telemetry point
    update(phiValue, sEEValue) {
        this.history.push({ phi: phiValue, s_ee: sEEValue });
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }
        this.render();
    }

    // Render real-time sparkline graph and telemetry readout onto the canvas
    render() {
        if (!this.ctx) return;
        const width = this.canvas.width;
        const height = this.canvas.height;

        this.ctx.clearRect(0, 0, width, height);

        // Draw background grid lines
        this.ctx.strokeStyle = '#1e293b';
        this.ctx.lineWidth = 1;
        for (let i = 0; i < width; i += 20) {
            this.ctx.beginPath();
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i, height);
            this.ctx.stroke();
        }

        if (this.history.length < 2) return;

        const stepX = width / (this.maxHistory - 1);

        // Draw Phi telemetry line (Cyan)
        this.ctx.strokeStyle = '#38bdf8';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.history.forEach((pt, index) => {
            const x = index * stepX;
            // Normalize assuming max Phi/EE value roughly around 5.0
            const y = height - (pt.phi / 5.0) * height;
            if (index === 0) this.ctx.moveTo(x, y);
            else this.ctx.lineTo(x, y);
        });
        this.ctx.stroke();

        // Draw Entanglement Entropy S_EE telemetry line (Emerald)
        this.ctx.strokeStyle = '#34d399';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.history.forEach((pt, index) => {
            const x = index * stepX;
            const y = height - (pt.s_ee / 5.0) * height;
            if (index === 0) this.ctx.moveTo(x, y);
            else this.ctx.lineTo(x, y);
        });
        this.ctx.stroke();
    }
}