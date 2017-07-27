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
	obtype = "grid";
	constructor()
	{
		super();
		this.numRows = 10;
		this.numCols = 10;
	}

	$createContent()
	{
		this.element.style.whiteSpace = "nowrap";
		this.$createTiles();
	}

	$createTiles()
	{
		let id = this.element.getAttribute("id");

		for (let row = 0; row < this.numRows; row++) {
			for (let col = 0; col < this.numCols; col++) {
				let div = document.createElement("div");
				div.setAttribute("id", id + "_tile_" + col + "x" + row);
				div.setAttribute("class", "bao--griditem");
				div.setAttribute("data-type", "view");
				div.style.display = "inline-block";
				div.style.position = "relative";
				this.element.appendChild(div);
			}
			let br = document.createElement("br");
			this.element.appendChild(br);
		}
		Core().parseDOM(this.element);
	}
}

export default Grid;
Core().register("grid", Grid, null);
