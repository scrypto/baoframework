class Base
{
	private eventListeners: Object = {};

	constructor()
	{
		this._bind()
	}

	addEventListener(ev, callback)
	{
		if (typeof callback !== "function") return;

		if (!this.eventListeners[ev]) this.eventListeners[ev] = [];
		const pos = this.eventListeners[ev].indexOf(callback);
		if (pos < 0) {
			this.eventListeners[ev].push(callback);
		}
	}

	removeEventListener(ev, callback)
	{
		if (this.eventListeners[ev]) {
			const pos = this.eventListeners[ev].indexOf(callback);
			if (pos >= 0) {
				this.eventListeners[ev].splice(pos, 1);
			}
		}
	}

	$signal(type, data?)
	{
		if (this.eventListeners[type]) {
			let ev = document.createEvent("Event");
			if (ev) {
				ev.initEvent(type, true, true);
				ev["sender"] = this;
				ev["signalData"] = data;
				for (let i = 0; i < this.eventListeners[type].length; i++) {
					const fn = this.eventListeners[type][i];
					if (fn) fn(ev);
				}
			}
		}
	}

	$exclusions()
	{
		return ["addEventListener", "removeEventListener"];
	}

	private _bind()
	{
		for (let member in this) {
			if ("function" === typeof this[member]) {
				this[member] = (this[member] as any).bind(this);
			}
		}
	}
}

export default Base;
