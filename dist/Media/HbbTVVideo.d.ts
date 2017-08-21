import BaseVideo from "./BaseVideo";
declare class HbbTVVideo extends BaseVideo {
    canplay: boolean;
    playpending: boolean;
    offsetpending: any;
    timeUpdateInterval: any;
    constructor();
    $setVideo(url: any, type: any): void;
    $play(): void;
    $pause(): void;
    $seek(offset: any): void;
    $stop(): void;
    onPlayStateChange(): void;
    startTimeUpdateInterval(): void;
    stopTimeUpdateInterval(): void;
    onTimeUpdate(): void;
}
export default HbbTVVideo;
