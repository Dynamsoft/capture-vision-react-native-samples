import React, {useEffect, useRef} from 'react';
import {Button, StyleSheet, View} from 'react-native';
import {
  EnumDrawingLayerId,
  ImageData,
  ImageEditorView,
  ImageProcessor,
} from 'dynamsoft-capture-vision-react-native';
import {StackNavigation} from './App.tsx';

export function Editor({navigation}: StackNavigation) {
  let editorView = useRef<ImageEditorView>(null);

  useEffect(() => {
    editorView.current!!.setOriginalImage(global.originalImage);
    editorView.current!!.setQuads([global.sourceDeskewQuad], EnumDrawingLayerId.DDN_LAYER_ID);
  }, [editorView]);

  const getSelectedQuadAndDeskew = async (): Promise<ImageData | null | undefined> => {
    const quad = await editorView.current!!.getSelectedQuad().catch(e => console.log(e));
    if (quad) {
      global.sourceDeskewQuad = quad;
      return new ImageProcessor().cropAndDeskewImage(global.originalImage, quad);
    } else {
      console.log('Please select an item');
      return null;
    }
  };

  return (
    <ImageEditorView style={styles.fullScreen} ref={editorView}>
      <View style={styles.bottomView}>
        <Button
          title={'Confirm'}
          onPress={async () => {
            const deskewedImage = await getSelectedQuadAndDeskew();
            if (deskewedImage) {
              if(global.deskewedImage) {
                global.deskewedImage.release();
              }
              global.deskewedImage = deskewedImage;
              navigation.pop(1);
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

