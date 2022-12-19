"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamsoftCameraView = exports.DCVCameraView = void 0;
const React = __importStar(require("react"));
const react_native_1 = require("react-native");
const DBRModule = react_native_1.NativeModules.RNDynamsoftBarcodeReader;
const DCEView = (0, react_native_1.requireNativeComponent)('DYSCameraView');
const mapValues = (input, mapper) => {
    const result = {};
    Object.entries(input).map(([key, value]) => {
        result[key] = mapper(value, key);
    });
    return result;
};
class DCVCameraView extends React.Component {
    constructor(props) {
        super(props);
    }
    /**
    * Open the camera.
    */
    open() {
        this.dispatcher.open();
    }
    /**
    * Open the camera.
    */
    close() {
        this.dispatcher.close();
    }
    componentDidMount() {
        this.dispatcher = new CommandDispatcher((0, react_native_1.findNodeHandle)(this.references));
        if (react_native_1.Platform.OS === 'ios') {
            this.open();
        }
    }
    componentWillUnmount() {
        if (react_native_1.Platform.OS === 'ios') {
            this.close();
        }
    }
    convertNativeProps(_a) {
        var { children } = _a, props = __rest(_a, ["children"]);
        const newProps = mapValues(props, this.convertProp);
        return newProps;
    }
    convertProp(value, key) {
        if (typeof value === 'string' && DCVCameraView.ConversionTables[key]) {
            return DCVCameraView.ConversionTables[key][value];
        }
        return value;
    }
    render() {
        const _a = this.convertNativeProps(this.props), { style } = _a, nativeProps = __rest(_a, ["style"]);
        return (React.createElement(react_native_1.View, { style: style },
            React.createElement(DCEView, Object.assign({ style: react_native_1.StyleSheet.absoluteFill, ref: (ref) => { this.references = ref; } }, nativeProps)),
            this.props.children));
    }
}
exports.DCVCameraView = DCVCameraView;
DCVCameraView.ConversionTables = {
    torchState: DBRModule.TorchState
};
/**
 * @deprecated since version 1.1.5,
 * use DCVCameraView instead.
 */
exports.DynamsoftCameraView = DCVCameraView;
class CommandDispatcher {
    constructor(viewHandle) {
        //console.log(viewHandle)
        this.dceViewHandle = viewHandle;
    }
    getViewManagerConfig(viewManagerConfig) {
        if (react_native_1.UIManager.getViewManagerConfig) {
            return react_native_1.UIManager.getViewManagerConfig(viewManagerConfig);
        }
        else {
            return react_native_1.UIManager[viewManagerConfig];
        }
    }
    open() {
        if (this.getViewManagerConfig('DYSCameraView')) {
            react_native_1.UIManager.dispatchViewManagerCommand(this.dceViewHandle, this.getViewManagerConfig('DYSCameraView').Commands.open, undefined);
        }
    }
    close() {
        react_native_1.UIManager.dispatchViewManagerCommand(this.dceViewHandle, this.getViewManagerConfig('DYSCameraView').Commands.close, undefined);
    }
}
//# sourceMappingURL=DynamsoftCameraView.js.map