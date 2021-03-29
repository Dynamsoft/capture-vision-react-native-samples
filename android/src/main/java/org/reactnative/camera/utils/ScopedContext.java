package org.reactnative.camera.utils;

import android.content.Context;
import android.util.DisplayMetrics;

import java.io.File;

/**
 * Created by jgfidelis on 23/01/18.
 */

public class ScopedContext {

    private File cacheDirectory = null;

    public ScopedContext(Context context) {
        createCacheDirectory(context);
    }

    public void createCacheDirectory(Context context) {
        cacheDirectory = new File(context.getCacheDir() + "/Camera/");
    }

    public File getCacheDirectory() {
        return cacheDirectory;
    }

}
