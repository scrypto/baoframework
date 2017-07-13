import Core from "Bao/Core"

class View
{
	orientation: string;
	initialised: boolean;
	element: HTMLElement;
	nofocus: boolean;
	obtype = "view";

	constructor()
	{
		this.element = null;
		this.initialised = false;
		this.orientation = "none";
		this.bind();
	}

	createElement(type)
	{
		if (this.initialised === true) throw new Error("Already attached");
		this.element = document.createElement(type);
		if (this.element["stitched"]) throw new Error("DOM element already attached");
		this._stitch();
		this.createContent();
		return (this.element as any);
	}

	getElementById(id)
	{
		if (this.initialised === true) throw new Error("Already attached");
		this.element = document.getElementById(id);
		if (!this.element) throw new Error("Cannot find element with id " + id);
		if (this.element["stitched"]) throw new Error("DOM element already attached");
		this._stitch();
		this.createContent();
		return (this.element as any);
	}

	assignElement(obj)
	{
		if (this.initialised === true) throw new Error("Already attached");
		this.element = obj;
		if (!this.element) throw new Error("Object is null");
		if (this.element["stitched"]) throw new Error("DOM element already attached");
		this._stitch();
		this.createContent();
		return (this.element as any);
	}

	createContent()
	{
	}

	appendChild(child)
	{
		this.element.appendChild(child);
	}

	setId(id)
	{
		if (!this.initialised) throw new Error("Not initialised");
		this.element.setAttribute("id", id);
	}

	position(x, y, w, h)
	{
		if (!this.initialised) throw new Error("Not initialised");
		this.move(x, y);
		this.resize(w, h);
	}

	move(x, y)
	{
		if (!this.initialised) throw new Error("Not initialised");
		if (x !== false) this.element.style.left = x;
		if (y !== false) this.element.style.top = y;
	}

	resize(w, h)
	{
		if (!this.initialised) throw new Error("Not initialised");
		if (w !== false) this.element.style.width = w;
		if (h !== false) this.element.style.height = h;
	}

	focus()
	{
		//if (this.orientation !== "none") {
			var f = Core().Focus;
			var n:any = this.element.firstChild;
			while (n) {
				if (n["stitched"]) {
					if (n.focus && n.focus()) {
						f.set(n);
						return true;
					}
				}
				n = n.nextSibling;
			}
		//}

		if (this.element.getAttribute("data-focus") !== "nofocus") {
			if (!this.hasClass("focused")) {
				this.addClass("focused");
				this.signal("focus");
			}
			return true;
		}
		return false;
	}

	blur()
	{
		if (this.hasClass("focused")) {
			this.removeClass("focused");
			this.signal("blur");
		}
	}

	addClass(cls)
	{
		if (!this.initialised) throw new Error("Not initialised");
		if (this.hasClass(cls)) return;
		let clss = (this.element.getAttribute("class") || "").split(" ");
		clss.push(cls);
		this.element.setAttribute("class", clss.join(" "));
		return this;
	}

	hasClass(cls)
	{
		if (!this.initialised) throw new Error("Not initialised");
		let clss = (this.element.getAttribute("class") || "").split(" ");
		return (clss.indexOf(cls) > -1);
	}

	removeClass(cls)
	{
		if (!this.initialised) throw new Error("Not initialised");
		if (this.hasClass(cls)) {
			let clss = (this.element.getAttribute("class") || "").split(" ");
			let n = [];
			for (let i = 0; i < clss.length; i++) {
				if (cls != clss[i]) n.push(clss[i]);
			}
			this.element.setAttribute("class", n.join(" "));
		}
	}

	signal(type, data?)
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

	bind()
	{
		for (let member in this) {
			if ("function" === typeof this[member]) {
				this[member] = (this[member] as any).bind(this);
			}
		}
	}

	_stitch()
	{
		let exclude = this.exclusions();
		for (let member in this) {
			if ("function" === typeof this[member]) {
				if (exclude.indexOf(member) > -1) continue;
				if ((this.element as any)[member]) {
					(this.element as any)["_" + member] = (this.element as any)[member];
				}
				(this.element as any)[member] = this[member];
			}
		}
		this.element["stitched"] = true;
		this.element["obtype"] = this.obtype;
		this.initialised = true;
		this.addClass("bao--" + this.obtype);

		let orientation = this.element.getAttribute("data-orientation");
		if (orientation) this.setOrientation(orientation);

		this.setupListeners();
	}

	exclusions()
	{
		return ["constructor","appendChild","createElement","getElementById","assignElement","_stitch","setupListeners","exclusions"];
	}

	setupListeners()
	{
		if (this.element) {
			this.element.addEventListener("click", this.onClick);
		}
	}

	setData(data)
	{
	}

	onClick(e)
	{
		return false;
	}

	onLeftKey(node?)
	{
		if (this.orientation === "horizontal") {
			if (node) {
				var sibling:any = node.previousSibling;
				while (sibling) {
					if (sibling.focus && sibling["stitched"]) {
						var focus:any = Core().Focus;
						if (focus && sibling.focus()) {
							focus.set(sibling);
							return;
						}
					}
					sibling = sibling.previousSibling;
				}
			}
		}
		var p:any = this.element.parentNode;
		if (p && p.onLeftKey) p.onLeftKey(this.element);
	}

	onRightKey(node?)
	{
		if (this.orientation === "horizontal") {
			if (node) {
				var sibling:any = node.nextSibling;
				while (sibling) {
					if (sibling.focus && sibling["stitched"]) {
						var focus:any = Core().Focus;
						if (focus && sibling.focus()) {
							focus.set(sibling);
							return;
						}
					}
					sibling = sibling.nextSibling;
				}
			}
		}
		var p:any = this.element.parentNode;
		if (p && p.onRightKey) p.onRightKey(this.element);
	}

	onUpKey(node?)
	{
		if (this.orientation === "vertical") {
			if (node) {
				var sibling:any = node.previousSibling;
				while (sibling) {
					if (sibling.focus && sibling["stitched"]) {
						var focus:any = Core().Focus;
						if (focus && sibling.focus()) {
							focus.set(sibling);
							return;
						}
					}
					sibling = sibling.previousSibling;
				}
			}
		}
		var p:any = this.element.parentNode;
		if (p && p.onUpKey) p.onUpKey(this.element);
	}

	onDownKey(node?)
	{
		if (this.orientation === "vertical") {
			if (node) {
				var sibling:any = node.nextSibling;
				while (sibling) {
					if (sibling.focus && sibling["stitched"]) {
						var focus:any = Core().Focus;
						if (focus && sibling.focus()) {
							focus.set(sibling);
							return;
						}
					}
					sibling = sibling.nextSibling;
				}
			}
		}
		var p:any = this.element.parentNode;
		if (p && p.onDownKey) p.onDownKey(this.element);
	}

	onEnterKey()
	{
		this.signal("action");
	}

	setOrientation(orientation)
	{
		this.orientation = orientation;
	}
}

export default View
Core().register("view", View, null);
