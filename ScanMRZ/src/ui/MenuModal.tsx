import {Image, ImageBackground, Modal, StyleSheet, Text, TouchableOpacity, View, ViewProps} from "react-native";
import React from "react";

interface MenuModalProps extends ViewProps {
  visible: boolean;
  onClose: () => void;
  items: {title: string; onPress?: () => void}[];
}

export const MenuModal = (props: MenuModalProps) => {
  return (
    <Modal transparent={true} visible={props.visible} animationType="fade" onRequestClose={props.onClose}>
      <TouchableOpacity style={styles.overlay} onPress={props.onClose}>
        <ImageBackground source={require('../img/menu_back.png')} style={styles.menuBackground}>
          <View style={styles.menuTop} />
          {props.items.map((item, index) => {
            return (
              <React.Fragment key={index}>
                <TouchableOpacity key={index} style={styles.menuItem} onPress={item.onPress}>
                  <Text style={styles.menuItemText}>
                    {`${item.title}  `}
                    <Image style={{width: 14, height: 14}} source={require('../img/icon_export.png')} />
                  </Text>
                </TouchableOpacity>
                {index < props.items.length - 1 && <View style={styles.divider} />}
              </React.Fragment>
            );
          })}
        </ImageBackground>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {flex: 1, justifyContent: 'flex-start', alignItems: 'flex-end', padding: 10},
  menuContainer: {width: 140, height: 147, position: 'absolute', top: 60, right: 10},
  menuBackground: {
    width: 160,
    height: 168,
    resizeMode: 'contain',
    position: 'absolute',
    top: 60,
    right: 10,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  menuTop: {height: 8},
  menuItem: {flex: 1, justifyContent: 'center', width: '100%'},
  menuItemText: {color: '#CCCCCC', fontSize: 14, lineHeight: 20, alignSelf: 'flex-start', marginStart: 15},
  divider: {height: 1, width: '100%', backgroundColor: '#3B3B3B'},
});
