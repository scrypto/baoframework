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
var Core_1 = require("../Core");
var BaseVideo_1 = require("./BaseVideo");
var Html5Video = (function (_super) {
    __extends(Html5Video, _super);
    function Html5Video() {
        var _this = _super.call(this) || this;
        console.log("html5 video created");
        return _this;
    }
    Html5Video.prototype.$setVideo = function (url, type) {
        _super.prototype.$setVideo.call(this, url, type);
        this.element.setAttribute("src", url);
        this.element.setAttribute("type", type);
        this.canplay = false;
        this.canplaythrough = false;
        this.playpending = false;
        this.offsetpending = false;
    };
    Html5Video.prototype.$createContent = function () {
        _super.prototype.$createContent.call(this);
        // set up event listeners here
        this.element.addEventListener("abort", this._onEvent);
        this.element.addEventListener("canplay", this._onCanPlay);
        this.element.addEventListener("canplaythrough", this._onCanPlayThrough);
        this.element.addEventListener("durationChange", this._onDurationChange);
        this.element.addEventListener("emptied", this._onEvent);
        this.element.addEventListener("ended", this._onEvent);
        this.element.addEventListener("error", this._onEvent);
        this.element.addEventListener("loadeddata", this._onEvent);
        this.element.addEventListener("loadedmetadata", this._onEvent);
        this.element.addEventListener("loadstart", this._onEvent);
        this.element.addEventListener("pause", this._onEvent);
        this.element.addEventListener("play", this._onEvent);
        this.element.addEventListener("playing", this._onEvent);
        this.element.addEventListener("progress", this._onEvent);
        this.element.addEventListener("ratechange", this._onEvent);
        this.element.addEventListener("seeked", this._onEvent);
        this.element.addEventListener("seeking", this._onEvent);
        this.element.addEventListener("stalled", this._onEvent);
        this.element.addEventListener("suspend", this._onEvent);
        this.element.addEventListener("timeupdate", this._onTimeUpdate);
        this.element.addEventListener("volumeChange", this._onEvent);
        this.element.addEventListener("waiting", this._onEvent);
    };
    Html5Video.prototype.$play = function () {
        if (!this.canplay) {
            this.playpending = true;
            return;
        }
        this.playpending = false;
        var e = this.element;
        e.play();
    };
    Html5Video.prototype.$pause = function () {
        var e = this.element;
        e.pause();
    };
    Html5Video.prototype.$seek = function (offset) {
        if (!this.canplay) {
            this.offsetpending = offset;
            return;
        }
        this.offsetpending = false;
        var e = this.element;
        e.currentTime = offset / 1000;
    };
    Html5Video.prototype.$stop = function () {
        var e = this.element;
        e.pause();
        e.currentTime = 0;
    };
    // event listeners
    // a general event listener that will just pass through the event
    Html5Video.prototype._onEvent = function (e) {
        this.isPaused = false;
        if (e.type === "pause")
            this.isPaused = true;
        this.$signal("$" + e.type);
    };
    Html5Video.prototype._onCanPlay = function (e) {
        this.$signal("$canplay");
        this.canplay = true;
        if (this.offsetpending) {
            this.$seek(this.offsetpending);
        }
        if (this.playpending) {
            this.playpending = false;
            this.$play();
        }
    };
    Html5Video.prototype._onCanPlayThrough = function () {
        this.$signal("$canplaythrough");
        this.canplaythrough = true;
        if (this.playpending) {
            this.playpending = false;
            this.$play();
        }
    };
    Html5Video.prototype._onDurationChange = function () {
        var e = this.element;
        this.duration = e.duration;
        this.$signal("$durationchange");
    };
    Html5Video.prototype._onTimeUpdate = function () {
        var e = this.element;
        this.currentTime = e.currentTime;
        this.duration = e.duration;
        this.$signal("$timeupdate");
    };
    return Html5Video;
}(BaseVideo_1["default"]));
exports["default"] = Html5Video;
Core_1["default"]().register("video", Html5Video, { tag: "video" });
