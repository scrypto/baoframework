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
	}

	$assignElement(node)
	{
		//this.element = node;
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
		this.styles[selector] = rules.join(" ");
		this.element.innerHTML = this.$getBaoStyle();
	}
}

export default Style;
Core().register("bao/style", Style, null);
