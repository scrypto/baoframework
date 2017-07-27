import View from "bao-framework/View"
import Core from "bao-framework/Core"

class List extends View
{
	translationComplete:boolean;
	translations:any;
	index:number;
	numRows:number;
	rowHeight:number;
	obtype = "list";

	constructor()
	{
		super();
		this.translations = [];
		this.translationComplete = true;
		this.index = 0;
		this.numRows = 0;
		this.rowHeight = 0;
	}

	$createContent()
	{
		this.$createRowsFromChildren();

		if (Core().MetaConfig.$get("animation") !== "off") {
			Core().Style.$addStyle(".bao--listitem", [
				"background: transparent;",
				"-webkit-transition: -webkit-transform 0.25s, opacity 0.1s;",
				"-moz-transition: -moz-transform 0.25s, opacity 0.1s;",
				"-o-transition: -o-transform 0.25s, opacity 0.1s;",
				"transition: transform 0.25s, opacity 0.1s;"
			]);
		} else {
			Core().Style.$remove(".bao--listitem");
		}
	}

	$createRowsFromChildren()
	{
		let id = this.element.getAttribute("id");
		this.numRows = this.element.children.length;
		for (let i = 0; i < this.numRows; i++) {
			let div:any = this.element.children[i];
			div.setAttribute("id", id + "_row_" + i);
			div.setAttribute("class", "bao--listitem");
			div.style.position = "relative";
			div.style.transform = "translateY(0px)";
			div.style.webkitTransform = "translateY(0px)";
			div.style.overflow = "hidden";

			div.addEventListener("transitioned", this.$transitionCompleted);
			div.addEventListener("webkitTransitionEnd", this.$transitionCompleted);
			div.addEventListener("oTransitionEnd", this.$transitionCompleted);
			div.addEventListener("MSTransitionEnd", this.$transitionCompleted);

			this.translations[i] = 0;
		}
	}

	$transitionCompleted(e)
	{
		if (!e || e.propertyName.indexOf("ransform") > 0) {
			if (this.translationComplete === false) {
				this.translationComplete = true;
				for (let i = 0; i < this.element.children.length; i++) {
					let child:any = this.element.children[i];
					child.style.visibility = "";
					child.style.opacity = "1";
				}
				this.$focus();
			}
		}
	}

	$goUp()
	{
		if (this.index + 1 === this.numRows) return false;

		if (this.translationComplete === true) {
			this.index++;
			this.translationComplete = false;

			let t = 0;
			for (let i = 0; i < this.element.children.length; i++) {
				let child:any = this.element.children[i];

				// FIXME: if we change this to use the height of the current row,
				// we can have rows of varying height
				if (this.rowHeight === 0) {
					let box = child.getBoundingClientRect();
					this.rowHeight = box.height;
				}

				t = this.translations[i] - this.rowHeight;
				child.style.opacity = "1";
				child.style.transform = "translateY(" + t + "px)";
				child.style.webkitTransform = "translateY(" + t + "px)";

				this.translations[i] = t;
			}

			if (Core().MetaConfig.$get("animation") === "off") {
				this.$transitionCompleted(null);
			}
		}
		return true;
	}

	$goDown()
	{
		if (this.index === 0) return false;

		if (this.translationComplete === true) {
			this.index--;
			this.translationComplete = false;

			let t = 0;
			for (let i = 0; i < this.element.children.length; i++) {
				let child:any = this.element.children[i];

				// FIXME: if we change this to use the height of the previous row,
				// we can have rows of varying height
				if (this.rowHeight === 0) {
					let box = child.getBoundingClientRect();
					this.rowHeight = box.height;
				}

				t = this.translations[i] + this.rowHeight;
				child.style.opacity = "1";
				child.style.transform = "translateY(" + t + "px)";
				child.style.webkitTransform = "translateY(" + t + "px)";

				this.translations[i] = t;
			}

			if (Core().MetaConfig.$get("animation") === "off") {
				this.$transitionCompleted(null);
			}
		}
		return true;
	}

	$focus()
	{
		let child:any = this.element.children[this.index];
		if (child) {
			if ("function" === typeof child.focus) {
				if (child.$focus()) return true;
			}
		}
		return super.$focus();
	}

	$onDownKey()
	{
		if (!this.$goUp()) super.$onDownKey();
	}

	$onUpKey()
	{
		if (!this.$goDown()) super.$onUpKey();
	}
}

export default List;
Core().register("list", List, null);
