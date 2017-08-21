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
var Ajax = (function (_super) {
    __extends(Ajax, _super);
    function Ajax() {
        var _this = _super.call(this) || this;
        _this.obtype = "ajax";
        _this.request = new XMLHttpRequest();
        _this.request.addEventListener("readystatechange", _this.$onReadyStateChange);
        return _this;
    }
    Ajax.prototype.$addEventListener = function (ev, callback) {
        this.request.addEventListener(ev, callback);
    };
    Ajax.prototype.$open = function (method, url, async) {
        this.request.open(method, url, async);
    };
    Ajax.prototype.$send = function (data) {
        this.request.send(data);
    };
    Ajax.prototype.$setData = function (data) {
        this.signalData = data;
    };
    Ajax.prototype.$onReadyStateChange = function (e) {
        if (this.request.readyState === 4) {
            if (this.request.status < 400) {
                this.$signal("$loaded", this.signalData);
            }
            else {
                this.$signal("$error", this.signalData);
            }
        }
        else {
            this.$signal("$loading", this.signalData);
        }
        this.$signal("$readystatechange");
    };
    Ajax.prototype.$signal = function (type, data) {
        var ev = document.createEvent("Event");
        if (ev) {
            ev.initEvent(type, true, true);
            ev["sender"] = this.request;
            ev["signalData"] = data;
            this.request.dispatchEvent(ev);
        }
    };
    Ajax.prototype.$abort = function () {
        this.request.abort();
    };
    return Ajax;
}(View_1["default"]));
exports["default"] = Ajax;
Core_1["default"]().register("ajax", Ajax, null);
