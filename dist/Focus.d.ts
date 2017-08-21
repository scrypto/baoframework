import View from "./View";
declare class Focus extends View {
    focusedElement: any;
    obtype: string;
    constructor();
    $set(widget: any): void;
    $blur(): void;
    $get(): any;
    $exclusions(): string[];
}
export default Focus;
