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
var HbbTVVideo = (function (_super) {
    __extends(HbbTVVideo, _super);
    function HbbTVVideo() {
        return _super.call(this) || this;
    }
    HbbTVVideo.prototype.$setVideo = function (url, type) {
        _super.prototype.$setVideo.call(this, url, type);
        this.playpending = false;
        this.offsetpending = false;
        this.canplay = false;
        this.timeUpdateInterval = false;
        var e = this.element;
        e.setAttribute("type", type);
        e.type = type;
        e.setAttribute("data", url);
        e.data = url;
        // need to setup event listeners after setting type
        e.removeEventListener("PlayStateChange", this.onPlayStateChange);
        e.addEventListener("PlayStateChange", this.onPlayStateChange);
    };
    HbbTVVideo.prototype.$play = function () {
        var e = this.element;
        e.play(1);
    };
    HbbTVVideo.prototype.$pause = function () {
        var e = this.element;
        e.play(0);
    };
    HbbTVVideo.prototype.$seek = function (offset) {
        var e = this.element;
        e.seek(offset);
    };
    HbbTVVideo.prototype.$stop = function () {
        var e = this.element;
        e.stop();
    };
    HbbTVVideo.prototype.onPlayStateChange = function () {
        this.isPaused = false;
        var e = this.element;
        switch (e.playState) {
            case 0:// unrealised
                this.$signal("$stopped");
                this.stopTimeUpdateInterval();
                break;
            case 1:
                this.$signal("$playing");
                this.startTimeUpdateInterval();
                break;
            case 2:
                this.$signal("$pause");
                this.isPaused = true;
                this.stopTimeUpdateInterval();
                break;
            case 3:
                this.$signal("$connecting");
                this.startTimeUpdateInterval();
                break;
            case 4:
                this.$signal("$buffering");
                this.startTimeUpdateInterval();
                break;
            case 5:
                this.$signal("$ended");
                this.stopTimeUpdateInterval();
                break;
            case 6:
                this.$signal("$error");
                this.stopTimeUpdateInterval();
                break;
        }
    };
    HbbTVVideo.prototype.startTimeUpdateInterval = function () {
        if (!this.timeUpdateInterval) {
            window.setInterval(this.onTimeUpdate, 250);
        }
    };
    HbbTVVideo.prototype.stopTimeUpdateInterval = function () {
        if (this.timeUpdateInterval) {
            var i = this.timeUpdateInterval;
            this.timeUpdateInterval = null;
            window.clearInterval(i);
        }
    };
    HbbTVVideo.prototype.onTimeUpdate = function () {
        var e = this.element;
        this.currentTime = e.playPosition / 1000;
        this.duration = e.playTime / 1000;
        this.$signal("$timeupdate");
    };
    return HbbTVVideo;
}(BaseVideo_1["default"]));
exports["default"] = HbbTVVideo;
Core_1["default"]().register("video", HbbTVVideo, { tag: "object", ua: /.*HbbTV.*1.2.1/ });
