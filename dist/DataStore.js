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
var DataStore = (function (_super) {
    __extends(DataStore, _super);
    function DataStore() {
        var _this = _super.call(this) || this;
        _this.obtype = "datastore";
        return _this;
    }
    DataStore.prototype.$set = function (key, data) {
        // do we want to check to see if the data has changed or not?
        this.$broadcastDataChanges(key, data);
    };
    DataStore.prototype.$setMany = function (obj) {
        for (var key in obj) {
            this.$broadcastDataChanges(key, obj[key]);
        }
    };
    DataStore.prototype.$broadcastDataChanges = function (key, data, node) {
        if (!node)
            node = document.body;
        var child = node.firstChild;
        while (child) {
            if (child["stitched"]) {
                var ds = child.getAttribute("data-source");
                try {
                    if (ds === key)
                        child.$setData(data);
                }
                catch (e) {
                    console.log("broadcastData exception: ", e);
                }
            }
            this.$broadcastDataChanges(key, data, child);
            child = child.nextSibling;
        }
    };
    DataStore.prototype.$exclusions = function () {
        return _super.prototype.$exclusions.call(this).concat(["broadcastDataChanges", "focus"]);
    };
    return DataStore;
}(View_1["default"]));
exports["default"] = DataStore;
Core_1["default"]().register("bao/dataStore", DataStore, null);
