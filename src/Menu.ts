import View from "Bao/View"
import Core from "Bao/Core"

class MenuItem extends View
{
	action:any;
	color:any;
	label:any;
	active:boolean;
	obtype = "menuitem";

	constructor()
	{
		super();
		this.label = "";
		this.color = "";
		this.action = null;
		this.active = false;
	}

	$setData(data)
	{
		if (undefined !== data["label"]) this.$setLabel(data["label"]);
		if (undefined !== data["color"]) this.$setColor(data["color"]);
		if (undefined !== data["action"]) this.$setAction(data["action"]);
		if (undefined !== data["id"]) this.$setId(data["id"]);
	}

	$setLabel(label)
	{
		this.label = label;
		this.element.innerHTML = this.color + this.label;
	}

	$setColor(color)
	{
		if (color === false) {
			this.color = "";
			this.element.innerHTML = this.label;
		} else {
			if (!color) color = "none";
			this.element.style.overflow = "visible";
			this.color = "<div class='" + color + "'></div>";
			this.element.innerHTML = this.color + this.label;
		}
	}

	$setAction(action)
	{
		this.action = action;
	}

	$setActive(active)
	{
		this.active = active;
		if (this.active) this.$addClass("active");
		else this.$removeClass("active");
	}

	$onEnterKey()
	{
		this.$signal("action", this.action);
	}

	$onClick(e)
	{
		this.$onEnterKey();
		if (e.stopPropagation) e.stopPropagation();
		if (e.preventDefault) e.preventDefault();
		return false;
	}
}

Core().register("menuitem", MenuItem, null);

class Menu extends View
{
	selectedEntry:any;

	constructor()
	{
		super();
		this.selectedEntry = null;
		this.obtype = "menu";
	}

	$setData(entries)
	{
		this.element.innerHTML = "";
		this.selectedEntry = null;
		for (let i = 0; i < entries.length; i++) {
			let entry = this.$createMenuEntry(entries[i]);
			if (entry) this.$appendChild(entry);
		}
	}

	$createMenuEntry(entry)
	{
		let rv = Core("menuitem").$createElement("div");
		if (!entry["label"]) entry["label"] = "&#160;";
		rv.$addEventListener("action", this.$onMenuItemAction);
		rv.$setData(entry);

		if (entry["selected"] === true && !this.selectedEntry) {
			rv.$setActive(true);
			this.selectedEntry = rv;
		}
		return rv;
	}

	$onMenuItemAction(e)
	{
		this.$signal("action", e.signalData);
		if (e.stopPropagation) e.stopPropagation();
		if (e.preventDefault) e.preventDefault();
		return false;
	}

	$focus(obj?)
	{
		let f = Core().Focus;
		let node:any = this.element.firstChild;
		while (node) {
			if (node.obtype === "menuitem") {
				f.$blur(node);
			}
			node = node.nextSibling;
		}

		if (obj && obj.obtype === "menuitem") {
			f.$set(obj);
		} else if (this.selectedEntry) {
			f.$set(this.selectedEntry);
		} else {
			let node:any = this.element.firstChild;
			while (node) {
				if (node.obtype === "menuitem") {
					f.$set(node);
					break;
				}
				node = node.nextSibling;
			}
		}
		return true;
	}

	$setSelectedEntry(entry)
	{
		if (this.selectedEntry) {
			this.selectedEntry.$removeClass("selected");
		}
		this.selectedEntry = entry;
		if (entry) this.selectedEntry.$addClass("selected");
	}
}

export default Menu;
Core().register("menu", Menu, null);
