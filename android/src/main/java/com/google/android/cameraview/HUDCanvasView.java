package com.google.android.cameraview;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Path;
import android.util.AttributeSet;
import android.view.View;

import com.dynamsoft.dbr.TextResult;
import com.facebook.react.bridge.WritableArray;

public class HUDCanvasView extends View {
    int paddingLeft;
    int paddingTop;
    int paddingRight;
    int paddingBottom;
    private WritableArray resultPoint = null;
    private TextResult[] results;
    private Path path = new Path();
    private Paint paint;
    private int degree;
    private float previewScale;
    private int srcWidth, srcHeight;
//    private FrameUtil frameUtil;

    public HUDCanvasView(Context context) {
        super(context);
    }

    public HUDCanvasView(Context context, AttributeSet attrs) {
        super(context, attrs);
        paint = new Paint();
        paint.setStyle(Paint.Style.FILL);
        paint.setStrokeWidth(9f);
        paint.setAntiAlias(true);

        paddingLeft = getPaddingLeft();
        paddingTop = getPaddingTop();
        paddingRight = getPaddingRight();
        paddingBottom = getPaddingBottom();
//        frameUtil = new FrameUtil();
    }

    public HUDCanvasView(Context context, AttributeSet attrs, int defStyle) {
        this(context, attrs);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        if (resultPoint != null && resultPoint.size() > 0) {
//                int confidence = results[i].results[0].confidence;
//                if (confidence < 40) {
//                    paint.setColor(getResources().getColor(R.color.aboutBad));
//                } else if (confidence < 70) {
//                    paint.setColor(getResources().getColor(R.color.aboutNormal));
//                } else {
//                    paint.setColor(getResources().getColor(R.color.aboutOK));
//                }
                path.reset();
                path.moveTo(resultPoint.getInt(0) + paddingLeft, resultPoint.getInt(1) + paddingTop);
                path.lineTo(resultPoint.getInt(2) + paddingLeft, resultPoint.getInt(3) + paddingTop);
                path.lineTo(resultPoint.getInt(4) + paddingLeft, resultPoint.getInt(5) + paddingTop);
                path.lineTo(resultPoint.getInt(6) + paddingLeft, resultPoint.getInt(7) + paddingTop);
                path.close();
                canvas.drawPath(path, paint);
        }
    }

    public void setBoundaryPoints(WritableArray resultPoint, TextResult[] results) {
        this.results = results;
        this.resultPoint = resultPoint;
    }

    public void setBoundaryColor(String color) {
        paint.setColor(Color.parseColor(color));
    }

    public void setBoundaryThickness(int thickness) {
        paint.setStrokeWidth(thickness);
    }

    public void clear() {
        resultPoint = null;
        invalidate();
    }

    public void setCanvasDegree(int degree) {
        this.degree = degree;
    }
}
