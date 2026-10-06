// js/TelemetryService.js
export class TelemetryService {
    constructor(channelName = 'holographic_telemetry') {
        this.channel = new BroadcastChannel(channelName);
        this.popupRef = null;
        this.isPopOutActive = false;
    }

    /**
     * Spawns the independent secondary monitor window.
     */
    openPopOut() {
        // If window exists and isn't closed, bring it to the front
        if (this.popupRef && !this.popupRef.closed) {
            this.popupRef.focus();
            return;
        }

        // Open a fresh window and focus it
        this.popupRef = window.open(
            'telemetry.html',
            'TelemetryPopOut',
            'width=800,height=600,resizable=yes,scrollbars=yes'
        );

	// Update graph/canvas canvas drawing...
        if (this.popupRef) {
            this.popupRef.focus();
            this.isPopOutActive = true;
        }
    }

    /**
     * Broadcasts telemetry metrics payload to open subscribers.
     * @param {Object} metrics - Current simulation scalar metrics
     */
    publish(metrics) {
        this.channel.postMessage({
            timestamp: performance.now(),
            ...metrics
        });
    }

    /**
     * Subscribes to incoming telemetry messages (used inside telemetry.html).
     * @param {Function} callback 
     */
    subscribe(callback) {
        this.channel.onmessage = (event) => callback(event.data);
    }
}