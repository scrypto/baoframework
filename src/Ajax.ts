import { $ } from "./Core"
import View from "./View"

class Ajax extends View
{
	request: XMLHttpRequest;
	signalData:any;
	obtype = "ajax";

	constructor()
	{
		super();
		this.request = new XMLHttpRequest();
		this.request.addEventListener("readystatechange", this.$onReadyStateChange);
	}

	$addEventListener(ev, callback)
	{
		this.request.addEventListener(ev, callback);
	}

	$open(method, url, async?)
	{
		this.request.open(method, url, async);
	}

	$send(data?)
	{
		this.request.send(data);
	}

	$setData(data)
	{
		this.signalData = data;
	}

	$onReadyStateChange(e)
	{
		if (this.request.readyState === 4) {
			if (this.request.status < 400) {
				this.$signal("$loaded", this.signalData);
			} else {
				this.$signal("$error", this.signalData);
			}
		} else {
			this.$signal("$loading", this.signalData);
		}
		this.$signal("$readystatechange");
	}

	$signal(type, data?)
	{
		let ev = document.createEvent("Event");
		if (ev) {
			ev.initEvent(type, true, true);
			ev["sender"] = this.request;
			ev["signalData"] = data;
			this.request.dispatchEvent(ev);
		}
	}

	$abort()
	{
		this.request.abort();
	}
}

export default Ajax;
$.register("ajax", Ajax, null);
