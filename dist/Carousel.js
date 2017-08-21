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
var Carousel = (function (_super) {
    __extends(Carousel, _super);
    function Carousel() {
        var _this = _super.call(this) || this;
        _this.obtype = "carousel";
        _this.tileWidth = 300;
        _this.numTiles = 10;
        _this.translations = [];
        _this.translationComplete = true;
        _this.index = 0;
        _this.focusIndex = 1;
        _this.outerIndex = 0;
        _this.wrap = true;
        _this.transform = true;
        return _this;
    }
    Carousel.prototype.$setTileWidth = function (width) {
        if (this.element && this.element.children) {
            for (var i = 0; i < this.element.children.length; i++) {
                var t = this.translations[i] + this.tileWidth - width;
                this.translations[i] = t;
                var child = this.element.children[i];
                child.style.width = width + "px";
                child.style.transform = "translateX(" + this.translations[i] + "px)";
                child.style.webkitTransform = "translateX(" + this.translations[i] + "px)";
            }
        }
        this.tileWidth = width;
    };
    Carousel.prototype.$setWrap = function (wrap) {
        if (this.wrap !== wrap) {
            var offset = wrap ? (0 - this.tileWidth) : 0;
            for (var i = 0; i < this.element.children.length; i++) {
                this.translations[i] = offset;
                var child = this.element.children[i];
                child.style.transform = "translateX(" + this.translations[i] + "px)";
                child.style.webkitTransform = "translateX(" + this.translations[i] + "px)";
            }
            this.wrap = wrap;
            this.focusIndex = wrap ? 1 : 0;
        }
    };
    Carousel.prototype.$createContent = function () {
        if (Core_1["default"]().MetaConfig.$get("animation") !== "off") {
            Core_1["default"]().Style.$addStyle(".bao--carouselitem", [
                "background: transparent;",
                "-webkit-transition: -webkit-transform 0.25s, opacity 0.1s;",
                "-moz-transition: -moz-transform 0.25s, opacity 0.1s;",
                "-o-transition: -o-transform 0.25s, opacity 0.1s;",
                "transition: transform 0.25s, opacity 0.1s;"
            ]);
        }
        else {
            Core_1["default"]().Style.$removeStyle(".bao--carouselitem");
        }
        this.element.style.whiteSpace = "nowrap";
        this.element.setAttribute("data-orientation", "horizontal");
        this.$createTiles();
    };
    Carousel.prototype.$createTiles = function (max) {
        if (undefined === max)
            max = this.numTiles;
        this.translationComplete = true;
        this.index = 0;
        this.focusIndex = 1;
        this.outerIndex = 0;
        this.wrap = true;
        if (undefined !== max)
            max = this.numTiles;
        this.element.innerHTML = "";
        var id = this.element.getAttribute("id");
        for (var i = 0; i < this.numTiles; i++) {
            var div = document.createElement("div");
            div.setAttribute("id", id + "_tile_" + i);
            div.setAttribute("class", "bao--carouselitem");
            div.style.display = "inline-block";
            div.style.position = "relative";
            div.style.transform = "translateX(-" + this.tileWidth + "px)";
            div.style.webkitTransform = "translateX(-" + this.tileWidth + "px)";
            div.style.width = this.tileWidth + "px";
            div.style.height = "100%";
            this.element.appendChild(div);
            div.addEventListener("transitioned", this.$transitionCompleted);
            div.addEventListener("webkitTransitionEnd", this.$transitionCompleted);
            div.addEventListener("oTransitionEnd", this.$transitionCompleted);
            div.addEventListener("MSTransitionEnd", this.$transitionCompleted);
            this.translations[i] = (0 - this.tileWidth);
        }
    };
    Carousel.prototype.$transitionCompleted = function (e) {
        if (!e || e.propertyName.indexOf("ransform") > 0) {
            if (this.translationComplete === false) {
                this.translationComplete = true;
                for (var i = 0; i < this.element.children.length; i++) {
                    var child = this.element.children[i];
                    child.style.visibility = "";
                    child.style.opacity = "1";
                    if (this.focusIndex === i) {
                        child.setAttribute("class", "bao--carouselitem focused");
                    }
                }
            }
        }
    };
    Carousel.prototype.$goLeft = function () {
        if (!this.wrap && this.index + 1 === this.numTiles)
            return;
        if (this.translationComplete === true) {
            if (this.transform)
                this.translationComplete = false;
            this.index++;
            if (this.index % this.numTiles === 1)
                this.index = 1;
            var t = 0;
            var outer = null;
            this.outerIndex = (this.index - 1) % this.numTiles;
            for (var i = 0; i < this.element.children.length; i++) {
                var child = this.element.children[i];
                t = this.translations[i] - this.tileWidth;
                child.style.opacity = "1";
                child.style.transform = "translateX(" + t + "px)";
                child.style.webkitTransform = "translateX(" + t + "px)";
                if (this.focusIndex === i)
                    child.setAttribute("class", "bao--carouselitem");
                this.translations[i] = t;
                if (this.outerIndex === i)
                    outer = child;
            }
            if (outer && this.wrap) {
                t = this.translations[this.outerIndex] + this.tileWidth * this.numTiles;
                outer.style.transform = "translateX(" + t + "px)";
                outer.style.webkitTransform = "translateX(" + t + "px)";
                outer.style.visibility = "hidden";
                outer.style.opacity = "0";
                this.translations[this.outerIndex] = t;
                this.$repurposeOuter(outer, "left");
            }
            if (this.wrap)
                this.focusIndex = (this.index + 1) % this.numTiles;
            else
                this.focusIndex = this.index % this.numTiles;
            if (Core_1["default"]().MetaConfig.$get("animation") === "off") {
                this.$transitionCompleted(null);
            }
        }
    };
    Carousel.prototype.$goRight = function () {
        if (!this.wrap && this.index === 0)
            return;
        if (this.translationComplete === true) {
            if (this.transform)
                this.translationComplete = false;
            this.index--;
            if (this.index < 0)
                this.index = this.numTiles - 1;
            var t = 0;
            var outer = null;
            this.outerIndex = this.index % this.numTiles;
            for (var i = 0; i < this.element.children.length; i++) {
                var child = this.element.children[i];
                t = this.translations[i] + this.tileWidth;
                child.style.opacity = "1";
                child.style.transform = "translateX(" + t + "px)";
                child.style.webkitTransform = "translateX(" + t + "px)";
                if (this.focusIndex === i)
                    child.setAttribute("class", "bao--carouselitem");
                this.translations[i] = t;
                if (this.outerIndex === i)
                    outer = child;
            }
            if (outer && this.wrap) {
                t = this.translations[this.outerIndex] - this.tileWidth * this.numTiles;
                outer.style.transform = "translateX(" + t + "px)";
                outer.style.webkitTransform = "translateX(" + t + "px)";
                outer.style.visibility = "hidden";
                outer.style.opacity = "0";
                this.translations[this.outerIndex] = t;
                this.$repurposeOuter(outer, "right");
            }
            if (this.wrap)
                this.focusIndex = (this.index + 1) % this.numTiles;
            else
                this.focusIndex = this.index % this.numTiles;
            if (Core_1["default"]().MetaConfig.$get("animation") === "off") {
                this.$transitionCompleted(null);
            }
        }
    };
    Carousel.prototype.$repurposeOuter = function (outer, direction) { };
    Carousel.prototype.$onLeftKey = function () {
        this.$goRight();
    };
    Carousel.prototype.$onRightKey = function () {
        this.$goLeft();
    };
    Carousel.prototype.$focus = function () {
        for (var i = 0; i < this.element.children.length; i++) {
            var child = this.element.children[i];
            if (this.focusIndex === i) {
                child.setAttribute("class", "bao--carouselitem focused");
            }
            else {
                child.setAttribute("class", "bao--carouselitem");
            }
        }
        return _super.prototype.$focus.call(this);
    };
    Carousel.prototype.$blur = function () {
        for (var i = 0; i < this.element.children.length; i++) {
            var child = this.element.children[i];
            child.setAttribute("class", "bao--carouselitem");
        }
        _super.prototype.$blur.call(this);
    };
    return Carousel;
}(View_1["default"]));
exports["default"] = Carousel;
Core_1["default"]().register("carousel", Carousel, null);
