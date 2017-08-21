import View from "../View";
declare class BaseVideo extends View {
    currentTime: number;
    duration: number;
    url: string;
    type: string;
    isPaused: boolean;
    obtype: string;
    constructor();
    $setData(data: any): void;
    $setVideo(url: any, type: any): void;
    $getPosition(): number;
    $getDuration(): number;
    $getPositionAsTime(): string;
    $getDurationAsTime(): string;
    $isPaused(): boolean;
    _secondsToTime(totalSeconds: any): string;
    $play(): void;
    $pause(): void;
    $seek(offset: any): void;
    $stop(): void;
}
export default BaseVideo;
