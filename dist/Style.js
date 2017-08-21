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
var Style = (function (_super) {
    __extends(Style, _super);
    function Style() {
        var _this = _super.call(this) || this;
        _this.obtype = "style";
        _this.styles = {};
        _this.element = null;
        return _this;
    }
    Style.prototype.$assignElement = function (node) {
        var rv = _super.prototype.$assignElement.call(this, node);
        this.element.innerHTML = this.$getBaoStyle();
        return rv;
    };
    Style.prototype.$getBaoStyle = function () {
        var rv = "";
        for (var selector in this.styles) {
            rv += " " + selector + " { " + this.styles[selector] + " } ";
        }
        return rv.trim();
    };
    Style.prototype.$addStyle = function (selector, rules) {
        var r = rules.join(" ");
        if (undefined !== this.styles[selector]) {
            if (r === this.styles[selector])
                return;
        }
        this.styles[selector] = r;
        this.element.innerHTML = this.$getBaoStyle();
    };
    Style.prototype.$removeStyle = function (selector) {
        if (this.styles[selector]) {
            delete this.styles[selector];
            this.element.innerHTML = this.$getBaoStyle();
        }
    };
    return Style;
}(View_1["default"]));
exports["default"] = Style;
Core_1["default"]().register("bao/style", Style, null);
