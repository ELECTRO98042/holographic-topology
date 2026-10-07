// js/TelemetryService.js
export class TelemetryService {
    constructor(channelName = 'holographic_telemetry') {
        this.channel = new BroadcastChannel(channelName);
        this.popupRef = null;
        this.isPopOutActive = false;
        this.history = [];
    }

    push(data) {
        this.history.push(data);
        this.publish(data);
    }

    publish(metrics) {
        this.channel.postMessage({
            timestamp: performance.now(),
            ...metrics
        });
    }

    subscribe(callback) {
        this.channel.onmessage = (event) => callback(event.data);
    }

    openPopOut() {
        if (this.popupRef && !this.popupRef.closed) {
            this.popupRef.focus();
            return;
        }

        this.popupRef = window.open(
            'telemetry.html',
            'TelemetryPopOut',
            'width=800,height=600,resizable=yes,scrollbars=yes'
        );

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