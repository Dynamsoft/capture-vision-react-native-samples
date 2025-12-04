import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ImageIO,
  ImageProcessor,
  imageDataToBase64,
} from 'dynamsoft-capture-vision-react-native';
import {
  ExternalCachesDirectoryPath,
  TemporaryDirectoryPath,
} from 'react-native-fs';
import {StackNavigation} from './App.tsx';
import {useFocusEffect} from '@react-navigation/native';

const ColourMode = {
  colour: 'colour',
  grayscale: 'grayscale',
  binary: 'binary',
};

export const NormalizedImage = ({navigation}: StackNavigation) => {
  const [base64, setBase64] = useState('');

  useFocusEffect(
    useCallback(() => {
      global.showingImage = global.deskewedImage;
      setBase64(imageDataToBase64(global.showingImage));
    }, []),
  );

  useEffect(() => {
    return () => {
      global.originalImage?.release();
      global.deskewedImage?.release();
      global.showingImage?.release();
    };
  }, []);

  const changeColourMode = (mode: string) => {
    if (global.showingImage && global.showingImage !== global.deskewedImage) {
      global.showingImage.release();
    }
    switch (mode) {
      case ColourMode.colour:
        global.showingImage = global.deskewedImage;
        break;
      case ColourMode.grayscale:
        global.showingImage = new ImageProcessor().convertToGray(
          global.deskewedImage,
        )!!;
        break;
      case ColourMode.binary:
        global.showingImage = new ImageProcessor().convertToBinaryLocal(
          global.deskewedImage,
          /*blockSize = */ 0,
          /*compensation = */ 10,
          /*invert = */ false,
        )!!;
        break;
    }
    setBase64(imageDataToBase64(global.showingImage));
  };

  const onTabPress = (index: number) => {
    switch (index) {
      case 0: //'Back to Edit'
        navigation.navigate('Editor');
        break;
      case 1: //'Switch Colour'
        Alert.alert(
          '',
          'Select Colour Mode',
          [ColourMode.colour, ColourMode.grayscale, ColourMode.binary].map(
            mode => ({
              text: mode,
              onPress: () => changeColourMode(mode),
            }),
          ),
        );
        break;
      case 2: //'Export'
        const imageIO = new ImageIO();
        let savedPath =
          (Platform.OS === 'ios'
            ? TemporaryDirectoryPath
            : ExternalCachesDirectoryPath) + `/normalize_${Date.now()}.png`;
        imageIO.saveToFile(global.showingImage, savedPath, true);
        Alert.alert('Successfully saved', 'Has been saved to ' + savedPath);
        break;
    }
  };

  return (
    <View style={styles.fullScreen}>
      <Image
        source={{uri: 'data:image/png;base64,' + base64}}
        style={styles.fullScreen}
        resizeMode="contain"
      />
      <View style={styles.bottomBar}>
        {[
          {emoji: '✏️', label: 'Back to Edit'},
          {emoji: '🎨', label: 'Switch Colour'},
          {emoji: '💾', label: 'Export'},
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.tab}
            onPress={() => onTabPress(index)}>
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={styles.label}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreen: {flex: 1},
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 1,
    paddingVertical: 10,
  },
  tab: {
    alignItems: 'center',
    flex: 1,
  },
  emoji: {
    fontSize: 24,
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    color: '#333',
  },
});
