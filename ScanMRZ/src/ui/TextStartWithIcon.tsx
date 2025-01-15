import React from 'react';
import {Image, ImageSourcePropType, ImageStyle, SafeAreaView, StyleProp, StyleSheet, Text, ViewProps} from 'react-native';

interface TextStartWithIconProps extends ViewProps {
  text?: string;
  iconSource?: ImageSourcePropType;
  iconStyle?: StyleProp<ImageStyle>;
}

export function TextStartWithIcon(props: TextStartWithIconProps) {
  return (
    <SafeAreaView style={props.style}>
      <Text style={styles.text}>
        <Image source={props.iconSource || require('../img/icon_attention.png')} style={props.iconStyle || styles.icon} resizeMode={'contain'} />
        {`  ${props.text}`}
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flexDirection: 'row', flexShrink: 1},
  icon: {width: 16, height: 16},
  text: {fontSize: 14, lineHeight: 19, color: 'white', flexShrink: 1, paddingHorizontal: 10, paddingVertical: 5},
});
