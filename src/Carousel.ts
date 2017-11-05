import View from "./View"
import Core from "./Core"

class Carousel extends View
{
	tileWidth:number;
	numTiles:number;
	visibleTilesPerRow:number;
	translationComplete:boolean;
	translations:any;
	index:number;
	focusIndex:number;
	outerIndex:number;
	wrap:boolean;
	wrapAmount: number;
	transform:boolean;
	obtype = "carousel";
	scrollStyle: number;
	skipTranslation: boolean;

	constructor()
	{
		super();
		this.tileWidth = 300;
		this.numTiles = 10;
		this.visibleTilesPerRow = 0; // '0' means not specified
		this.translations = [];
		this.translationComplete = true;
		this.index = 0;
		this.focusIndex = 1;
		this.outerIndex = 0;
		this.wrap = true;
		this.wrapAmount = 1;
		this.transform = true;
		this.scrollStyle = 1; // '1' means scroll first then move right, '2' means move right first then scroll.
		this.skipTranslation = false;
	}

	$setTileWidth(width:number)
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

	$setVisibleTilesPerRow(value: number)
	{
		if (value) {
			this.visibleTilesPerRow = value;
		}
	}

	$setScrollStyle(value: number)
	{
		if (value) {
			this.scrollStyle = value;
		}
	}

	$setWrap(wrap:boolean)
	{
		let offset = wrap ? (0 - this.tileWidth * this.wrapAmount) : 0;
		for (let i = 0; i < this.element.children.length; i++) {
			this.translations[i] = offset;

			let child:any = this.element.children[i];
			child.style.transform = "translateX(" + this.translations[i] + "px)";
			child.style.webkitTransform = "translateX(" + this.translations[i] + "px)";
		}
		this.wrap = wrap;
		this.focusIndex = wrap ? this.wrapAmount : 0;
	}

	$createContent()
	{
		if (Core().MetaConfig.$get("animation") !== "off") {
			Core().Style.$addStyle(".bao--carouselitem", [
				"background: transparent;",
				"-webkit-transition: -webkit-transform 0.25s, opacity 0.1s;",
				"-moz-transition: -moz-transform 0.25s, opacity 0.1s;",
				"-o-transition: -o-transform 0.25s, opacity 0.1s;",
				"transition: transform 0.25s, opacity 0.1s;"
			]);
			Core().Style.$addStyle(".bao--carouselitem.outer", [
				"-webkit-transition: none !important;",
				"-moz-transition: none !important;",
				"-o-transition: none !important;",
				"transition: none !important;",
				"visibility: hidden;"
			]);
		} else {
			Core().Style.$removeStyle(".bao--carouselitem");
		}

		this.element.style.whiteSpace = "nowrap";
		this.element.setAttribute("data-orientation", "horizontal");
		this.$createTiles();
	}

	$createTiles(max?)
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
			div.style.transform = "translateX(-" + (this.tileWidth * this.wrapAmount) + "px)";
			div.style.webkitTransform = "translateX(-" + (this.tileWidth * this.wrapAmount) + "px)";
			div.style.width = this.tileWidth + "px";
			div.style.height = "100%";
			this.element.appendChild(div);

			div.addEventListener("transitioned", this.$transitionCompleted);
			div.addEventListener("webkitTransitionEnd", this.$transitionCompleted);
			div.addEventListener("oTransitionEnd", this.$transitionCompleted);
			div.addEventListener("MSTransitionEnd", this.$transitionCompleted);

			this.translations[i] = (0 - this.tileWidth);
		}
	}

	$transitionCompleted(e)
	{
		this.translationComplete = true;
	}

	$goLeftBy(amount: number)
	{
		this.skipTranslation = true;
		for (let i = 0; i < amount; i++) {
			this.$goLeft();
		}
		this.skipTranslation = false;
	}

	$goLeft()
	{
		if (!this.wrap && this.index + 1 === this.numTiles) return;

		if (this.translationComplete === true || this.skipTranslation) {
			if (this.transform) this.translationComplete = false;
			this.index++;
			if (this.index % this.numTiles === 1) this.index = 1;

			let t = 0;
			let outer = null;
			this.outerIndex = (this.index - 1) % this.numTiles;
			if (this.wrap ||
				(this.scrollStyle === 1 &&
					this.numTiles - this.visibleTilesPerRow > this.focusIndex &&
					this.focusIndex + 1 < this.numTiles) ||
				(this.scrollStyle === 2 && this.focusIndex + 1 >= this.visibleTilesPerRow)) {
				for (let i = 0; i < this.element.children.length; i++) {
					let child:any = this.element.children[i];
					t = this.translations[i] - this.tileWidth;
					child.style.transform = "translateX(" + t + "px)";
					child.style.webkitTransform = "translateX(" + t + "px)";
					this.translations[i] = t;
					if (this.outerIndex === i) outer = child;
				}
			}

			this._blurTile(this.element.children[this.focusIndex]);

			if (outer && this.wrap) {
				t = this.translations[this.outerIndex] + this.tileWidth * this.numTiles;
				this._moveOuter(outer, t);
				this.translations[this.outerIndex] = t;
				this.$repurposeOuter(outer, "left");
			}

			if (this.wrap) {
				this.focusIndex = (this.index + this.wrapAmount) % this.numTiles;
				if (Core().MetaConfig.$get("animation") === "off") {
					this.translationComplete = true;
				}
			} else {
				this.focusIndex = this.index % this.numTiles;
				this.translationComplete = true;
			}

			this._focusTile(this.element.children[this.focusIndex]);
		}
	}

	$goRightBy(amount: number)
	{
		this.skipTranslation = true;
		for (let i = 0; i < amount; i++) {
			this.$goRight();
		}
		this.skipTranslation = false;
	}

	$goRight(skipTranslation?: boolean)
	{
		if (!this.wrap && this.index === 0) return;

		if (this.translationComplete === true || skipTranslation) {
			if (this.transform) this.translationComplete = false;
			this.index--;
			if (this.index < 0) this.index = this.numTiles - 1;

			let t = 0;
			let outer = null;
			this.outerIndex = this.index % this.numTiles;
			if (this.wrap ||
				(this.scrollStyle === 1 && this.numTiles - this.visibleTilesPerRow >= this.focusIndex) ||
				(this.scrollStyle === 2 && this.focusIndex >= this.visibleTilesPerRow)) {
				for (let i = 0; i < this.element.children.length; i++) {
					let child: any = this.element.children[i];
					t = this.translations[i] + this.tileWidth;
					child.style.transform = "translateX(" + t + "px)";
					child.style.webkitTransform = "translateX(" + t + "px)";
					this.translations[i] = t;
					if (this.outerIndex === i) outer = child;
				}
			}

			this._blurTile(this.element.children[this.focusIndex]);

			if (outer && this.wrap) {
				t = this.translations[this.outerIndex] - this.tileWidth * this.numTiles;
				this._moveOuter(outer, t);
				this.translations[this.outerIndex] = t;
				this.$repurposeOuter(outer, "right");
			}

			if (this.wrap) {
				this.focusIndex = (this.index + this.wrapAmount) % this.numTiles;
				if (Core().MetaConfig.$get("animation") === "off") {
					this.translationComplete = true;
				}
			} else {
				this.focusIndex = this.index % this.numTiles;
				this.translationComplete = true;
			}

			this._focusTile(this.element.children[this.focusIndex]);
		}
	}

	_moveOuter(outer, t)
	{
		if (outer.$addClass) outer.$addClass("outer");
		else outer.setAttribute("class", "bao--carouselitem outer");
		outer.style.transform = "translateX(" + t + "px)";
		outer.style.webkitTransform = "translateX(" + t + "px)";
		outer.offsetHeight;
		this._blurTile(outer);
	}

	$repurposeOuter(outer, direction) {}

	$onLeftKey()
	{
		this.$goRight();
	}

	$onRightKey()
	{
		this.$goLeft();
	}

	$focus()
	{
		for (let i = 0; i < this.element.children.length; i++) {
			let child:any = this.element.children[i];
			if (this.focusIndex === i) this._focusTile(child);
			else this._blurTile(child);
		}
		return super.$focus();
	}

	$blur()
	{
		for (let i = 0; i < this.element.children.length; i++) {
			let child:any = this.element.children[i];
			this._blurTile(child);
		}
		super.$blur();
	}

	_focusTile(tile:any)
	{
		if (tile.$addClass) tile.$addClass("focused");
		else tile.setAttribute("class", "bao--carouselitem focused");
	}

	_blurTile(tile:any)
	{
		if (tile.$removeClass) tile.$removeClass("focused");
		else tile.setAttribute("class", "bao--carouselitem");
	}
}

export default Carousel;
Core().register("carousel", Carousel, null);
