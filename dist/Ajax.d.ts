import View from "./View";
declare class Ajax extends View {
    request: XMLHttpRequest;
    signalData: any;
    obtype: string;
    constructor();
    $addEventListener(ev: any, callback: any): void;
    $open(method: any, url: any, async?: any): void;
    $send(data?: any): void;
    $setData(data: any): void;
    $onReadyStateChange(e: any): void;
    $signal(type: any, data?: any): void;
    $abort(): void;
}
export default Ajax;
