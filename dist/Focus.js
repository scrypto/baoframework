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
var Core_1 = require("./Core");
var View_1 = require("./View");
var Focus = (function (_super) {
    __extends(Focus, _super);
    function Focus() {
        var _this = _super.call(this) || this;
        _this.obtype = "focus";
        _this.focusedElement = null;
        return _this;
    }
    Focus.prototype.$set = function (widget) {
        if (this.focusedElement !== widget) {
            if (this.focusedElement)
                this.focusedElement.$blur();
            this.focusedElement = widget;
            if (!this.focusedElement.$hasClass("focus")) {
                this.focusedElement.$focus();
            }
        }
    };
    Focus.prototype.$blur = function () {
        var w = this.focusedElement;
        this.focusedElement = null;
        if (w)
            w.$blur();
    };
    Focus.prototype.$get = function () {
        return this.focusedElement;
    };
    Focus.prototype.$exclusions = function () {
        return _super.prototype.$exclusions.call(this).concat(["focus"]);
    };
    return Focus;
}(View_1["default"]));
exports["default"] = Focus;
Core_1["default"]().register("bao/focusManager", Focus, null);
