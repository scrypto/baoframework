import Core from "Bao/Core"
import "Bao/Menu"
import "Bao/View"

window.onload = function()
{
	let menu:any = document.getElementById("mainmenu");
	menu.setEntries(
		[
			{
				"label": "Entry 1",
				"color": "red",
				"action": 1
			},
			{
				"label": "Entry 2",
				"color": "blue",
				"action": 2
			}
		]
	);

	menu.addEventListener("$action", function(e) {
		console.log("got menuitem action: ", e);
	});

	let view:any = document.getElementById("view1");
	view.resize("300px", "300px");
}
