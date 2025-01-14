const getDefaultSettingsObject = (def) => {
    if (!def) return {}
    return Object.keys(def).reduce((acc, val) => ({...acc, [val]: {...def[val], value: def[val].default}}), {})
}

export default class MemoryModule {

    constructor(moduleName, displayName, defaultEnabled = true) {
        this.moduleName = moduleName;
        this.displayName = displayName;
        this.enabled = defaultEnabled;
    }

    get settings() {
        if (!this._settings) {
            this._settings = getDefaultSettingsObject(this.settingDefs)
        }
        return this._settings
    }

    getMemoryReads() {
        throw Error('You must implement getMemoryReads()');
    }

    async memoryReadAvailable(memory, handleEvent) {
        throw Error('You must implement memoryReadAvailable()');
    }

    checkChange(read) {
        return (read.value !== undefined && read.prevFrameValue === undefined) || (read.prevFrameValue !== undefined && read.value !== read.prevFrameValue);
    }
    
    checkTransition(read, from, to) {
        const fromTrue = Array.isArray(from) ? from.some((v) => v === read.prevFrameValue): read.prevFrameValue === from;
        const toTrue = Array.isArray(to) ? to.some((v) => v === read.value): read.value === to;
        return (from === undefined || fromTrue) && (to === undefined || toTrue);
    }

    setEnabled(enabled) {
        this.enabled = enabled;
    }

    setSettings({enabled = true, ...settings}) {
        const prevSettings = {...this.settings}
        Object.keys(settings).forEach(setting => {
            if (this.settings[setting]) {
                this.settings[setting].value = settings[setting].value
            }
        })
        
        if (enabled !== this.enabled) {
            this.setEnabled(enabled);
        }
        this.handleSettingsChanged(prevSettings, this.settings)
    }

    handleSettingsChanged(prevSettings, newSettings) { }

    getSettings() {
        return this.settings;
    }
}
