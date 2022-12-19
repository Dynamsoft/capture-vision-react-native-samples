export interface Quadrilateral {
    /**
    * Vertex coordinates of the quadrilateral.
    */
    points : Point[];
}

export interface Point {
    /**
    * X coordinate of the point.
    */
    x:number;
    /**
    * Y coordinate of the point.
    */
    y:number;
}

export interface Region {
    /**
    * Y coordinate of the buttom border of the region.
    */
    regionBottom: number;
    /**
    * X coordinate of the right border of the region.
    */
    regionRight: number;
    /**
    * X coordinate of the left border of the region.
    */
    regionLeft: number;
    /**
    * Y coordinate of the top border of the region.
    */
    regionTop: number;
    /**
    * 1/True: the coordinates are measured by percentage.
    * 0/False: the coordinates are measured by pixel distance.
    */
    regionMeasuredByPercentage: number | boolean;
}

export interface Rect {
    /**
    * X coordinate of the top-left vertex of the rectangle.
    */
    x: number;
    /**
    * Y coordinate of the top-left vertex of the rectangle.
    */
    y: number;
    /**
    * The width of the rectangle.
    */
    width: number;
    /**
    * The height of the rectangle.
    */
    height: number;
}