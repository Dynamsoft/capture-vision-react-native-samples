export interface Quadrilateral {
    points: Point[];
}
export interface Point {
    x: number;
    y: number;
}
export interface Region {
    regionBottom: number;
    regionRight: number;
    regionLeft: number;
    regionTop: number;
    regionMeasuredByPercentage: number | boolean;
}
export interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}
