import React, {useEffect} from 'react';
import {Button, Image, Platform, StyleSheet, View} from 'react-native';
import {ImageManager, imageDataToBase64} from 'dynamsoft-capture-vision-react-native';
import {ExternalCachesDirectoryPath, TemporaryDirectoryPath} from 'react-native-fs';

export const NormalizedImage = () => {
  const base64Str = imageDataToBase64(global.normalizedImage);

  useEffect(() => {
    return () => {
      if (global.normalizedImage && typeof global.normalizedImage.release === 'function') {
        global.normalizedImage.release();
      }
    };
  }, []);
  return <View style={{flex: 1}}>
    <Image  source={{uri: 'data:image/png;base64,' + base64Str}} style={styles.fullScreen} resizeMode="contain"/>
    <Button title={'Save to file'} onPress={() => {
      const imageManager = new ImageManager();
      let savedPath = (Platform.OS === 'ios' ? TemporaryDirectoryPath : ExternalCachesDirectoryPath) + '/normalize.png';
      imageManager.saveToFile(global.normalizedImage, savedPath, true);
      // @ts-ignore
      window.alert('Has been saved to ' + savedPath);
    }}/>
  </View>;
};

const styles = StyleSheet.create({
  fullScreen: {flex: 0.9},
});
