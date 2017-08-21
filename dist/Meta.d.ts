import View from "./View";
declare class Meta extends View {
    nvp: any;
    constructor();
    $get(key: any): any;
    $set(key: any, value: any): void;
    $readMetaTags(): void;
    $exclusions(): string[];
}
export default Meta;
