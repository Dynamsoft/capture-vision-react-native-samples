import {ImageBackground, ImageSourcePropType, StyleSheet, TouchableOpacity, ViewProps} from 'react-native';
import React, {useState} from 'react';

interface SwitchButtonProps extends ViewProps {
  onImage?: ImageSourcePropType;
  offImage?: ImageSourcePropType;
  stateListener: (state: 'on' | 'off') => void;
}

export function SwitchButton(props: SwitchButtonProps) {
  const [state, setState] = useState<'on' | 'off'>('off');
  return (
    <TouchableOpacity
      style={props.style}
      activeOpacity={0.8}
      onPress={() => {
        const newState = state === 'on' ? 'off' : 'on';
        setState(newState);
        props.stateListener(newState);
      }}>
      {state === 'on' && <ImageBackground source={props.onImage || require('../img/icon-music.png')} style={StyleSheet.absoluteFill} />}
      {state === 'off' && <ImageBackground source={props.offImage || require('../img/icon-music-mute.png')} style={StyleSheet.absoluteFill} />}
    </TouchableOpacity>
  );
}
