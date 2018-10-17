import { $ } from "./Core"
import Base from "./Base"

class View extends Base
{
	orientation: string;
	initialised: boolean;
	element: HTMLElement;
	nofocus: boolean;
	obtype = "view";

	constructor()
	{
		super();
		this.element = null;
		this.initialised = false;
		this.orientation = "none";
	}

	$destroy()
	{
		this.$removeListeners();

		if (this.element) this.$destroyChildren(this.element);
		this.$_unstitch();
		this.element = null;
	}

	$destroyChildren(node)
	{
		if (node) {
			let child:any = node.firstChild;
			while (child) {
				if (child.$destroy) child.$destroy();
				else this.$destroyChildren(child);
				child = child.nextSibling;
			}
		}
	}

	$createElement(type)
	{
		if (this.initialised === true) throw new Error("Already attached");
		this.element = document.createElement(type);
		if (this.element["stitched"]) throw new Error("DOM element already attached");
		this.$_stitch();
		this.$createContent();
		$.parseDOM(this.element);
		return (this.element as any);
	}

	$getElementById(id)
	{
		if (this.initialised === true) throw new Error("Already attached");
		this.element = document.getElementById(id);
		if (!this.element) throw new Error("Cannot find element with id " + id);
		if (this.element["stitched"]) throw new Error("DOM element already attached");
		this.$_stitch();
		this.$createContent();
		$.parseDOM(this.element);
		return (this.element as any);
	}

	$assignElement(obj)
	{
		if (this.initialised === true) throw new Error("Already attached");
		this.element = obj;
		if (!this.element) throw new Error("Object is null");
		if (this.element["stitched"]) throw new Error("DOM element already attached");
		this.$_stitch();
		this.$createContent();
		$.parseDOM(this.element);
		return (this.element as any);
	}

	$createContent()
	{
	}

	$appendChild(child)
	{
		this.element.appendChild(child);
	}

	$setId(id)
	{
		if (!this.initialised) throw new Error("Not initialised");
		this.element.setAttribute("id", id);
	}

	$position(x, y, w, h)
	{
		if (!this.initialised) throw new Error("Not initialised");
		this.$move(x, y);
		this.$resize(w, h);
	}

	$move(x, y)
	{
		if (!this.initialised) throw new Error("Not initialised");
		if (x !== false) this.element.style.left = x;
		if (y !== false) this.element.style.top = y;
	}

	$resize(w, h)
	{
		if (!this.initialised) throw new Error("Not initialised");
		if (w !== false) this.element.style.width = w;
		if (h !== false) this.element.style.height = h;
	}

	$focus()
	{
		if (this.element.getAttribute("data-focus") === "nofocus") {
			return false;
		}

		var f = $.Focus;
		var n:any = this.element.firstChild;
		while (n) {
			if (n["stitched"]) {
				if (n.$focus && n.$focus()) {
					setTimeout(() => { f.$set(n); });
					return true;
				}
			}
			n = n.nextSibling;
		}

		if (!this.$hasClass("focused")) {
			this.$addClass("focused");
			this.$signal("$focus");
			this.$signal("$childHasFocus");
		}
		return true;
	}

	$blur()
	{
		if (this.$hasClass("focused")) {
			this.$removeClass("focused");
			this.$signal("$blur");
		}
	}

	$addClass(cls)
	{
		if (!this.initialised) throw new Error("Not initialised");
		if (this.$hasClass(cls)) return;
		let clss = (this.element.getAttribute("class") || "").split(" ");
		clss.push(cls);
		this.element.setAttribute("class", clss.join(" "));
		return this;
	}

	$hasClass(cls)
	{
		if (!this.initialised) throw new Error("Not initialised");
		let clss = (this.element.getAttribute("class") || "").split(" ");
		return (clss.indexOf(cls) > -1);
	}

	$removeClass(cls)
	{
		if (!this.initialised) throw new Error("Not initialised");
		if (this.$hasClass(cls)) {
			let clss = (this.element.getAttribute("class") || "").split(" ");
			let n = [];
			for (let i = 0; i < clss.length; i++) {
				if (cls != clss[i]) n.push(clss[i]);
			}
			this.element.setAttribute("class", n.join(" "));
		}
	}

	$signal(type, data?)
	{
		if (!this.initialised) throw new Error("Not initialised");
		if (this.element) {
			let ev = document.createEvent("Event");
			if (ev) {
				ev.initEvent(type, true, true);
				ev["sender"] = this.element;
				ev["signalData"] = data;
				this.element.dispatchEvent(ev);
			}
		}
	}

	$preventDefault(e)
	{
		if (e.preventDefault) e.preventDefault();
		if (e.stopPropagation) e.stopPropagation();
	}

	$_stitch()
	{
		// this turns off hidden classes in some engines, and can reduce memory usage
		this.element["sacrificial"] = true;
		delete this.element["scarificial"];

		let exclude = this.$exclusions();
		for (let member in this) {
			if ("function" === typeof this[member]) {
				if (exclude.indexOf(member) > -1) continue;
				if (exclude.indexOf(member.substr(1)) > -1) continue;
				if (member.indexOf("_") === 0) continue;
				try {
					(this.element as any)[member] = this[member];
				} catch (e) {}
			}
		}

		this.element["stitched"] = true;
		this.element["obtype"] = this.obtype;
		this.initialised = true;
		this.$addClass("bao--" + this.obtype);

		let orientation = this.element.getAttribute("data-orientation");
		if (orientation) this.$setOrientation(orientation);

		this.$setupListeners();
	}

	$_unstitch()
	{
		let exclude = this.$exclusions();
		for (let member in this) {
			if ("function" === typeof this[member]) {
				if (exclude.indexOf(member) > -1) continue;
				if (exclude.indexOf(member.substr(1)) > -1) continue;
				if (member.indexOf("_") === 0) continue;
				try { (this.element as any)[member] = null; } catch (e) {}
			}
		}
		this.element["stitched"] = null;
		this.element["obtype"] = null;
	}

	$exclusions()
	{
		return super.$exclusions().concat(["constructor","appendChild","createElement","getElementById","assignElement","_stitch","setupListeners","exclusions"]);
	}

	$setupListeners()
	{
		if (this.element) {
			this.element.addEventListener("click", this.$onClick);
		}
	}

	$removeListeners()
	{
		if (this.element) {
			this.element.removeEventListener("click", this.$onClick);
		}
	}

	$setData(data)
	{
		if (data) {
			if (typeof data == "string") {
				this.element.innerHTML = data["innerHTML"];
				$.parseDOM(this.element);
			} else {
				if (data["innerHTML"]) {
					this.element.innerHTML = data["innerHTML"];
					$.parseDOM(this.element);
				}
				if (data["addClass"]) {
					this.element.classList.add(data["addClass"]);
				}
				if (data["removeClass"]) {
					this.element.classList.remove(data["removeClass"]);
				}
				if (data["innerTEXT"]) {
					let t = document.createTextNode(data["innerTEXT"]);
					this.element.innerHTML = "";
					this.element.appendChild(t);
				}
			}
		}
	}

	$onClick(e)
	{
		return false;
	}

	$onLeftKey(node?)
	{
		if (this.orientation.indexOf("horizontal") >= 0) {
			if (node) {
				var sibling:any = node.previousSibling;
				while (sibling) {
					if (sibling.$focus && sibling["stitched"]) {
						var focus:any = $.Focus;
						if (focus && sibling.$focus()) {
							focus.$set(sibling);
							return;
						}
					}
					sibling = sibling.previousSibling;
				}
			}
		}

		var p:any = this.element.parentNode;
		while (p) {
			if (p && p.$onLeftKey) {
				p.$onLeftKey(this.element);
				break;
			}
			p = p.parentNode;
		}
	}

	$onRightKey(node?)
	{
		if (this.orientation.indexOf("horizontal") >= 0) {
			if (node) {
				var sibling:any = node.nextSibling;
				while (sibling) {
					if (sibling.$focus && sibling["stitched"]) {
						var focus:any = $.Focus;
						if (focus && sibling.$focus()) {
							focus.$set(sibling);
							return;
						}
					}
					sibling = sibling.nextSibling;
				}
			}
		}

		var p:any = this.element.parentNode;
		while (p) {
			if (p && p.$onRightKey) {
				p.$onRightKey(this.element);
				break;
			}
			p = p.parentNode;
		}
	}

	$onUpKey(node?)
	{
		if (this.orientation.indexOf("vertical") >= 0) {
			if (node) {
				var sibling:any = node.previousSibling;
				while (sibling) {
					if (sibling.$focus && sibling["stitched"]) {
						var focus:any = $.Focus;
						if (focus && sibling.$focus()) {
							focus.$set(sibling);
							return;
						}
					}
					sibling = sibling.previousSibling;
				}
			}
		}

		var p:any = this.element.parentNode;
		while (p) {
			if (p && p.$onUpKey) {
				p.$onUpKey(this.element);
				break;
			}
			p = p.parentNode;
		}
	}

	$onDownKey(node?)
	{
		if (this.orientation.indexOf("vertical") >= 0) {
			if (node) {
				var sibling:any = node.nextSibling;
				while (sibling) {
					if (sibling.$focus && sibling["stitched"]) {
						var focus:any = $.Focus;
						if (focus && sibling.$focus()) {
							focus.$set(sibling);
							return;
						}
					}
					sibling = sibling.nextSibling;
				}
			}
		}

		var p:any = this.element.parentNode;
		while (p) {
			if (p && p.$onDownKey) {
				p.$onDownKey(this.element);
				break;
			}
			p = p.parentNode;
		}
	}

	$onOtherKey(key:any)
	{
		var p:any = this.element.parentNode;
		while (p) {
			if (p && p.$onOtherKey) {
				p.$onOtherKey(key);
				break;
			}
			p = p.parentNode;
		}
	}

	$onEnterKey()
	{
		this.$signal("$action");
	}

	$onBackKey()
	{
		this.$signal("$back");
	}

	$setOrientation(orientation)
	{
		this.orientation = orientation;
	}
}

export default View
$.register("view", View, null);
