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
var Meta = (function (_super) {
    __extends(Meta, _super);
    function Meta() {
        var _this = _super.call(this) || this;
        _this.$readMetaTags();
        return _this;
    }
    Meta.prototype.$get = function (key) {
        if (this.nvp[key] !== undefined)
            return this.nvp[key];
        return this.nvp["bao/" + key];
    };
    Meta.prototype.$set = function (key, value) {
        if (key.indexOf("bao/") === 0) {
            if (this.nvp[key] !== undefined) {
                this.nvp[key] = value;
                return;
            }
            key = key.substring(4);
        }
        this.nvp[key] = value;
    };
    Meta.prototype.$readMetaTags = function () {
        var tags = document.getElementsByTagName("meta");
        this.nvp = [];
        for (var i = 0; i < tags.length; i++) {
            var tag = tags[i];
            if (tag.attributes) {
                var name_1 = tag.getAttribute("name");
                if (name_1) {
                    var content = tag.getAttribute("content");
                    if (name_1.indexOf("bao/") === 0) {
                        this.nvp[name_1] = content;
                    }
                }
            }
        }
    };
    Meta.prototype.$exclusions = function () {
        return _super.prototype.$exclusions.call(this).concat(["focus"]);
    };
    return Meta;
}(View_1["default"]));
exports["default"] = Meta;
Core_1["default"]().register("bao/metaConfig", Meta, null);
