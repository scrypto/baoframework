import View from "./View";
declare class List extends View {
    translationComplete: boolean;
    translations: any;
    index: number;
    numRows: number;
    rowHeight: number;
    obtype: string;
    constructor();
    $createContent(): void;
    $createRowsFromChildren(): void;
    $transitionCompleted(e: any): void;
    $goUp(): boolean;
    $goDown(): boolean;
    $focus(): boolean;
    $onDownKey(): void;
    $onUpKey(): void;
}
export default List;
