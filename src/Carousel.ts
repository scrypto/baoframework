import View from "Bao/View"
import Core from "Bao/Core"

class Carousel extends View
{
	tileWidth:number;
	numTiles:number;
	translationComplete:boolean;
	translations:any;
	index:number;
	focusIndex:number;
	outerIndex:number;
	wrap:boolean;
	transform:boolean;
	obtype = "carousel";

	constructor()
	{
		super();
		this.tileWidth = 300;
		this.numTiles = 10;
		this.translations = [];
		this.translationComplete = true;
		this.index = 0;
		this.focusIndex = 1;
		this.outerIndex = 0;
		this.wrap = true;
		this.transform = true;
	}

	setTileWidth(width:number)
	{
		if (this.element && this.element.children) {
			for (let i = 0; i < this.element.children.length; i++) {
				let t = this.translations[i] + this.tileWidth - width;
				this.translations[i] = t;

				let child:any = this.element.children[i];
				child.style.width = width + "px";
				child.style.transform = "translateX(" + this.translations[i] + "px)";
				child.style.webkitTransform = "translateX(" + this.translations[i] + "px)";
			}
		}

		this.tileWidth = width;
	}

	setWrap(wrap:boolean)
	{
		if (this.wrap !== wrap) {
			let offset = wrap ? (0 - this.tileWidth) : 0;
			for (let i = 0; i < this.element.children.length; i++) {
				this.translations[i] = offset;

				let child:any = this.element.children[i];
				child.style.transform = "translateX(" + this.translations[i] + "px)";
				child.style.webkitTransform = "translateX(" + this.translations[i] + "px)";
			}
			this.wrap = wrap;
			this.focusIndex = wrap ? 1 : 0;
		}
	}

	createContent()
	{
		this.element.style.whiteSpace = "nowrap";
		this.element.setAttribute("data-orientation", "horizontal");
		this.createTiles();
	}

	createTiles(max?)
	{
		if (undefined === max) max = this.numTiles;
		this.translationComplete = true;
		this.index = 0;
		this.focusIndex = 1;
		this.outerIndex = 0;
		this.wrap = true;

		if (undefined !== max) max = this.numTiles;
		this.element.innerHTML = "";
		let id = this.element.getAttribute("id");
		for (let i = 0; i < this.numTiles; i++) {
			let div = document.createElement("div");
			div.setAttribute("id", id + "_tile_" + i);
			div.setAttribute("class", "bao--carouselitem");
			div.style.display = "inline-block";
			div.style.position = "relative";
			div.style.transform = "translateX(-" + this.tileWidth + "px)";
			div.style.webkitTransform = "translateX(-" + this.tileWidth + "px)";
			div.style.width = this.tileWidth + "px";
			div.style.height = "100%";
			this.element.appendChild(div);

			div.addEventListener("transitioned", this.transitionCompleted);
			div.addEventListener("webkitTransitionEnd", this.transitionCompleted);
			div.addEventListener("oTransitionEnd", this.transitionCompleted);
			div.addEventListener("MSTransitionEnd", this.transitionCompleted);

			this.translations[i] = (0 - this.tileWidth);
		}
	}

	transitionCompleted(e)
	{
		if (!e || e.propertyName.indexOf("ransform") > 0) {
			if (this.translationComplete === false) {
				this.translationComplete = true;
				for (let i = 0; i < this.element.children.length; i++) {
					let child:any = this.element.children[i];
					child.style.visibility = "";
					child.style.opacity = "1";
					if (this.focusIndex === i) {
						child.setAttribute("class", "bao--carouselitem focused");
					}
				}
			}
		}
	}

	goLeft()
	{
		if (!this.wrap && this.index+1 === this.numTiles) return;

		if (this.translationComplete === true) {
			if (this.transform) this.translationComplete = false;
			this.index++;
			if (this.index % this.numTiles === 1) this.index = 1;

			let t = 0;
			let outer = null;
			this.outerIndex = (this.index-1) % this.numTiles;
			for (let i = 0; i < this.element.children.length; i++) {
				let child:any = this.element.children[i];
				t = this.translations[i] - this.tileWidth;
				child.style.opacity = "1";
				child.style.transform = "translateX(" + t + "px)";
				child.style.webkitTransform = "translateX(" + t + "px)";
				if (this.focusIndex === i) child.setAttribute("class","bao--carouselitem");
				this.translations[i] = t;
				if (this.outerIndex === i) outer = child;
			}

			if (outer && this.wrap) {
				t = this.translations[this.outerIndex] + this.tileWidth * this.numTiles;
				outer.style.transform = "translateX(" + t + "px)";
				outer.style.webkitTransform = "translateX(" + t + "px)";
				outer.style.visibility = "hidden";
				outer.style.opacity = "0";
				this.translations[this.outerIndex] = t;
				this.repurposeOuter(outer, "left");
			}

			if (this.wrap) this.focusIndex = (this.index+1) % this.numTiles;
			else this.focusIndex = this.index % this.numTiles;

			if (Core().MetaConfig.get("animation") === "off") {
				this.transitionCompleted(null);
			}
		}
	}

	goRight()
	{
		if (!this.wrap && this.index === 0) return;

		if (this.translationComplete === true) {
			if (this.transform) this.translationComplete = false;
			this.index--;
			if (this.index < 0) this.index = this.numTiles - 1;

			let t = 0;
			let outer = null;
			this.outerIndex = this.index % this.numTiles;
			for (let i = 0; i < this.element.children.length; i++) {
				let child:any = this.element.children[i];
				t = this.translations[i] + this.tileWidth;
				child.style.opacity = "1";
				child.style.transform = "translateX(" + t + "px)";
				child.style.webkitTransform = "translateX(" + t + "px)";
				if (this.focusIndex === i) child.setAttribute("class","bao--carouselitem");
				this.translations[i] = t;
				if (this.outerIndex === i) outer = child;
			}

			if (outer && this.wrap) {
				t = this.translations[this.outerIndex] - this.tileWidth * this.numTiles;
				outer.style.transform = "translateX(" + t + "px)";
				outer.style.webkitTransform = "translateX(" + t + "px)";
				outer.style.visibility = "hidden";
				outer.style.opacity = "0";
				this.translations[this.outerIndex] = t;
				this.repurposeOuter(outer, "right");
			}

			if (this.wrap) this.focusIndex = (this.index+1) % this.numTiles;
			else this.focusIndex = this.index % this.numTiles;

			if (Core().MetaConfig.get("animation") === "off") {
				this.transitionCompleted(null);
			}
		}
	}

	repurposeOuter(outer, direction) {}

	onLeftKey()
	{
		this.goRight();
	}

	onRightKey()
	{
		this.goLeft();
	}

	focus()
	{
		for (let i = 0; i < this.element.children.length; i++) {
			let child:any = this.element.children[i];
			if (this.focusIndex === i) {
				child.setAttribute("class", "bao--carouselitem focused");
			} else {
				child.setAttribute("class", "bao--carouselitem");
			}
		}
		return super.focus();
	}

	blur()
	{
		for (let i = 0; i < this.element.children.length; i++) {
			let child:any = this.element.children[i];
			child.setAttribute("class", "bao--carouselitem");
		}
		super.blur();
	}
}

export default Carousel;
Core().register("carousel", Carousel, null);
