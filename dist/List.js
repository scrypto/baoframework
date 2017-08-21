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
var List = (function (_super) {
    __extends(List, _super);
    function List() {
        var _this = _super.call(this) || this;
        _this.obtype = "list";
        _this.translations = [];
        _this.translationComplete = true;
        _this.index = 0;
        _this.numRows = 0;
        _this.rowHeight = 0;
        return _this;
    }
    List.prototype.$createContent = function () {
        this.$createRowsFromChildren();
        if (Core_1["default"]().MetaConfig.$get("animation") !== "off") {
            Core_1["default"]().Style.$addStyle(".bao--listitem", [
                "background: transparent;",
                "-webkit-transition: -webkit-transform 0.25s, opacity 0.1s;",
                "-moz-transition: -moz-transform 0.25s, opacity 0.1s;",
                "-o-transition: -o-transform 0.25s, opacity 0.1s;",
                "transition: transform 0.25s, opacity 0.1s;"
            ]);
        }
        else {
            Core_1["default"]().Style.$remove(".bao--listitem");
        }
    };
    List.prototype.$createRowsFromChildren = function () {
        var id = this.element.getAttribute("id");
        this.numRows = this.element.children.length;
        for (var i = 0; i < this.numRows; i++) {
            var div = this.element.children[i];
            div.setAttribute("id", id + "_row_" + i);
            div.setAttribute("class", "bao--listitem");
            div.style.position = "relative";
            div.style.transform = "translateY(0px)";
            div.style.webkitTransform = "translateY(0px)";
            div.style.overflow = "hidden";
            div.addEventListener("transitioned", this.$transitionCompleted);
            div.addEventListener("webkitTransitionEnd", this.$transitionCompleted);
            div.addEventListener("oTransitionEnd", this.$transitionCompleted);
            div.addEventListener("MSTransitionEnd", this.$transitionCompleted);
            this.translations[i] = 0;
        }
    };
    List.prototype.$transitionCompleted = function (e) {
        if (!e || e.propertyName.indexOf("ransform") > 0) {
            if (this.translationComplete === false) {
                this.translationComplete = true;
                for (var i = 0; i < this.element.children.length; i++) {
                    var child = this.element.children[i];
                    child.style.visibility = "";
                    child.style.opacity = "1";
                }
                this.$focus();
            }
        }
    };
    List.prototype.$goUp = function () {
        if (this.index + 1 === this.numRows)
            return false;
        if (this.translationComplete === true) {
            this.index++;
            this.translationComplete = false;
            var t = 0;
            for (var i = 0; i < this.element.children.length; i++) {
                var child = this.element.children[i];
                // FIXME: if we change this to use the height of the current row,
                // we can have rows of varying height
                if (this.rowHeight === 0) {
                    var box = child.getBoundingClientRect();
                    this.rowHeight = box.height;
                }
                t = this.translations[i] - this.rowHeight;
                child.style.opacity = "1";
                child.style.transform = "translateY(" + t + "px)";
                child.style.webkitTransform = "translateY(" + t + "px)";
                this.translations[i] = t;
            }
            if (Core_1["default"]().MetaConfig.$get("animation") === "off") {
                this.$transitionCompleted(null);
            }
        }
        return true;
    };
    List.prototype.$goDown = function () {
        if (this.index === 0)
            return false;
        if (this.translationComplete === true) {
            this.index--;
            this.translationComplete = false;
            var t = 0;
            for (var i = 0; i < this.element.children.length; i++) {
                var child = this.element.children[i];
                // FIXME: if we change this to use the height of the previous row,
                // we can have rows of varying height
                if (this.rowHeight === 0) {
                    var box = child.getBoundingClientRect();
                    this.rowHeight = box.height;
                }
                t = this.translations[i] + this.rowHeight;
                child.style.opacity = "1";
                child.style.transform = "translateY(" + t + "px)";
                child.style.webkitTransform = "translateY(" + t + "px)";
                this.translations[i] = t;
            }
            if (Core_1["default"]().MetaConfig.$get("animation") === "off") {
                this.$transitionCompleted(null);
            }
        }
        return true;
    };
    List.prototype.$focus = function () {
        var child = this.element.children[this.index];
        if (child) {
            if ("function" === typeof child.focus) {
                if (child.$focus())
                    return true;
            }
        }
        return _super.prototype.$focus.call(this);
    };
    List.prototype.$onDownKey = function () {
        if (!this.$goUp())
            _super.prototype.$onDownKey.call(this);
    };
    List.prototype.$onUpKey = function () {
        if (!this.$goDown())
            _super.prototype.$onUpKey.call(this);
    };
    return List;
}(View_1["default"]));
exports["default"] = List;
Core_1["default"]().register("list", List, null);
