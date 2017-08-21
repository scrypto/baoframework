import BaseVideo from "./BaseVideo";
declare class Html5Video extends BaseVideo {
    canplay: boolean;
    canplaythrough: boolean;
    playpending: boolean;
    offsetpending: any;
    constructor();
    $setVideo(url: any, type: any): void;
    $createContent(): void;
    $play(): void;
    $pause(): void;
    $seek(offset: any): void;
    $stop(): void;
    _onEvent(e: any): void;
    _onCanPlay(e: any): void;
    _onCanPlayThrough(): void;
    _onDurationChange(): void;
    _onTimeUpdate(): void;
}
export default Html5Video;
