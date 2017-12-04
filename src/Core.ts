export const $ = (id:string):any => {
	let node = document.getElementById($["prefix"]+id);
	if (!node) node = Core().NotFound;
	return node;
}
$["prefix"] = "";

let CoreImpl = {
	NotFound: document.createElement("object"),
	Style: null,
	Focus: null,
	DataStore: null,
	MetaConfig: null,
	initialised: false,
	components: {},
	cache: {},
	platform: {},
	currentTagName: null,
	register: function(type, constructor, rules)
	{
		type = type.toLowerCase();
		if (!CoreImpl.components[type]) {
			CoreImpl.components[type] = [];
		}
		if (rules === null) {
			CoreImpl.components[type][0] = {constructor: constructor, rules: rules};
		} else {
			if (CoreImpl.components[type].length === 0) {
				CoreImpl.components[type][0] = null;
			}
			CoreImpl.components[type].push({constructor: constructor, rules: rules});
		}
	},
	parseDOM: function(node?)
	{
		if (!node) node = document.body;
		if (!node["stitched"]) {
			if (node.attributes) {
				let type = node.getAttribute("data-type");
				if (type) {
					let obj = null;
					if (type == "bao/metaConfig") {
						obj = CoreImpl.MetaConfig;
					} else {
						CoreImpl.currentTagName = node.tagName;
						obj = CoreImpl.create(type);
						CoreImpl.currentTagName = null;
					}
					if (obj) {
						obj.$assignElement(node);
						if (type === "bao/focusManager") {
							CoreImpl.Focus = node;
						} else if (type === "bao/dataStore") {
							CoreImpl.DataStore = node;
						} else if (type === "bao/style") {
							CoreImpl.Style = node;
						}
					}
				}
			}
		}
		for (let i = 0; i < node.children.length; i++) {
			let child = node.children[i];
			if (child) CoreImpl.parseDOM(child);
		}
	},
	create: function(type)
	{
		type = type.toLowerCase();
		if (CoreImpl.cache[type]) {
			let component = CoreImpl.cache[type];
			return new component.constructor();
		}

		let rv = null;

		if (CoreImpl.components) {
			if (CoreImpl.components[type] && CoreImpl.components[type].length > 0) {
				for (let i = 1; i < CoreImpl.components[type].length; i++) {
					let component = CoreImpl.components[type][i];
					if (CoreImpl.check(component)) {
						CoreImpl.cache[type] = component;
						rv = new component.constructor();
						break;
					}
				}

				if (!rv && CoreImpl.check(CoreImpl.components[type][0])) {
					CoreImpl.cache[type] = CoreImpl.components[type][0];
					rv = new CoreImpl.components[type][0].constructor();
				}
			}
		}
		if (rv) {
			for (let prop in rv) {
				if (prop[0] === "$" && typeof rv[prop] === "function") {
					CoreImpl.NotFound[prop] = function() {
						console.warn("DANGER: you are calling a function for an object that was not found. This is bad.");
						return false;
					}
				}
			}
		}
		return rv;
	},
	check: function(component)
	{
		if (!CoreImpl.initialised) CoreImpl.getPlatform();

		if (!component) return false;

		if (component.rules) {
			if (!CoreImpl.initialised) {
				return false;
			}
			if (CoreImpl.currentTagName && component.rules.tag) {
				if (CoreImpl.currentTagName.toLowerCase() != component.rules.tag.toLowerCase()) {
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
				if (component.rules.os != CoreImpl.platform["os"]) {
					return false;
				}
			}
			if (component.rules.osVersion) {
				if (component.rules.osVersion != CoreImpl.platform["osVersion"]) {
					return false;
				}
			}
			if (component.rules.browser) {
				if (component.rules.browser != CoreImpl.platform["browser"]) {
					return false;
				}
			}
			if (component.rules.browserVersion) {
				if (component.rules.browserVersion != CoreImpl.platform["browserVersion"]) {
					return false;
				}
			}
		}
		return true;
	},
	getPlatform: function()
	{
		if (navigator.appVersion.indexOf("Windows NT 6.1") > 0) {
			CoreImpl.platform["os"] = "Windows";
			CoreImpl.platform["osVersion"] = "7";
		} else if (navigator.appVersion.indexOf("iPad") > 0) {
			CoreImpl.platform["os"] = "iOS";
			CoreImpl.platform["hardware"] = "tablet";
		} else if (navigator.appVersion.indexOf("iPhone") > 0) {
			CoreImpl.platform["os"] = "iOS";
			CoreImpl.platform["hardware"] = "phone";
		} else if (navigator.userAgent.indexOf("Android") > 0) {
			CoreImpl.platform["os"] = "Android";
			CoreImpl.platform["hardware"] = "tablet";
			if (navigator.userAgent.toLowerCase().indexOf("mobile") > 0) {
				CoreImpl.platform["hardware"] = "phone";
			}
		} else if (navigator.platform == "MacIntel") {
			CoreImpl.platform["os"] = "OSX";
		} else if (navigator.appVersion.indexOf("Trident/7.0") > 0) {
			CoreImpl.platform["browser"] = "IE";
			if (navigator.appVersion.indexOf("rv:11.0") > 0) {
				CoreImpl.platform["browserVersion"] = "11";
			}
		}
		CoreImpl.initialised = true;
	},
	setup()
	{
		CoreImpl.getPlatform();
		CoreImpl.MetaConfig = CoreImpl.create("bao/metaConfig");

		document["parseDOM"] = (node?) => CoreImpl.parseDOM(node);
		window["Core"] = (type?) => Core(type);
		CoreImpl.parseDOM(document.head);

		if (!CoreImpl.Style) {
			let obj = CoreImpl.createObject("bao/style", null, "style");
			obj.removeAttribute("style");
			let child = document.head.firstChild;
			if (child) document.head.insertBefore(obj, child);
			else document.head.appendChild(obj);
			CoreImpl.parseDOM(document.head);
		}

		CoreImpl.parseDOM();
		let reparse = false;

		if (!CoreImpl.Focus) {
			let obj = CoreImpl.createObject("bao/focusManager");
			document.body.appendChild(obj);
			reparse = true;
		}
		if (!CoreImpl.DataStore) {
			let obj = CoreImpl.createObject("bao/dataStore");
			document.body.appendChild(obj);
			reparse = true;
		}
		if (!CoreImpl.MetaConfig.element) {
			let obj = CoreImpl.MetaConfig.$createElement("object");
			obj.setAttribute("id", "bao/metaConfig");
			obj.setAttribute("data-type", "bao/metaConfig");
			obj.style.width = "0px"; obj.style.height = "0px";
			obj.style.left = "0px"; obj.style.right = "0px";
			obj.style.opacity = "0"; obj.style.position = "fixed";
			document.body.appendChild(obj);
		}
		if (reparse) CoreImpl.parseDOM();
	},
	createObject(id, type?, tag?)
	{
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
}

export default function Core(type?)
{
	if (type) return CoreImpl.create(type);
	else return CoreImpl;
}

window.addEventListener("load", () => CoreImpl.setup());

import "./Style"
import "./DataStore"
import "./Focus"
import "./Meta"
