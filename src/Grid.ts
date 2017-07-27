import View from "bao-framework/View"
import Core from "bao-framework/Core"

class Grid extends View
{
	translationComplete:boolean;
	translations:any;
	numRows:number;
	numCols:number;
	rowHeight:number;
	colWidth:number;
	rowIndex:number;
	colIndex:number;
	obtype = "grid";
	constructor()
	{
		super();
		this.numRows = 10;
		this.numCols = 10;
		this.rowIndex = 0;
		this.colIndex = 0;
	}

	$createContent()
	{
		this.element.style.whiteSpace = "nowrap";
		this.$createTiles();
	}

	$createTiles()
	{
		let id = this.element.getAttribute("id");

		this.element.innerHTML = "";

		for (let row = 0; row < this.numRows; row++) {
			for (let col = 0; col < this.numCols; col++) {
				let div = document.createElement("div");
				div.setAttribute("id", id + "_tile_" + col + "x" + row);
				div.setAttribute("class", "bao--griditem");
				div.setAttribute("data-type", "view");
				div.style.display = "inline-block";
				div.style.position = "relative";
				div.addEventListener("$action", this.onTileAction);
				this.element.appendChild(div);
			}
			let br = document.createElement("br");
			this.element.appendChild(br);
		}
		Core().parseDOM(this.element);
	}

	$setData(data)
	{
		if (data) {
			let rows = -1;
			let cols = -1;
			if (data["rows"]) rows = data["rows"];
			if (data["cols"]) cols = data["cols"];

			if (rows > -1 && cols > -1) {
				this.numRows = rows;
				this.numCols = cols;
				this.$createTiles();
			}

			if (data["content"]) {
				let len = data["content"].length;
				let divs = this.element.getElementsByTagName("div");
				if (len > divs.length) len = divs.length;
				for (let i = 0; i < len; i++) {
					let entry = data["content"][i];
					this.$setTileContent(divs[i], entry);
				}
			}
		}
	}

	$setTileContent(element, data?)
	{
		if (data && data["innerHTML"]) {
			element.innerHTML = data["innerHTML"];
		}
	}

	onTileAction(e)
	{
		this.$signal("$action", e.sender);
	}

	$focus()
	{
		this._updateFocus();
		return true;
	}

	$onDownKey(node?)
	{
		if (this.rowIndex === this.numRows - 1) {
			super.$onDownKey(this.element);
		} else {
			this.rowIndex++;
			this._updateFocus();
		}
	}

	$onUpKey(node?)
	{
		if (this.rowIndex === 0) {
			super.$onUpKey(this.element);
		} else {
			this.rowIndex--;
			this._updateFocus();
		}
	}

	$onLeftKey(node?)
	{
		if (this.colIndex === 0) {
			super.$onLeftKey(this.element);
		} else {
			this.colIndex--;
			this._updateFocus();
		}
	}

	$onRightKey(node?)
	{
		if (this.colIndex === this.numCols - 1) {
			super.$onRightKey(this.element);
		} else {
			this.colIndex++;
			this._updateFocus();
		}
	}

	_updateFocus()
	{
		let i = this.rowIndex * (this.numCols + 1) + this.colIndex;
		let focus:any = Core().Focus;
		focus.$set(this.element.children[i]);
	}
}

export default Grid;
Core().register("grid", Grid, null);
