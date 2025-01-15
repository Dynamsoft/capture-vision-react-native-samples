import React from 'react';
import {FlatList, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {RootStackParamList} from './App.tsx';
import {RouteProp} from '@react-navigation/native';
import {MRZResult} from './MRZResult.tsx';

type routeProps = {
  route: RouteProp<RootStackParamList, 'ResultPage'>;
};

const getItems = (mrzResult: MRZResult): {title: string; value?: string}[] => [
  {title: 'Document Type', value: mrzResult.documentType},
  {title: 'Document Number', value: mrzResult.documentNumber},
  {title: 'Issuing State', value: mrzResult.issuingState},
  {title: 'Nationality', value: mrzResult.nationality},
  {title: 'Personal Number', value: mrzResult.personalNumber},
  {title: 'Date of Birth[YYYY-MM-DD]', value: mrzResult.dateOfBirth},
  {title: 'Date of Expiry[YYYY-MM-DD]', value: mrzResult.dateOfExpiry},
];

const DisplayItem = ({title, value}: {title: string; value?: string}) =>
  (value && value.length > 0 && (
    <Text style={[styles.itemText, styles.resultItem]} selectable={true}>
      <Text style={styles.titleColor}>{`${title}:\n`}</Text>
      <Text style={styles.valueColor}>{value}</Text>
    </Text>
  )) ||
  null;

export default function ResultPage({route}: routeProps) {
  const result = route.params?.mrzResult;
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={result && getItems(result)}
        keyExtractor={(item, index) => `${item.title}_${index}`}
        renderItem={({item}) => <DisplayItem title={item.title} value={item.value} />}
        ListEmptyComponent={<View style={styles.container} />}
        ListHeaderComponent={
          //Main info(name, sex, age)
          <Text style={[styles.mainInfoText, styles.resultHeader]} selectable={true}>{`${result?.name}\n${result?.sex}, Age:${result?.age}`}</Text>
        }
      />
      <View style={styles.poweredTextContainer}>
        <Text style={styles.poweredText}>{' Powered by Dynamsoft '}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#3B3B3B'},
  poweredText: {fontSize: 16, lineHeight: 20, color: '#999999', marginTop: 12},
  poweredTextContainer: {height: 72, justifyContent: 'flex-start', alignItems: 'center'},
  resultItem: {width: '100%', justifyContent: 'center', paddingStart: 36, marginVertical: 12},
  resultHeader: {width: '100%', justifyContent: 'center', paddingStart: 36, marginVertical: 18},
  mainInfoText: {fontSize: 18, lineHeight: 28, color: 'white', fontWeight: 'bold'},
  itemText: {fontSize: 16, lineHeight: 26},
  titleColor: {color: '#AAAAAA'},
  valueColor: {color: 'white'},
});
