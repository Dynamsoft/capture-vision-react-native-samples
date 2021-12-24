// @flow
import React from 'react';
import PropTypes from 'prop-types';
import {
  findNodeHandle,
  Platform,
  NativeModules,
  ViewPropTypes,
  requireNativeComponent,
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  PermissionsAndroid,
} from 'react-native';

const Rationale = PropTypes.shape({
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  buttonPositive: PropTypes.string,
  buttonNegative: PropTypes.string,
  buttonNeutral: PropTypes.string,
});

const requestPermissions = async (
  CameraManager: any,
  androidCameraPermissionOptions: Rationale | null,
): Promise<{ hasCameraPermissions: boolean }> => {
  let hasCameraPermissions = false;

  if (Platform.OS === 'ios') {
    hasCameraPermissions = await CameraManager.checkVideoAuthorizationStatus();
  } else if (Platform.OS === 'android') {
    const cameraPermissionResult = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      androidCameraPermissionOptions,
    );
    if (typeof cameraPermissionResult === 'boolean') {
      hasCameraPermissions = cameraPermissionResult;
    } else {
      hasCameraPermissions = cameraPermissionResult === PermissionsAndroid.RESULTS.GRANTED;
    }
  }

  return {
    hasCameraPermissions,
  };
};

const styles = StyleSheet.create({
  authorizationContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
type TrackedBarcodeFeature = {
  bounds: {
    size: {
      width: number,
      height: number,
    },
    origin: {
      x: number,
      y: number,
    },
  },
  data: string,
  dataRaw: string,
  type: BarcodeFormat,
  format?: string,
};

type BarcodeFormat =
  | 'EMAIL';

type EventCallbackArgumentsType = {
  nativeEvent: Object,
};

type PropsType = typeof View.props & {
  zoom?: number,
  type?: number | string,
  onCameraReady?: Function,
  onStatusChange?: Function,
  onDynamsoftBarcodesReader?: ({ barcodes: Array<TrackedBarcodeFeature> }) => void,
  flashMode?: number | string,
  barCodeTypes?: Array<string>,
  dynamsoftBarcodeFormat?: number,
  autoFocus?: string | boolean | number,
  useCamera2Api?: boolean,
  playSoundOnCapture?: boolean,
  videoStabilizationMode?: number | string
};

type StateType = {
  isAuthorized: boolean,
  isAuthorizationChecked: boolean,
};

export type Status = 'READY' | 'PENDING_AUTHORIZATION' | 'NOT_AUTHORIZED';

const CameraStatus: { [key: Status]: Status } = {
  READY: 'READY',
  PENDING_AUTHORIZATION: 'PENDING_AUTHORIZATION',
  NOT_AUTHORIZED: 'NOT_AUTHORIZED',
};

const CameraManager: Object = NativeModules.DBRRNCameraManager || 
  NativeModules.DBRRNCameraModule || {
    Type: {
      back: 1,
    },
    AutoFocus: {
      on: 1,
    },
    FlashMode: {
      off: 1,
    },
    DynamsoftBarcodeFormats: {
      BarcodeFormat: 0,
      BarcodeFormat2: 0
    },
  };

const EventThrottleMs = 500;

const mapValues = (input, mapper) => {
  const result = {};
  Object.entries(input).map(([key, value]) => {
    result[key] = mapper(value, key);
  });
  return result;
};

export default class Camera extends React.Component<PropsType, StateType> {
  static Constants = {
    Type: CameraManager.Type,
    FlashMode: CameraManager.FlashMode,
    AutoFocus: CameraManager.AutoFocus,
    DynamsoftBarcodeFormats: CameraManager.DynamsoftBarcodeFormats,
    CameraStatus,
  };

  // Values under keys from this object will be transformed to native options
  static ConversionTables = {
    type: CameraManager.Type,
    flashMode: CameraManager.FlashMode,
    autoFocus: CameraManager.AutoFocus,
    barcodeFormat: (CameraManager.DynamsoftBarcodeFormats || {}).BarcodeFormat,
    barcodeFormat2: (CameraManager.DynamsoftBarcodeFormats || {}).BarcodeFormat2,
  };

  static propTypes = {
    ...ViewPropTypes,
    zoom: PropTypes.number,
    onMountError: PropTypes.func,
    onCameraReady: PropTypes.func,
    onStatusChange: PropTypes.func,
    onDynamsoftBarcodesReader: PropTypes.func,
    barCodeTypes: PropTypes.arrayOf(PropTypes.string),
    dynamsoftBarcodeFormat: PropTypes.number,
    type: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    cameraId: PropTypes.string,
    flashMode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    autoFocus: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
    permissionDialogTitle: PropTypes.string,
    permissionDialogMessage: PropTypes.string,
    androidCameraPermissionOptions: Rationale,
    notAuthorizedView: PropTypes.element,
    pendingAuthorizationView: PropTypes.element,
    useCamera2Api: PropTypes.bool,
    playSoundOnCapture: PropTypes.bool,
    rectOfInterest: PropTypes.any,
    defaultVideoQuality: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  };

  static defaultProps: Object = {
    zoom: 0,
    type: CameraManager.Type.back,
    cameraId: null,
    autoFocus: CameraManager.AutoFocus.on,
    flashMode: CameraManager.FlashMode.off,
    barcodeFormat: ((CameraManager.DynamsoftBarcodeFormats || {}).BarcodeFormat || {})
    .NULL,
    barcodeFormat2: ((CameraManager.DynamsoftBarcodeFormats || {}).BarcodeFormat2 || {})
    .NULL,
    permissionDialogTitle: '',
    permissionDialogMessage: '',
    androidCameraPermissionOptions: null,
    pendingAuthorizationView: (
      <View style={styles.authorizationContainer}>
        <ActivityIndicator size="small" />
      </View>
    ),
    useCamera2Api: false,
    playSoundOnCapture: false,
  };

  _cameraRef: ?Object;
  _cameraHandle: ?number;
  _lastEvents: { [string]: string };
  _lastEventsTimes: { [string]: Date };
  _isMounted: boolean;

  constructor(props: PropsType) {
    super(props);
    this._lastEvents = {};
    this._lastEventsTimes = {};
    this._isMounted = true;
    this.state = {
      isAuthorized: false,
      isAuthorizationChecked: false,
    };
  }

  _onMountError = ({ nativeEvent }: EventCallbackArgumentsType) => {
    if (this.props.onMountError) {
      this.props.onMountError(nativeEvent);
    }
  };

  _onCameraReady = () => {
    if (this.props.onCameraReady) {
      this.props.onCameraReady();
    }
  };

  _onStatusChange = () => {
    if (this.props.onStatusChange) {
      this.props.onStatusChange({
        cameraStatus: this.getStatus(),
      });
    }
  };

  _onObjectDetected = (callback: ?Function) => ({ nativeEvent }: EventCallbackArgumentsType) => {
    const { type } = nativeEvent;
    if (
      this._lastEvents[type] &&
      this._lastEventsTimes[type] &&
      JSON.stringify(nativeEvent) === this._lastEvents[type] &&
      new Date() - this._lastEventsTimes[type] < EventThrottleMs
    ) {
      return;
    }

    if (callback) {
      callback(nativeEvent);
      this._lastEventsTimes[type] = new Date();
      this._lastEvents[type] = JSON.stringify(nativeEvent);
    }
  };

  _setReference = (ref: ?Object) => {
    if (ref) {
      this._cameraRef = ref;
      this._cameraHandle = findNodeHandle(ref);
    } else {
      this._cameraRef = null;
      this._cameraHandle = null;
    }
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  async arePermissionsGranted() {
    const {
      permissionDialogTitle,
      permissionDialogMessage,
      androidCameraPermissionOptions,
    } = this.props;

    let cameraPermissions = androidCameraPermissionOptions;
    if (permissionDialogTitle || permissionDialogMessage) {
      // eslint-disable-next-line no-console
      console.warn(
        'permissionDialogTitle and permissionDialogMessage are deprecated. Please use androidCameraPermissionOptions instead.',
      );
      cameraPermissions = {
        ...cameraPermissions,
        title: permissionDialogTitle,
        message: permissionDialogMessage,
      };
    }

    const { hasCameraPermissions } = await requestPermissions(
      CameraManager,
      cameraPermissions
    );

    return { hasCameraPermissions };
  }

  async refreshAuthorizationStatus() {
    const {hasCameraPermissions} = await this.arePermissionsGranted();
    if (this._isMounted === false) {
      return;
    }

    this.setState({
      isAuthorized: hasCameraPermissions,
      isAuthorizationChecked: true,
    });
  }

  async componentDidMount() {
    const {
      hasCameraPermissions,
    } = await this.arePermissionsGranted();
    if (this._isMounted === false) {
      return;
    }

    this.setState(
      {
        isAuthorized: hasCameraPermissions,
        isAuthorizationChecked: true,
      },
      this._onStatusChange,
    );
  }

  getStatus = (): Status => {
    const { isAuthorized, isAuthorizationChecked } = this.state;
    if (isAuthorizationChecked === false) {
      return CameraStatus.PENDING_AUTHORIZATION;
    }
    return isAuthorized ? CameraStatus.READY : CameraStatus.NOT_AUTHORIZED;
  };

  // FaCC = Function as Child Component;
  hasFaCC = (): * => typeof this.props.children === 'function';

  renderChildren = (): * => {
    if (this.hasFaCC()) {
      return this.props.children({
        camera: this,
        status: this.getStatus(),
      });
    }
    return this.props.children;
  };

  render() {
    const { style, ...nativeProps } = this._convertNativeProps(this.props);

    if (this.state.isAuthorized || this.hasFaCC()) {
      return (
        <View style={style}>
          <DBRRNCamera
            {...nativeProps}
            style={StyleSheet.absoluteFill}
            ref={this._setReference}
            onMountError={this._onMountError}
            onCameraReady={this._onCameraReady}
            onDynamsoftBarcodesReader={this._onObjectDetected(
              this.props.onDynamsoftBarcodesReader,
            )}
          />
          {this.renderChildren()}
        </View>
      );
    } else if (!this.state.isAuthorizationChecked) {
      return this.props.pendingAuthorizationView;
    } else {
      return this.props.notAuthorizedView;
    }
  }

  _convertNativeProps({ children, ...props }: PropsType) {
    const newProps = mapValues(props, this._convertProp);

    if (props.onDynamsoftBarcodesReader) {
        newProps.dynamsoftBarcodeReaderEnabled = true;
    }
    return newProps;
  }

  _convertProp(value: *, key: string): * {
    if (typeof value === 'string' && Camera.ConversionTables[key]) {
      return Camera.ConversionTables[key][value];
    }

    return value;
  }
}

export const Constants = Camera.Constants;

const DBRRNCamera = requireNativeComponent('DBRRNCamera', Camera, {
  nativeOnly: {
    accessibilityComponentType: true,
    accessibilityLabel: true,
    accessibilityLiveRegion: true,
    dynamsoftBarcodeReaderEnabled: true,
    importantForAccessibility: true,
    onDynamsoftBarcodesReader: true,
    onCameraReady: true,
    onLayout: true,
    onMountError: true,
    onSubjectAreaChanged: true,
    renderToHardwareTextureAndroid: true,
    testID: true,
  },
});
