window.onkeydown = function(e)
{
	var focus = document.getElementById("bao/focusManager");
	var element = focus.$get();
	switch (e.keyCode) {
		case 37: // left
			element.$onLeftKey();
			break;
		case 38: // up
			element.$onUpKey();
			break;
		case 39: // right
			element.$onRightKey();
			break;
		case 40: // down
			element.$onDownKey();
			break;
	}
}

window.onload = function()
{
	var datastore = document.getElementById("bao/dataStore");
	datastore.$set("mainmenu", 
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
			},
			{
				"label": "Entry 3",
				"color": "blue",
				"action": 3
			},
			{
				"label": "Entry 4",
				"color": "blue",
				"action": 4
			}
		]
	);

	var menu = document.getElementById("mainmenu");
	menu.addEventListener("$action", function(e) {
		console.log("menu action: " + e.signalData);
	});

	if (menu.firstChild) {
		var focus = document.getElementById("bao/focusManager");
		focus.$set(menu.firstChild);
	}
}
