import View from "./View";
declare class Style extends View {
    styles: any;
    element: HTMLElement;
    obtype: string;
    constructor();
    $assignElement(node: any): any;
    $getBaoStyle(): string;
    $addStyle(selector: any, rules: any): void;
    $removeStyle(selector: any): void;
}
export default Style;
