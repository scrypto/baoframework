export interface _$ {
	(id:string): any,
	prefix: string,
	NotFound: HTMLElement,
	NotFoundBehaviours: any,
	NotFoundBehaviour: number,

	Style: any,
	Focus: any,
	DataStore: any,
	MetaConfig: any,

	// public functions
	register(type, constructor, rules): any,
	parseDOM(node? : HTMLElement): any,
	create(type): any,
	setup(): any
}

// $ implementation
export const $ = <_$>function(id:string):any {
	let node = document.getElementById($.prefix+id);
	if (!node) node = $.NotFound;
	return node;
}

// "private" functions
let getPlatform = () => {
	if (navigator.appVersion.indexOf("Windows NT 6.1") > 0) {
		platform["os"] = "Windows";
		platform["osVersion"] = "7";
	} else if (navigator.appVersion.indexOf("iPad") > 0) {
		platform["os"] = "iOS";
		platform["hardware"] = "tablet";
	} else if (navigator.appVersion.indexOf("iPhone") > 0) {
		platform["os"] = "iOS";
		platform["hardware"] = "phone";
	} else if (navigator.userAgent.indexOf("Android") > 0) {
		platform["os"] = "Android";
		platform["hardware"] = "tablet";
		if (navigator.userAgent.toLowerCase().indexOf("mobile") > 0) {
			platform["hardware"] = "phone";
		}
	} else if (navigator.platform == "MacIntel") {
		platform["os"] = "OSX";
	} else if (navigator.appVersion.indexOf("Trident/7.0") > 0) {
		platform["browser"] = "IE";
		if (navigator.appVersion.indexOf("rv:11.0") > 0) {
			platform["browserVersion"] = "11";
		}
	}
	initialised = true;
};

let check = (component) => {
	if (!initialised) getPlatform();

	if (!component) return false;

	if (component.rules) {
		if (!initialised) {
			return false;
		}
		if (currentTagName && component.rules.tag) {
			if (currentTagName.toLowerCase() != component.rules.tag.toLowerCase()) {
				return false;
			}
		}
		if (component.rules.ua) {
			if (typeof component.rules.ua == "string") {
				if (navigator.userAgent.indexOf(component.rules.ua) === -1) {
					return false;
				}
			} else {
				if (component.rules.ua.exec(navigator.userAgent) === null) {
					return false;
				}
			}
		}
		if (component.rules.os) {
			if (component.rules.os != platform["os"]) {
				return false;
			}
		}
		if (component.rules.osVersion) {
			if (component.rules.osVersion != platform["osVersion"]) {
				return false;
			}
		}
		if (component.rules.browser) {
			if (component.rules.browser != platform["browser"]) {
				return false;
			}
		}
		if (component.rules.browserVersion) {
			if (component.rules.browserVersion != platform["browserVersion"]) {
				return false;
			}
		}
	}
	return true;
};

let createObject = (id, type?, tag?) => {
	if (!type) type = id;
	if (!tag) tag = "object";
	let obj = document.createElement(tag);
	if (obj.style) {
		obj.style.width = "0px"; obj.style.height = "0px";
		obj.style.left = "0px"; obj.style.right = "0px";
		obj.style.opacity = "0"; obj.style.position = "fixed";
	}
	obj.setAttribute("id", id);
	obj.setAttribute("data-type", type);
	return obj;
}

let ObjectNotFound = function() {
	switch ($.NotFoundBehaviour) {
		case $.NotFoundBehaviours.IGNORE:
			break;
		case $.NotFoundBehaviours.WARNING:
			console.warn("DANGER: you are calling a function for an object that was not found. This is bad.");
			break;
		case $.NotFoundBehaviours.EXCEPTION:
			throw new Error("DANGER: you are calling a function for an object that was not found. This is bad.");
	}
	return false;
}

// private properties
let initialised = false;
let components = {};
let cache = {};
let platform = {};
let currentTagName = null;

// public properties
$.prefix = "";
$.NotFound = document.createElement("object");
$.NotFoundBehaviours = { IGNORE: 0, WARNING: 1, EXCEPTION: 2 };
$.NotFoundBehaviour = $.NotFoundBehaviours.IGNORE;

$.Style = null;
$.Focus = null;
$.DataStore = null;
$.MetaConfig = null;

// public functions

// register
//
// This function registers an object with the framework
$.register = (type, constructor, rules) => {
	type = type.toLowerCase();
	if (!components[type]) {
		components[type] = [];
	}
	if (rules === null) {
		components[type][0] = { constructor: constructor, rules: rules };
	} else {
		if (components[type].length === 0) {
			components[type][0] = null;
		}
		components[type].push({ constructor: constructor, rules: rules });
	}
};

// parseDOM
//
// This function parses the DOM tree at the provided node (or the document root if none provided)
// and will create framework objects based on the value in the data-type attribute
$.parseDOM = (root : HTMLElement = document.body) => {
	[
		root,
		...Array.prototype.slice.call(root.querySelectorAll("[data-type]") as any),
	].forEach((node) => {
		if (!node["stitched"]) {
			const type = node.getAttribute("data-type");
			if (type) {
				let obj = null;
				if (type === "bao/metaConfig") {
					obj = $.MetaConfig;
				} else {
					currentTagName = node.tagName;
					obj = $.create(type);
					currentTagName = null;
				}
				if (obj) {
					obj.$assignElement(node);
					if (type === "bao/focusManager") {
						$.Focus = node;
					} else if (type === "bao/dataStore") {
						$.DataStore = node;
					} else if (type === "bao/style") {
						$.Style = node;
					}
				}
			}
		}
	});
};

// create
//
// This function will create an object based of the value of the type parameter
$.create = (type) => {
	type = type.toLowerCase();
	if (cache[type]) {
		let component = cache[type];
		return new component.constructor();
	}

	let rv = null;

	if (components) {
		if (components[type] && components[type].length > 0) {
			for (let i = 1; i < components[type].length; i++) {
				let component = components[type][i];
				if (check(component)) {
					cache[type] = component;
					rv = new component.constructor();
					break;
				}
			}

			if (!rv && check(components[type][0])) {
				cache[type] = components[type][0];
				rv = new components[type][0].constructor();
			}
		}
	}
	if (rv) {
		for (let prop in rv) {
			if (prop[0] === "$" && typeof rv[prop] === "function") {
				if (!$.NotFound[prop]) $.NotFound[prop] = ObjectNotFound;
			}
		}
	}
	return rv;
};

// setup
//
// This function will set up the framework and start parsing the DOM
$.setup = () => {
	getPlatform();
	$.MetaConfig = $.create("bao/metaConfig");

	document["parseDOM"] = (node?) => $.parseDOM(node);
	window["Core"] = (type?) => $.create(type);

	$.parseDOM(document.head);

	if (!$.Style) {
		let obj = createObject("bao/style", null, "style");
		obj.removeAttribute("style");
		let child = document.head.firstChild;
		if (child) document.head.insertBefore(obj, child);
		else document.head.appendChild(obj);
		$.parseDOM(document.head);
	}

	$.parseDOM();
	let reparse = false;

	if (!$.Focus) {
		let obj = createObject("bao/focusManager");
		document.body.appendChild(obj);
		reparse = true;
	}
	if (!$.DataStore) {
		let obj = createObject("bao/dataStore");
		document.body.appendChild(obj);
		reparse = true;
	}
	if (!$.MetaConfig.element) {
		let obj = $.MetaConfig.$createElement("object");
		obj.setAttribute("id", "bao/metaConfig");
		obj.setAttribute("data-type", "bao/metaConfig");
		obj.style.width = "0px"; obj.style.height = "0px";
		obj.style.left = "0px"; obj.style.right = "0px";
		obj.style.opacity = "0"; obj.style.position = "fixed";
		document.body.appendChild(obj);
	}
	if (reparse) $.parseDOM();

	let ev = document.createEvent("Event");
	if (ev) {
		ev.initEvent("$ready", true, true);
		window.dispatchEvent(ev);
	}

	window.removeEventListener("load", $.setup);
};

// Keep the Core function as the default export for backward compatibility
export default function Core(type?)
{
	if (type) return $.create(type);
	else return $;
}

window.addEventListener("load", $.setup);

import "./Style"
import "./DataStore"
import "./Focus"
import "./Meta"
