import GLib from 'gi://GLib';
import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';

export default class WhisrsOverlayExtension extends Extension {
    enable() {
        this._enabled = true;
        this._impl = null;
        this._loadImpl();
    }

    async _loadImpl() {
        try {
            const overlayFile = this.dir.get_child('overlay.js');
            const uri = `${overlayFile.get_uri()}?v=${GLib.get_monotonic_time()}`;
            const {WhisrsOverlayImpl} = await import(uri);
            if (!this._enabled) return;
            let settings = null;
            try {
                settings = this.getSettings();
            } catch (e) {
                console.error('[whisrs-overlay] Cancel shortcut disabled, schema unavailable:', e);
            }
            this._impl = new WhisrsOverlayImpl(settings);
            this._impl.enable();
        } catch (e) {
            console.error('[whisrs-overlay] Failed to load overlay.js:', e);
        }
    }

    disable() {
        this._enabled = false;
        this._impl?.disable();
        this._impl = null;
    }
}
