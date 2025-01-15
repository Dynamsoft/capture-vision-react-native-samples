/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState} from 'react';
import {Alert, Clipboard, Dimensions, Image, Linking, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {createNativeStackNavigator, NativeStackScreenProps} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import Scanner from './Scanner.tsx';
import ResultPage from './ResultPage.tsx';
import {MRZResult} from './MRZResult.tsx';
import {MenuModal} from './ui/MenuModal.tsx';

export type ScreenNames = ['Home', 'Scanner', 'ResultPage'];
export type RootStackParamList = Record<ScreenNames[number], {mrzResult: MRZResult} | undefined>;
export type StackNavigation = NativeStackScreenProps<RootStackParamList>;

function HomeScreen({navigation}: StackNavigation) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView scrollsToTop={false} contentContainerStyle={styles.contentView}>
        <Image source={require('./img/dynamsoft_logo.png')} style={styles.logo} resizeMode={'contain'} />
        <Text style={styles.titleText}>{' MRZ Scanner '}</Text>
        <View style={styles.descriptionContainer}>
          <Image source={require('./img/mrz_description.png')} style={styles.container} resizeMode={'contain'} />
        </View>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Scanner')}>
          <Text style={styles.buttonText}>{'Scan an MRZ'}</Text>
        </TouchableOpacity>
      </ScrollView>
      <Text style={styles.poweredText}>{' Powered by Dynamsoft '}</Text>
    </SafeAreaView>
  );
}

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={({navigation}) => ({
            animation: 'slide_from_right',
            headerTintColor: 'white',
            // eslint-disable-next-line react/no-unstable-nested-components
            headerLeft: () => (
              <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.goBack()}>
                <Image source={require('./img/back.png')} resizeMode={'contain'} style={styles.backButton} />
              </TouchableOpacity>
            ),
            headerStyle: {backgroundColor: '#2B2B2B'},
          })}>
          <Stack.Screen name="Home" component={HomeScreen} options={{statusBarColor: '#323234', headerShown: false}} />
          <Stack.Screen name="Scanner" component={Scanner} options={{statusBarColor: '#323234', headerTitle: ''}} />
          <Stack.Screen
            name="ResultPage"
            component={ResultPage}
            options={{
              statusBarColor: '#2B2B2B',
              headerTitle: 'Result',
              headerTitleAlign: 'center',
              // eslint-disable-next-line react/no-unstable-nested-components
              headerRight: () => (
                <TouchableOpacity onPressOut={() => setModalVisible(true)}>
                  <Image source={require('./img/icon_info.png')} style={styles.menuButton} />
                </TouchableOpacity>
              ),
            }}
          />
        </Stack.Navigator>
        <MenuModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          items={[
            {
              title: 'About',
              onPress: () => openURL('https://www.dynamsoft.com/use-cases/mrz-scanner/?utm_source=mrzdemo'),
            },
            {title: 'GitHub Projects', onPress: () => openURL('https://github.com/Dynamsoft/mrz-scanner-mobile/')},
            {title: 'Contact Us', onPress: () => openURL('https://www.dynamsoft.com/contact/?utm_source=mrzdemo')},
          ]}
        />
      </NavigationContainer>
    </SafeAreaView>
  );
}

const openURL = (url: string) => {
  Linking.canOpenURL(url).then(supported => {
    if (supported) {
      Linking.openURL(url);
    } else {
      Clipboard.setString(url);
      Alert.alert(`Can't open this URL: ${url}`);
    }
  });
};
const pageHeight = Dimensions.get('window').height - (StatusBar.currentHeight || 0);
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#323234'},
  contentView: {backgroundColor: '#323234', alignItems: 'center'},
  logo: {width: '39%', height: 40, marginTop: pageHeight * 0.2},
  titleText: {fontSize: 25, color: 'white', marginTop: pageHeight * 0.043, lineHeight: 37},
  descriptionContainer: {
    marginTop: pageHeight * 0.022,
    width: '70%',
    aspectRatio: 783 / 375,
    alignItems: 'center',
    alignSelf: 'center',
    maxHeight: 150,
  },
  button: {backgroundColor: '#FE8E14', width: 210, aspectRatio: '4.375', justifyContent: 'center', marginVertical: 40},
  buttonText: {fontSize: 18, color: 'white', textAlign: 'center', lineHeight: 24},
  backButton: {width: 56, height: 46},
  menuButton: {width: 24, height: 24, marginEnd: 20},
  poweredText: {
    fontSize: 16,
    color: '#999999',
    marginTop: 10,
    lineHeight: 21,
    position: 'absolute',
    bottom: 36,
    alignSelf: 'center',
  },
});

export default App;
