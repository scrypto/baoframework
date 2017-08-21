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
var Grid = (function (_super) {
    __extends(Grid, _super);
    function Grid() {
        var _this = _super.call(this) || this;
        _this.obtype = "grid";
        _this.numRows = 10;
        _this.numCols = 10;
        _this.rowIndex = 0;
        _this.colIndex = 0;
        _this.tileType = "view";
        return _this;
    }
    Grid.prototype.$createContent = function () {
        this.element.style.whiteSpace = "nowrap";
        this.$createTiles();
    };
    Grid.prototype.$createTiles = function () {
        var id = this.element.getAttribute("id");
        this.element.innerHTML = "";
        for (var row = 0; row < this.numRows; row++) {
            for (var col = 0; col < this.numCols; col++) {
                var div = document.createElement("div");
                div.setAttribute("id", id + "_tile_" + col + "x" + row);
                div.setAttribute("class", "bao--griditem");
                div.setAttribute("data-type", this.tileType);
                div.style.display = "inline-block";
                div.style.position = "relative";
                div.addEventListener("$action", this.onTileAction);
                this.element.appendChild(div);
            }
            var br = document.createElement("br");
            this.element.appendChild(br);
        }
        Core_1["default"]().parseDOM(this.element);
    };
    Grid.prototype.$setData = function (data) {
        if (data) {
            var rows = -1;
            var cols = -1;
            if (data["rows"])
                rows = data["rows"];
            if (data["cols"])
                cols = data["cols"];
            if (rows > -1 && cols > -1) {
                this.numRows = rows;
                this.numCols = cols;
                this.$createTiles();
            }
            if (data["content"]) {
                var len = data["content"].length;
                var divs = this.element.getElementsByTagName("div");
                if (len > divs.length)
                    len = divs.length;
                for (var i = 0; i < len; i++) {
                    var entry = data["content"][i];
                    this.$setTileContent(divs[i], entry);
                }
            }
        }
    };
    Grid.prototype.$setTileContent = function (element, data) {
        if (data && data["innerHTML"]) {
            element.innerHTML = data["innerHTML"];
        }
    };
    Grid.prototype.onTileAction = function (e) {
        this.$signal("$action", e.sender);
    };
    Grid.prototype.$focus = function () {
        this._updateFocus();
        return true;
    };
    Grid.prototype.$onDownKey = function (node) {
        if (this.rowIndex === this.numRows - 1) {
            _super.prototype.$onDownKey.call(this, this.element);
        }
        else {
            this.rowIndex++;
            this._updateFocus();
        }
    };
    Grid.prototype.$onUpKey = function (node) {
        if (this.rowIndex === 0) {
            _super.prototype.$onUpKey.call(this, this.element);
        }
        else {
            this.rowIndex--;
            this._updateFocus();
        }
    };
    Grid.prototype.$onLeftKey = function (node) {
        if (this.colIndex === 0) {
            _super.prototype.$onLeftKey.call(this, this.element);
        }
        else {
            this.colIndex--;
            this._updateFocus();
        }
    };
    Grid.prototype.$onRightKey = function (node) {
        if (this.colIndex === this.numCols - 1) {
            _super.prototype.$onRightKey.call(this, this.element);
        }
        else {
            this.colIndex++;
            this._updateFocus();
        }
    };
    Grid.prototype._updateFocus = function () {
        var i = this.rowIndex * (this.numCols + 1) + this.colIndex;
        var focus = Core_1["default"]().Focus;
        focus.$set(this.element.children[i]);
    };
    return Grid;
}(View_1["default"]));
exports["default"] = Grid;
Core_1["default"]().register("grid", Grid, null);
