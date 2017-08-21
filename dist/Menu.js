"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var View_1 = require("./View");
var Core_1 = require("./Core");
var MenuItem = (function (_super) {
    __extends(MenuItem, _super);
    function MenuItem() {
        var _this = _super.call(this) || this;
        _this.obtype = "menuitem";
        _this.label = "";
        _this.color = "";
        _this.action = null;
        _this.active = false;
        return _this;
    }
    MenuItem.prototype.$setData = function (data) {
        if (undefined !== data["label"])
            this.$setLabel(data["label"]);
        if (undefined !== data["color"])
            this.$setColor(data["color"]);
        if (undefined !== data["action"])
            this.$setAction(data["action"]);
        if (undefined !== data["id"])
            this.$setId(data["id"]);
        if (undefined !== data["active"])
            this.$setId(data["active"]);
    };
    MenuItem.prototype.$setLabel = function (label) {
        this.label = label;
        this.element.innerHTML = this.color + this.label;
    };
    MenuItem.prototype.$setColor = function (color) {
        if (color === false) {
            this.color = "";
            this.element.innerHTML = this.label;
        }
        else {
            if (!color)
                color = "none";
            this.element.style.overflow = "visible";
            this.color = "<div class='" + color + "'></div>";
            this.element.innerHTML = this.color + this.label;
        }
    };
    MenuItem.prototype.$setAction = function (action) {
        this.action = action;
    };
    MenuItem.prototype.$setActive = function (active) {
        this.active = active;
        if (this.active)
            this.$addClass("active");
        else
            this.$removeClass("active");
    };
    MenuItem.prototype.$onEnterKey = function () {
        this.$signal("$action", this.action);
    };
    MenuItem.prototype.$onClick = function (e) {
        this.$onEnterKey();
        if (e.stopPropagation)
            e.stopPropagation();
        if (e.preventDefault)
            e.preventDefault();
        return false;
    };
    return MenuItem;
}(View_1["default"]));
Core_1["default"]().register("menuitem", MenuItem, null);
var Menu = (function (_super) {
    __extends(Menu, _super);
    function Menu() {
        var _this = _super.call(this) || this;
        _this.selectedEntry = null;
        _this.obtype = "menu";
        return _this;
    }
    Menu.prototype.$setData = function (entries) {
        this.element.innerHTML = "";
        this.selectedEntry = null;
        for (var i = 0; i < entries.length; i++) {
            var entry = this.$createMenuEntry(entries[i]);
            if (entry)
                this.$appendChild(entry);
        }
    };
    Menu.prototype.$createMenuEntry = function (entry) {
        var rv = Core_1["default"]("menuitem").$createElement("div");
        if (!entry["label"])
            entry["label"] = "&#160;";
        rv.addEventListener("action", this.$onMenuItemAction);
        rv.$setData(entry);
        if (entry["selected"] === true && !this.selectedEntry) {
            rv.$setActive(true);
            this.selectedEntry = rv;
        }
        return rv;
    };
    Menu.prototype.$onMenuItemAction = function (e) {
        this.$signal("$action", e.signalData);
        if (e.stopPropagation)
            e.stopPropagation();
        if (e.preventDefault)
            e.preventDefault();
        return false;
    };
    Menu.prototype.$focus = function (obj) {
        var f = Core_1["default"]().Focus;
        var node = this.element.firstChild;
        while (node) {
            if (node.obtype === "menuitem") {
                f.$blur(node);
            }
            node = node.nextSibling;
        }
        if (obj && obj.obtype === "menuitem") {
            f.$set(obj);
        }
        else if (this.selectedEntry) {
            f.$set(this.selectedEntry);
        }
        else {
            var node_1 = this.element.firstChild;
            while (node_1) {
                if (node_1.obtype === "menuitem") {
                    f.$set(node_1);
                    break;
                }
                node_1 = node_1.nextSibling;
            }
        }
        return true;
    };
    Menu.prototype.$setSelectedEntry = function (entry) {
        if (this.selectedEntry) {
            this.selectedEntry.$removeClass("selected");
        }
        this.selectedEntry = entry;
        if (entry)
            this.selectedEntry.$addClass("selected");
    };
    return Menu;
}(View_1["default"]));
exports["default"] = Menu;
Core_1["default"]().register("menu", Menu, null);
