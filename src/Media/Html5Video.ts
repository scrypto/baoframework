import Core from "../Core";
import BaseVideo from "./BaseVideo";

class Html5Video extends BaseVideo
{
	canplay: boolean;
	canplaythrough: boolean;
	playpending: boolean;
	offsetpending: any;
	constructor()
	{
		super();
		console.log("html5 video created");
	}

	$setVideo(url, type)
	{
		super.$setVideo(url, type);
		this.element.setAttribute("src", url);
		this.element.setAttribute("type", type);
		this.canplay = false;
		this.canplaythrough = false;
		this.playpending = false;
		this.offsetpending = false;
	}

	$createContent()
	{
		super.$createContent();
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
	}

	$play()
	{
		if (!this.canplay) {
			this.playpending = true;
			return;
		}

		this.playpending = false;

		const e: HTMLVideoElement = (this.element as any);
		e.play();
	}

	$pause()
	{
		const e: HTMLVideoElement = (this.element as any);
		e.pause();
	}

	$seek(offset)
	{
		if (!this.canplay) {
			this.offsetpending = offset;
			return;
		}

		this.offsetpending = false;
		const e: HTMLVideoElement = (this.element as any);
		e.currentTime = offset / 1000;
	}

	$stop()
	{
		const e: HTMLVideoElement = (this.element as any);
		e.pause();
		e.currentTime = 0;
	}

	// event listeners

	// a general event listener that will just pass through the event
	_onEvent(e)
	{
		this.isPaused = false;
		if (e.type === "pause") this.isPaused = true;

		this.$signal("$" + e.type);
	}

	_onCanPlay(e)
	{
		this.$signal("$canplay");
		this.canplay = true;
		if (this.offsetpending) {
			this.$seek(this.offsetpending);
		}

		if (this.playpending) {
			this.playpending = false;
			this.$play();
		}
	}

	_onCanPlayThrough()
	{
		this.$signal("$canplaythrough");
		this.canplaythrough = true;
		if (this.playpending) {
			this.playpending = false;
			this.$play();
		}
	}

	_onDurationChange()
	{
		const e: HTMLVideoElement = (this.element as any);
		this.duration = e.duration;
		this.$signal("$durationchange");
	}

	_onTimeUpdate()
	{
		const e: HTMLVideoElement = (this.element as any);
		this.currentTime = e.currentTime;
		this.duration = e.duration;
		this.$signal("$timeupdate");
	}
}

export default Html5Video;
Core().register("video", Html5Video, { tag: "video" });
