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
var View_1 = require("../View");
var BaseVideo = (function (_super) {
    __extends(BaseVideo, _super);
    function BaseVideo() {
        var _this = _super.call(this) || this;
        _this.obtype = "video";
        _this.currentTime = 0;
        _this.duration = 0;
        _this.isPaused = false;
        return _this;
    }
    BaseVideo.prototype.$setData = function (data) {
        if (data["url"])
            this.$setVideo(data["url"], data["type"]);
    };
    BaseVideo.prototype.$setVideo = function (url, type) {
        this.url = url;
        this.type = type;
        this.currentTime = 0;
        this.duration = 0;
    };
    BaseVideo.prototype.$getPosition = function () {
        return this.currentTime;
    };
    BaseVideo.prototype.$getDuration = function () {
        return this.duration;
    };
    BaseVideo.prototype.$getPositionAsTime = function () {
        return this._secondsToTime(this.$getPosition());
    };
    BaseVideo.prototype.$getDurationAsTime = function () {
        return this._secondsToTime(this.$getDuration());
    };
    BaseVideo.prototype.$isPaused = function () {
        return this.isPaused;
    };
    BaseVideo.prototype._secondsToTime = function (totalSeconds) {
        var hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        var minutes = Math.floor(totalSeconds / 60);
        var seconds = Math.floor(totalSeconds % 60);
        return (hours ? hours + ":" : "") +
            (hours && minutes < 10 ? "0" : "") + minutes + ":" +
            (seconds < 10 ? "0" : "") + seconds;
    };
    BaseVideo.prototype.$play = function () {
    };
    BaseVideo.prototype.$pause = function () {
    };
    BaseVideo.prototype.$seek = function (offset) {
    };
    BaseVideo.prototype.$stop = function () {
    };
    return BaseVideo;
}(View_1["default"]));
exports["default"] = BaseVideo;
