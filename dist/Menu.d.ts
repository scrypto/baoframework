import View from "./View";
declare class Menu extends View {
    selectedEntry: any;
    constructor();
    $setData(entries: any): void;
    $createMenuEntry(entry: any): any;
    $onMenuItemAction(e: any): boolean;
    $focus(obj?: any): boolean;
    $setSelectedEntry(entry: any): void;
}
export default Menu;
