import * as React from 'react';
import {
    findNodeHandle,
    HostComponent,
    NativeModules,
    Platform,
    requireNativeComponent,
    StyleSheet,
    UIManager,
    View,
    ViewProps,
} from 'react-native';
import { Region } from './BasicStructures';
import { EnumCameraPosition, EnumTorchState, TorchButton } from './CameraSettings';

const DBRModule = NativeModules.RNDynamsoftBarcodeReader

interface Props extends ViewProps {
    /**
    * Select the (front or back facing) camera.
    */
    cameraPosition?: EnumCameraPosition
    /**
    * Set whether to display overlays to highlight the decoded barcodes.
    */
    overlayVisible?: boolean
    /**
    * Set whether to display the scan region.
    */
    scanRegionVisible?: boolean
    /**
    * Specify a region of interest with a region object.
    */
    scanRegion?: Region
    /**
    * Set whether to turn on the torch.
    */
    torchState?: string | EnumTorchState
    /**
    * Set the torch button with a TorchButton object.
    * You can configure the position, images and visibility of the button.
    */
    torchButton?: TorchButton
}

const DCEView: HostComponent<any> = requireNativeComponent('DYSCameraView');

const mapValues = (input: any, mapper: any) => {
    const result = {};
    Object.entries(input).map(([key, value]) => {
        result[key] = mapper(value, key);
    });
    return result;
};

export class DCVCameraView extends React.Component<Props, {}> {
    dispatcher!: CommandDispatcher;
    references!: number | React.ComponentClass<any, any> | React.Component<any, any, any> | null;

    constructor(props: Props) {
        super(props)
    }

    static ConversionTables = {
        torchState: DBRModule.TorchState
    }

    /**
    * Open the camera.
    */
    open(): void {
        this.dispatcher.open();
    }

    /**
    * Open the camera.
    */
    close(): void {
        this.dispatcher.close();
    }

    componentDidMount(): void {
        this.dispatcher = new CommandDispatcher(findNodeHandle(this.references));
        if(Platform.OS === 'ios') {
            this.open()
        }
    }

    componentWillUnmount(): void{
        if(Platform.OS === 'ios') {
            this.close()
        }
    }

    convertNativeProps({ children, ...props }: Props) : Props {
        const newProps = mapValues(props, this.convertProp);
        return newProps;
    }

    convertProp(value: any, key: string): any {
        if (typeof value === 'string' && DCVCameraView.ConversionTables[key]) {
            return DCVCameraView.ConversionTables[key][value];
        }
        return value;
    }

    render(): React.ReactElement | null {
        const { style, ...nativeProps } : Props = this.convertNativeProps(this.props);
        return (
            <View style={style}>
                <DCEView
                    style={StyleSheet.absoluteFill}
                    ref={(ref) => { this.references = ref }}
                    {...nativeProps}
                />
                {this.props.children}

            </View>
        )
    }
}

/**
 * @deprecated since version 1.1.5,
 * use DCVCameraView instead.
 */
export const DynamsoftCameraView = DCVCameraView;

class CommandDispatcher {
    dceViewHandle: any;

    constructor(viewHandle: any) {
        //console.log(viewHandle)
        this.dceViewHandle = viewHandle;
    }

    getViewManagerConfig(viewManagerConfig: string) {
        if (UIManager.getViewManagerConfig) {
            return UIManager.getViewManagerConfig(viewManagerConfig);
        } else {
            return UIManager[viewManagerConfig];
        }
    }

    open() {
        if (this.getViewManagerConfig('DYSCameraView')) {
            UIManager.dispatchViewManagerCommand(
                this.dceViewHandle,
                this.getViewManagerConfig('DYSCameraView').Commands.open,
                undefined);
        }

    }

    close() {
        UIManager.dispatchViewManagerCommand(
            this.dceViewHandle,
            this.getViewManagerConfig('DYSCameraView').Commands.close,
            undefined);
    }

}
