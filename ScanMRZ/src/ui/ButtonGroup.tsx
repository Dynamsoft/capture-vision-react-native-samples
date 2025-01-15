import React, {useState} from 'react';
import {SafeAreaView, View, Text, TouchableOpacity, StyleSheet, ViewProps} from 'react-native';

interface ButtonGroupProps extends ViewProps {
  buttons: string[];
  selection: number;
  onSelectionChange: (index: number, button: string) => void;
}

export function ButtonGroup(props: ButtonGroupProps) {
  const [selection, setSelection] = useState(props.selection);

  return (
    <SafeAreaView style={props.style}>
      <View style={styles.btnGroup}>
        {props.buttons.map((button, index) => {
          return (
            <React.Fragment key={button + index}>
              <TouchableOpacity
                key={button + index}
                style={[styles.btn, selection === index ? styles.selected : styles.unselected]}
                onPress={() => {
                  setSelection(index);
                  props.onSelectionChange(index, button);
                }}>
                <Text style={styles.btnText}>{button}</Text>
              </TouchableOpacity>
              {index < props.buttons.length - 1 && (
                <View style={styles.divider} />
              )}
            </React.Fragment>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  btnGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#0000007F',
  },
  btn: {flex: 1, margin: 5, borderRadius: 6},
  btnText: {textAlign: 'center', paddingVertical: 16, fontSize: 16, lineHeight: 21, color: 'white'},
  selected: {backgroundColor: '#FE8E14'},
  unselected: {backgroundColor: '#00000000'},
  divider: {width: 1, backgroundColor: '#707070', height: 19, alignSelf: 'center'},
});
