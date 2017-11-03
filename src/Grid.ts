import View from "./View"
import Core from "./Core"

class Grid extends View
{
	translationComplete:boolean;
	translations:any;
	numRows:number;
	numCols:number;
	rowIndex:number;
	colIndex:number;
	tileType:string;
	obtype = "grid";
	constructor()
	{
		super();
		this.numRows = 10;
		this.numCols = 10;
		this.rowIndex = 0;
		this.colIndex = 0;
		this.tileType = "view";
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
				div.setAttribute("data-type", this.tileType);
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
			let type = "";

			if (data["rows"]) rows = data["rows"];
			if (data["cols"]) cols = data["cols"];
			if (data["tileType"]) type = data["tileType"];

			if ((rows > -1 && cols > -1) || type) {
				if (rows > -1 && cols > -1) {
					this.numRows = rows;
					this.numCols = cols;
				}
				if (type) {
					this.tileType = type;
				}
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
		if (data) {
			if (data["innerHTML"]) {
				element.innerHTML = data["innerHTML"];
			}
			if (data["classList"]) {
				for (let i = 0; i < data["classList"].length; i++) {
					element.$addClass(data["classList"][i]);
				}
			}
		}
	}

	onTileAction(e)
	{
		this.$signal("$action", e.sender);
		e.preventDefault();
		e.stopPropagation();
		return false;
	}

	$focus()
	{
		this._updateFocus();
		return true;
	}

	$onDownKey(node?)
	{
		if (this.rowIndex === this.numRows - 1) {
			super.$onDownKey();
		} else {
			this.rowIndex++;
			this._updateFocus();
		}
	}

	$onUpKey(node?)
	{
		if (this.rowIndex === 0) {
			super.$onUpKey();
		} else {
			this.rowIndex--;
			this._updateFocus();
		}
	}

	$onLeftKey(node?)
	{
		if (this.colIndex === 0) {
			super.$onLeftKey();
		} else {
			this.colIndex--;
			this._updateFocus();
		}
	}

	$onRightKey(node?)
	{
		if (this.colIndex === this.numCols - 1) {
			super.$onRightKey();
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
