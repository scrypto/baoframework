import View from "./View";
declare class DataStore extends View {
    obtype: string;
    constructor();
    $set(key: any, data: any): void;
    $setMany(obj: any): void;
    $broadcastDataChanges(key: any, data: any, node?: any): void;
    $exclusions(): string[];
}
export default DataStore;
