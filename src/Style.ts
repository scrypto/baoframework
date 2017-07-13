import Core from "Bao/Core"
import View from "Bao/View"

class Style extends View
{
	styles:any;
	element:HTMLElement;
	obtype="style";

	constructor()
	{
		super();
		this.styles = {}
		this.element = null;
		/*
		for (let member in this) {
			if ("function" === typeof this[member]) {
				this[member] = (this[member] as any).bind(this);
			}
		}
		*/
	}

	assignElement(node)
	{
		//this.element = node;
		let rv = super.assignElement(node);
		this.element.innerHTML = this.getBaoStyle();
		return rv;
	}

	getBaoStyle()
	{
		let rv = "";
		if (Core().MetaConfig.get("animation") !== "off") {
			// FIXME: move this into carousel and list code
			rv += ".bao--listitem,.bao--gridrow,.bao--carouselitem { background: transparent; -webkit-transition: -webkit-transform 0.25s, opacity 0.1s; -moz-transition: -moz-transform 0.25s, opacity 0.1s; -o-transition: -o-transform 0.25s, opacity 0.1s; transition: transform 0.25s, opacity 0.1s; }";
		}

		for (let selector in this.styles) {
			rv += " " + selector + " { " + this.styles[selector] + " } ";
		}
		return rv.trim();
	}

	addStyle(selector, rules)
	{
		this.styles[selector] = rules.join(" ");
		this.element.innerHTML = this.getBaoStyle();
	}
}

export default Style;
Core().register("bao/style", Style, null);
