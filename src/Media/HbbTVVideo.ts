import Core from "../Core";
import BaseVideo from "./BaseVideo";

class HbbTVVideo extends BaseVideo
{
	canplay:boolean;
	playpending:boolean;
	offsetpending:any;
	timeUpdateInterval:any;
	constructor()
	{
		super();
	}

	$setVideo(url, type)
	{
		super.$setVideo(url, type);

		this.playpending = false;
		this.offsetpending = false;
		this.canplay = false;
		this.timeUpdateInterval = false;

		const e:any = this.element;
		e.setAttribute("type", type);
		e.type = type;
		e.setAttribute("data", url);
		e.data = url;

		// need to setup event listeners after setting type
		e.removeEventListener("PlayStateChange", this.onPlayStateChange);
		e.addEventListener("PlayStateChange", this.onPlayStateChange);
	}

	$play()
	{
		const e:any = this.element;
		e.play(1);
	}

	$pause()
	{
		const e:any = this.element;
		e.play(0);
	}

	$seek(offset)
	{
		const e:any = this.element;
		e.seek(offset);
	}

	$stop()
	{
		const e:any = this.element;
		e.stop();
	}

	onPlayStateChange()
	{
		this.isPaused = false;

		const e:any = this.element;
		switch (e.playState) {
			case 0: // unrealised
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
	}

	startTimeUpdateInterval()
	{
		if (!this.timeUpdateInterval) {
			window.setInterval(this.onTimeUpdate, 250);
		}
	}

	stopTimeUpdateInterval()
	{
		if (this.timeUpdateInterval) {
			const i = this.timeUpdateInterval;
			this.timeUpdateInterval = null;
			window.clearInterval(i);
		}
	}

	onTimeUpdate()
	{
		const e:any = this.element;
		this.currentTime = e.playPosition / 1000;
		this.duration = e.playTime / 1000;
		this.$signal("$timeupdate");
	}
}

export default HbbTVVideo;
Core().register("video", HbbTVVideo, { tag: "object", ua: /.*HbbTV.*1.2.1/ });
