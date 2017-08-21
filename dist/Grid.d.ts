import View from "./View";
declare class Grid extends View {
    translationComplete: boolean;
    translations: any;
    numRows: number;
    numCols: number;
    rowIndex: number;
    colIndex: number;
    tileType: string;
    obtype: string;
    constructor();
    $createContent(): void;
    $createTiles(): void;
    $setData(data: any): void;
    $setTileContent(element: any, data?: any): void;
    onTileAction(e: any): void;
    $focus(): boolean;
    $onDownKey(node?: any): void;
    $onUpKey(node?: any): void;
    $onLeftKey(node?: any): void;
    $onRightKey(node?: any): void;
    _updateFocus(): void;
}
export default Grid;
