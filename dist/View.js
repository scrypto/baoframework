"use strict";
exports.__esModule = true;
var Core_1 = require("./Core");
var View = (function () {
    function View() {
        this.obtype = "view";
        this.element = null;
        this.initialised = false;
        this.orientation = "none";
        this.$bind();
    }
    View.prototype.$createElement = function (type) {
        if (this.initialised === true)
            throw new Error("Already attached");
        this.element = document.createElement(type);
        if (this.element["stitched"])
            throw new Error("DOM element already attached");
        this.$_stitch();
        this.$createContent();
        return this.element;
    };
    View.prototype.$getElementById = function (id) {
        if (this.initialised === true)
            throw new Error("Already attached");
        this.element = document.getElementById(id);
        if (!this.element)
            throw new Error("Cannot find element with id " + id);
        if (this.element["stitched"])
            throw new Error("DOM element already attached");
        this.$_stitch();
        this.$createContent();
        return this.element;
    };
    View.prototype.$assignElement = function (obj) {
        if (this.initialised === true)
            throw new Error("Already attached");
        this.element = obj;
        if (!this.element)
            throw new Error("Object is null");
        if (this.element["stitched"])
            throw new Error("DOM element already attached");
        this.$_stitch();
        this.$createContent();
        return this.element;
    };
    View.prototype.$createContent = function () {
    };
    View.prototype.$appendChild = function (child) {
        this.element.appendChild(child);
    };
    View.prototype.$setId = function (id) {
        if (!this.initialised)
            throw new Error("Not initialised");
        this.element.setAttribute("id", id);
    };
    View.prototype.$position = function (x, y, w, h) {
        if (!this.initialised)
            throw new Error("Not initialised");
        this.$move(x, y);
        this.$resize(w, h);
    };
    View.prototype.$move = function (x, y) {
        if (!this.initialised)
            throw new Error("Not initialised");
        if (x !== false)
            this.element.style.left = x;
        if (y !== false)
            this.element.style.top = y;
    };
    View.prototype.$resize = function (w, h) {
        if (!this.initialised)
            throw new Error("Not initialised");
        if (w !== false)
            this.element.style.width = w;
        if (h !== false)
            this.element.style.height = h;
    };
    View.prototype.$focus = function () {
        if (this.element.getAttribute("data-focus") === "nofocus") {
            return false;
        }
        var f = Core_1["default"]().Focus;
        var n = this.element.firstChild;
        while (n) {
            if (n["stitched"]) {
                if (n.$focus && n.$focus()) {
                    f.$set(n);
                    return true;
                }
            }
            n = n.nextSibling;
        }
        if (!this.$hasClass("focused")) {
            this.$addClass("focused");
            this.$signal("$focus");
        }
        return true;
    };
    View.prototype.$blur = function () {
        if (this.$hasClass("focused")) {
            this.$removeClass("focused");
            this.$signal("$blur");
        }
    };
    View.prototype.$addClass = function (cls) {
        if (!this.initialised)
            throw new Error("Not initialised");
        if (this.$hasClass(cls))
            return;
        var clss = (this.element.getAttribute("class") || "").split(" ");
        clss.push(cls);
        this.element.setAttribute("class", clss.join(" "));
        return this;
    };
    View.prototype.$hasClass = function (cls) {
        if (!this.initialised)
            throw new Error("Not initialised");
        var clss = (this.element.getAttribute("class") || "").split(" ");
        return (clss.indexOf(cls) > -1);
    };
    View.prototype.$removeClass = function (cls) {
        if (!this.initialised)
            throw new Error("Not initialised");
        if (this.$hasClass(cls)) {
            var clss = (this.element.getAttribute("class") || "").split(" ");
            var n = [];
            for (var i = 0; i < clss.length; i++) {
                if (cls != clss[i])
                    n.push(clss[i]);
            }
            this.element.setAttribute("class", n.join(" "));
        }
    };
    View.prototype.$signal = function (type, data) {
        if (!this.initialised)
            throw new Error("Not initialised");
        if (this.element) {
            var ev = document.createEvent("Event");
            if (ev) {
                ev.initEvent(type, true, true);
                ev["sender"] = this.element;
                ev["signalData"] = data;
                this.element.dispatchEvent(ev);
            }
        }
    };
    View.prototype.$preventDefault = function (e) {
        if (e.preventDefault)
            e.preventDefault();
        if (e.stopPropagation)
            e.stopPropagation();
    };
    View.prototype.$bind = function () {
        for (var member in this) {
            if ("function" === typeof this[member]) {
                this[member] = this[member].bind(this);
            }
        }
    };
    View.prototype.$_stitch = function () {
        var exclude = this.$exclusions();
        for (var member in this) {
            if ("function" === typeof this[member]) {
                if (exclude.indexOf(member) > -1)
                    continue;
                if (exclude.indexOf(member.substr(1)) > -1)
                    continue;
                if (member.indexOf("_") === 0)
                    continue;
                try {
                    this.element[member] = this[member];
                }
                catch (e) { }
            }
        }
        this.element["stitched"] = true;
        this.element["obtype"] = this.obtype;
        this.initialised = true;
        this.$addClass("bao--" + this.obtype);
        var orientation = this.element.getAttribute("data-orientation");
        if (orientation)
            this.$setOrientation(orientation);
        this.$setupListeners();
    };
    View.prototype.$exclusions = function () {
        return ["constructor", "appendChild", "createElement", "getElementById", "assignElement", "_stitch", "setupListeners", "exclusions"];
    };
    View.prototype.$setupListeners = function () {
        if (this.element) {
            this.element.addEventListener("click", this.$onClick);
        }
    };
    View.prototype.$setData = function (data) {
        if (data) {
            if (typeof data == "string" || data["innerHTML"]) {
                this.element.innerHTML = data["innerHTML"];
                Core_1["default"]().parseDOM(this.element);
            }
            else if (data["addClass"]) {
                this.element.classList.add(data["addClass"]);
            }
            else if (data["removeClass"]) {
                this.element.classList.remove(data["removeClass"]);
            }
            else if (data["innerTEXT"]) {
                var t = document.createTextNode(data["innerTEXT"]);
                this.element.innerHTML = "";
                this.element.appendChild(t);
            }
        }
    };
    View.prototype.$onClick = function (e) {
        return false;
    };
    View.prototype.$onLeftKey = function (node) {
        if (this.orientation.indexOf("horizontal") >= 0) {
            if (node) {
                var sibling = node.previousSibling;
                while (sibling) {
                    if (sibling.$focus && sibling["stitched"]) {
                        var focus = Core_1["default"]().Focus;
                        if (focus && sibling.$focus()) {
                            focus.$set(sibling);
                            return;
                        }
                    }
                    sibling = sibling.previousSibling;
                }
            }
        }
        var p = this.element.parentNode;
        while (p) {
            if (p && p.$onDownKey) {
                p.$onLeftKey(this.element);
                break;
            }
            p = p.parentNode;
        }
    };
    View.prototype.$onRightKey = function (node) {
        if (this.orientation.indexOf("horizontal") >= 0) {
            if (node) {
                var sibling = node.nextSibling;
                while (sibling) {
                    if (sibling.$focus && sibling["stitched"]) {
                        var focus = Core_1["default"]().Focus;
                        if (focus && sibling.$focus()) {
                            focus.$set(sibling);
                            return;
                        }
                    }
                    sibling = sibling.nextSibling;
                }
            }
        }
        var p = this.element.parentNode;
        while (p) {
            if (p && p.$onDownKey) {
                p.$onRightKey(this.element);
                break;
            }
            p = p.parentNode;
        }
    };
    View.prototype.$onUpKey = function (node) {
        if (this.orientation.indexOf("vertical") >= 0) {
            if (node) {
                var sibling = node.previousSibling;
                while (sibling) {
                    if (sibling.$focus && sibling["stitched"]) {
                        var focus = Core_1["default"]().Focus;
                        if (focus && sibling.$focus()) {
                            focus.$set(sibling);
                            return;
                        }
                    }
                    sibling = sibling.previousSibling;
                }
            }
        }
        var p = this.element.parentNode;
        while (p) {
            if (p && p.$onDownKey) {
                p.$onUpKey(this.element);
                break;
            }
            p = p.parentNode;
        }
    };
    View.prototype.$onDownKey = function (node) {
        if (this.orientation.indexOf("vertical") >= 0) {
            if (node) {
                var sibling = node.nextSibling;
                while (sibling) {
                    if (sibling.$focus && sibling["stitched"]) {
                        var focus = Core_1["default"]().Focus;
                        if (focus && sibling.$focus()) {
                            focus.$set(sibling);
                            return;
                        }
                    }
                    sibling = sibling.nextSibling;
                }
            }
        }
        var p = this.element.parentNode;
        while (p) {
            if (p && p.$onDownKey) {
                p.$onDownKey(this.element);
                break;
            }
            p = p.parentNode;
        }
    };
    View.prototype.$onEnterKey = function () {
        this.$signal("$action");
    };
    View.prototype.$setOrientation = function (orientation) {
        this.orientation = orientation;
    };
    return View;
}());
exports["default"] = View;
Core_1["default"]().register("view", View, null);
