import React, {useEffect, useRef} from 'react';
import {Button, StyleSheet, View} from 'react-native';
import {CaptureVisionRouter, EnumDrawingLayerId, EnumPresetTemplate, ImageData, ImageEditorView} from 'dynamsoft-capture-vision-react-native';
import {StackNavigation} from './App.tsx';

export function Editor({navigation}: StackNavigation) {
  let editorView = useRef<ImageEditorView>(null);

  useEffect(() => {
    editorView.current!!.setOriginalImage(global.originalImage);
    editorView.current!!.setQuads(
      global.quadsResult.items?.map(item => item.location),
      EnumDrawingLayerId.DDN_LAYER_ID,
    );

    return () => {
      if(global.originalImage) {
        global.originalImage.release();
      }
    };
  }, [editorView]);

  const getSelectedQuadAndNormalize = async (): Promise<ImageData | null | undefined> => {
    const quad = await editorView.current!!.getSelectedQuad().catch(e => console.log(e));
    if (quad) {
      let cvr = CaptureVisionRouter.getInstance();
      await cvr
        .updateSettings({roiMeasuredInPercentage: false, roi: quad}, EnumPresetTemplate.PT_NORMALIZE_DOCUMENT)
        .catch(e => console.log('EditorPager updateSettings', e));
      const normalizedResult = cvr.capture(global.originalImage, EnumPresetTemplate.PT_NORMALIZE_DOCUMENT);
      return normalizedResult?.normalizedImagesResult?.items!![0].imageData;
    } else {
      console.log('Please select an item');
      return null;
    }
  };

  return (
    <ImageEditorView style={styles.fullScreen} ref={editorView}>
      <View style={styles.bottomView}>
        <Button
          title={'Normalize'}
          onPress={async () => {
            const normalizedImage = await getSelectedQuadAndNormalize();
            if (normalizedImage) {
              global.normalizedImage = normalizedImage;
              navigation.navigate('NormalizedImage');
            }
          }}
        />
      </View>
    </ImageEditorView>
  );
}

const styles = StyleSheet.create({
  fullScreen: {flex: 1},
  bottomView: {position: 'absolute', bottom: 10, left: 0, right: 0, alignItems: 'center'},
});

