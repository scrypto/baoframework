import { $ } from "./Core"
import View from "./View"

class Focus extends View
{
	focusedElement:any;
	obtype = "focus";

	constructor()
	{
		super();
		this.focusedElement = null;
	}

	$set(widget)
	{
		if (widget === $.NotFound) {
			return;
		}

		if (this.focusedElement !== widget) {
			if (this.focusedElement) this.focusedElement.$blur();
			this.focusedElement = widget;
			if (!this.focusedElement.$hasClass("focus")) {
				this.focusedElement.$focus();
			}
		}
	}

	$blur()
	{
		let w = this.focusedElement;
		this.focusedElement = null;
		if (w) w.$blur();
	}

	$get()
	{
		return this.focusedElement;
	}

	$exclusions()
	{
		return super.$exclusions().concat(["focus"]);
	}
}

export default Focus;
$.register("bao/focusManager", Focus, null);
