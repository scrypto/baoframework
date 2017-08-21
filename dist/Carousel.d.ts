import View from "./View";
declare class Carousel extends View {
    tileWidth: number;
    numTiles: number;
    translationComplete: boolean;
    translations: any;
    index: number;
    focusIndex: number;
    outerIndex: number;
    wrap: boolean;
    transform: boolean;
    obtype: string;
    constructor();
    $setTileWidth(width: number): void;
    $setWrap(wrap: boolean): void;
    $createContent(): void;
    $createTiles(max?: any): void;
    $transitionCompleted(e: any): void;
    $goLeft(): void;
    $goRight(): void;
    $repurposeOuter(outer: any, direction: any): void;
    $onLeftKey(): void;
    $onRightKey(): void;
    $focus(): boolean;
    $blur(): void;
}
export default Carousel;
