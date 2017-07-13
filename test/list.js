window.onkeydown = function(e)
{
	var focus = document.getElementById("bao/focusManager");
	var element = focus.get();
	switch (e.keyCode) {
		case 37: // left
			element.onLeftKey();
			break;
		case 38: // up
			element.onUpKey();
			break;
		case 39: // right
			element.onRightKey();
			break;
		case 40: // down
			element.onDownKey();
			break;
	}
}

window.onload = function()
{
	var list = document.getElementById("list");
	var focus = document.getElementById("bao/focusManager");
	focus.set(list);
}
