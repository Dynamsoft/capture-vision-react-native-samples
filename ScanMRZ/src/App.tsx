import React, {useState} from 'react';
import {
  Alert,
  Image,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import RNFS from 'react-native-fs';
import {
  EnumResultStatus,
  MRZScanConfig,
  MRZScanner,
  MRZScanResult,
} from 'dynamsoft-mrz-scanner-bundle-react-native';

function App(): React.JSX.Element {
  const [mrzScanResult, setMrzScanResult] = useState<MRZScanResult | null>(
    null,
  );
  const [imageTab, setImageTab] = useState<'processed' | 'original'>('processed');

  const handleLongPress = (imageSource?: ImageSourcePropType) => {
    if (!imageSource || typeof imageSource === 'number') return;
    const uri = (imageSource as {uri: string}).uri;
    if (!uri) return;
    Alert.alert('Save Image', 'Save this image to your photo album?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Save',
        onPress: async () => {
          try {
            let savePath = uri;
            if (uri.startsWith('data:')) {
              const match = uri.match(/^data:image\/(\w+);base64,(.+)$/);
              const ext = match?.[1] === 'png' ? 'png' : 'jpg';
              const base64Data = match?.[2] ?? '';
              const tmpFile = `${RNFS.TemporaryDirectoryPath}save_image_${Date.now()}.${ext}`;
              await RNFS.writeFile(tmpFile, base64Data, 'base64');
              savePath = `file://${tmpFile}`;
            }
            await CameraRoll.save(savePath, {type: 'photo'});
            Alert.alert('Success', 'Image saved to photo album.');
          } catch (_e) {
            Alert.alert('Error', 'Failed to save image.');
          }
        },
      },
    ]);
  };

  const ScanMRZ = async () => {
    let mrzScanConfig = {
      // Initialize the license.
      // The license string here is a trial license. Note that network connection is required for this license to work.
      // You can request an extension via the following link: https://www.dynamsoft.com/customer/license/trialLicense?product=mrz&utm_source=samples&package=react-native
      license: 'DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9',
    } as MRZScanConfig;
    let mrzResult = await MRZScanner.launch(mrzScanConfig);
    setMrzScanResult(mrzResult);
    setImageTab('processed');
  };

  const mrzData = mrzScanResult?.data || {};

  const capitalize = (value?: string) =>
    value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : value;

  const fullName = `${mrzData.firstName} ${mrzData.lastName}`;
  const genderAndAge = `${capitalize(mrzData.sex)}, ${mrzData.age} years old`;

  const renderInfoRow = (label: string, value?: string) => (
    <View style={styles.infoRow} key={label}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );

  const renderImageRow = (mrzSideImage?: ImageSourcePropType, oppositeSideImage?: ImageSourcePropType) => {
    if (mrzSideImage == null && oppositeSideImage == null) {
      return null;
    }
    const hasOpposite = oppositeSideImage != null;
    return (
      <View style={styles.imageSection}>
        <Pressable style={{flex: 1}} onLongPress={() => handleLongPress(mrzSideImage)}>
          <Image style={[styles.docImage, hasOpposite && styles.docImageHalf]} source={mrzSideImage} resizeMode="contain" />
        </Pressable>
        {hasOpposite && (
          <Pressable style={{flex: 1}} onLongPress={() => handleLongPress(oppositeSideImage)}>
            <Image style={[styles.docImage, styles.docImageHalf]} source={oppositeSideImage} resizeMode="contain" />
          </Pressable>
        )}
      </View>
    );
  };

  if (mrzScanResult == null) {
    return (
      <View style={styles.idleContainer}>
        <TouchableOpacity style={styles.scanButton} onPress={ScanMRZ}>
          <Text style={styles.scanButtonText}>Scan an MRZ</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (mrzScanResult?.resultStatus === EnumResultStatus.RS_CANCELED) {
    return (
      <View style={styles.idleContainer}>
        <Text style={styles.idleHint}>{'Scan cancelled.'}</Text>
        <TouchableOpacity style={styles.scanButton} onPress={ScanMRZ}>
          <Text style={styles.scanButtonText}>Scan an MRZ</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (mrzScanResult?.resultStatus === EnumResultStatus.RS_EXCEPTION) {
    return (
      <View style={styles.idleContainer}>
        <Text style={styles.errorText}>{mrzScanResult.errorString}</Text>
        <View style={styles.bottomButtons}>
          <TouchableOpacity style={styles.bottomBtn} onPress={ScanMRZ}>
            <Text style={styles.bottomBtnText}>Scan an MRZ</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // resultStatus === EnumResultStatus.RS_FINISHED
  return (
    <View style={styles.container}>
      {/* Scrollable result content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        {/* Header: name, gender/age, expiry, portrait Image */}
        <View style={styles.headerSection}>
          <View style={styles.headerTextBlock}>
            <Text style={styles.fullName}>{fullName}</Text>
            <Text style={styles.genderAge}>{genderAndAge}</Text>
            <Text style={styles.expiryShort}>
              {mrzData.dateOfExpire ? `Expiry: ${mrzData.dateOfExpire}` : '—'}
            </Text>
          </View>
          <Pressable style={{flex: 1}} onLongPress={() => handleLongPress(mrzScanResult.portraitImage)}>
            <Image
              style={styles.portraitBox}
              source={mrzScanResult.portraitImage ?? require('./assets/ic_portrait_placeholder.jpg')}
              resizeMode="contain"
            />
          </Pressable>
        </View>

        {/* Document Images */}
        {(mrzScanResult.mrzSideDocumentImage != null || mrzScanResult.oppositeSideDocumentImage != null ||
          mrzScanResult.mrzSideOriginalImage != null || mrzScanResult.oppositeSideOriginalImage != null) && (
          <>
            <View style={styles.imageTabs}>
              <TouchableOpacity style={styles.imageTab} onPress={() => setImageTab('processed')}>
                <Text style={[styles.imageTabText, imageTab === 'processed' && styles.imageTabTextActive]}>Processed</Text>
                {imageTab === 'processed' && <View style={styles.imageTabIndicator} />}
              </TouchableOpacity>
              <TouchableOpacity style={styles.imageTab} onPress={() => setImageTab('original')}>
                <Text style={[styles.imageTabText, imageTab === 'original' && styles.imageTabTextActive]}>Original</Text>
                {imageTab === 'original' && <View style={styles.imageTabIndicator} />}
              </TouchableOpacity>
            </View>
            {imageTab === 'processed'
              ? renderImageRow(mrzScanResult.mrzSideDocumentImage, mrzScanResult.oppositeSideDocumentImage)
              : renderImageRow(mrzScanResult.mrzSideOriginalImage, mrzScanResult.oppositeSideOriginalImage)}
          </>
        )}
        {/* Personal Info */}
        <Text style={styles.sectionTitle}>Personal Info</Text>
        {renderInfoRow('Given Name', mrzData.firstName)}
        {renderInfoRow('Surname', mrzData.lastName)}
        {renderInfoRow('Date of Birth', mrzData.dateOfBirth)}
        {renderInfoRow('Gender', capitalize(mrzData.sex))}
        {renderInfoRow('Nationality', mrzData.nationalityRaw)}
        {/* Document Info */}
        <Text style={styles.sectionTitle}>Document Info</Text>

        {renderInfoRow(
          'Doc. Type',
          mrzData.documentType === 'MRTD_TD1_ID'
            ? 'ID (TD1)'
            : mrzData.documentType === 'MRTD_TD2_ID'
            ? 'ID (TD2)'
            : 'Passport (TD3)',
        )}
        {renderInfoRow('Doc. Number', mrzData.documentNumber)}
        {renderInfoRow('Expiry Date', mrzData.dateOfExpire)}
        {/* Raw MRZ Text */}
        <Text style={styles.sectionTitle}>Raw MRZ Text</Text>
        <Text style={styles.rawMrz}>{mrzData.mrzText || '—'}</Text>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.bottomBtn} onPress={ScanMRZ}>
          <Text style={styles.bottomBtnText}>Scan an MRZ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const BG = '#000000';
const SURFACE = '#1a1a1a';
const WHITE = '#ffffff';
const GREY = '#aaaaaa';
const ACCENT = '#e94560';
const BTN_GREY = '#555555';

const styles = StyleSheet.create({
  // Idle / Error screen
  idleContainer: {
    flex: 1,
    backgroundColor: BG,
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 24,
    paddingBottom: 32,
  },
  idleHint: {
    color: GREY,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  errorText: {
    color: ACCENT,
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 32,
    fontFamily: 'monospace',
  },
  scanButton: {
    backgroundColor: BTN_GREY,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 48,
  },
  scanButtonText: {
    color: WHITE,
    fontSize: 16,
    fontWeight: '600',
  },

  // Result screen
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 8,
  },

  // Header
  headerSection: {
    flexDirection: 'row',
    minHeight: 100,
    marginBottom: 24,
  },
  headerTextBlock: {
    flex: 4,
    justifyContent: 'center',
    paddingVertical: 8,
    paddingRight: 8,
  },
  fullName: {
    color: WHITE,
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: -0.3,
  },
  genderAge: {
    color: GREY,
    fontSize: 14,
    marginTop: 4,
  },
  expiryShort: {
    color: GREY,
    fontSize: 14,
    marginTop: 4,
  },
  portraitBox: {
    flex: 1,
    borderRadius: 4,
  },
  portraitPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  portraitPlaceholderIcon: {
    fontSize: 48,
    opacity: 0.5,
  },

  // Image tab switcher
  imageTabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#333333',
  },
  imageTab: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    alignItems: 'center',
  },
  imageTabText: {
    color: GREY,
    fontSize: 14,
    fontWeight: '500',
  },
  imageTabTextActive: {
    color: WHITE,
    fontWeight: '700',
  },
  imageTabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: WHITE,
    borderRadius: 1,
  },

  // Document image section
  imageSection: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 24,
  },
  docImage: {
    flex: 1,
    height: 162,
    borderRadius: 4,
  },
  docImageHalf: {
    flex: 1,
  },

  // Section title
  sectionTitle: {
    color: WHITE,
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 24,
    marginBottom: 4,
  },

  // Info rows
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: SURFACE,
  },
  infoLabel: {
    flex: 1,
    color: GREY,
    fontSize: 14,
  },
  infoValue: {
    flex: 1,
    color: WHITE,
    fontSize: 14,
    fontWeight: 'bold',
  },

  // Raw MRZ
  rawMrz: {
    color: WHITE,
    fontFamily: 'monospace',
    fontSize: 13,
    paddingTop: 8,
    paddingBottom: 16,
  },

  // Bottom button
  bottomButtons: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 32,
    backgroundColor: BG,
  },
  bottomBtn: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BTN_GREY,
  },
  bottomBtnText: {
    color: WHITE,
    fontSize: 15,
    fontWeight: '600',
  },
});

export default App;
