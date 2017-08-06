import Core from "./Core"
import View from "./View"

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
	}

	$assignElement(node)
	{
		let rv = super.$assignElement(node);
		this.element.innerHTML = this.$getBaoStyle();
		return rv;
	}

	$getBaoStyle()
	{
		let rv = "";
		for (let selector in this.styles) {
			rv += " " + selector + " { " + this.styles[selector] + " } ";
		}
		return rv.trim();
	}

	$addStyle(selector, rules)
	{
		let r = rules.join(" ");
		if (undefined !== this.styles[selector]) {
			if (r === this.styles[selector]) return;
		}

		this.styles[selector] = r;
		this.element.innerHTML = this.$getBaoStyle();
	}

	$removeStyle(selector)
	{
		if (this.styles[selector]) {
			delete this.styles[selector];
			this.element.innerHTML = this.$getBaoStyle();
		}
	}
}

export default Style;
Core().register("bao/style", Style, null);
