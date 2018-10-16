import View from "./View"
import { $ } from "./Core"

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

		if ($.MetaConfig.$get("animation") !== "off") {
			$.Style.$addStyle(".bao--listitem", [
				"background: transparent;",
				"-webkit-transition: -webkit-transform 0.25s, opacity 0.1s;",
				"-moz-transition: -moz-transform 0.25s, opacity 0.1s;",
				"-o-transition: -o-transform 0.25s, opacity 0.1s;",
				"transition: transform 0.25s, opacity 0.1s;"
			]);
		} else {
			$.Style.$removeStyle(".bao--listitem");
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

	$removeListeners()
	{
		super.$removeListeners();
		if (this.element) {
			const len = this.element.children.length;
			for (let i = 0; i < len; i++) {
				const child = this.element.children[i];
				child.removeEventListener("transitioned", this.$transitionCompleted);
				child.removeEventListener("webkitTransitionEnd", this.$transitionCompleted);
				child.removeEventListener("oTransitionEnd", this.$transitionCompleted);
				child.removeEventListener("MSTransitionEnd", this.$transitionCompleted);
			}
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

			if (this.element.scrollHeight > this.element.clientHeight) {
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
				if ($.MetaConfig.$get("animation") === "off") {
					this.$transitionCompleted(null);
				}
			} else {
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

			if (this.translations[0] < 0) {
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

				if ($.MetaConfig.$get("animation") === "off") {
					this.$transitionCompleted(null);
				}
			} else {
				this.$transitionCompleted(null);
			}
		}
		return true;
	}

	$blur()
	{
		let len = this.element.children.length;
		for (let i = 0; i < len; i++) {
			let child:any = this.element.children[i];
			if ("function" === typeof child.$blur) child.$blur();
		}
	}

	$focus()
	{
		let len = this.element.children.length;
		for (let i = 0; i < len; i++) {
			let child:any = this.element.children[i];
			if (child && i !== this.index) {
				if ("function" === typeof child.$blur) child.$blur();
			}
		}

		let child:any = this.element.children[this.index];
		if (child) {
			if ("function" === typeof child.$focus) {
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

	$onEnterKey()
	{
		this.$signal("$action", this.element.children[this.index]);
	}
}

export default List;
$.register("list", List, null);
