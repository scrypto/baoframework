import Core from "Bao/Core"
import View from "Bao/View"

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
Core().register("bao/focusManager", Focus, null);
