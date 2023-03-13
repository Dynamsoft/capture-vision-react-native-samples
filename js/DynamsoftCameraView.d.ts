import * as React from 'react';
import { ViewProps } from 'react-native';
import { Region } from './BasicStructures';
import { EnumCameraPosition, EnumTorchState, TorchButton } from './CameraSettings';
interface Props extends ViewProps {
    /**
    * Select the (front or back facing) camera.
    */
    cameraPosition?: EnumCameraPosition;
    /**
    * Set whether to display overlays to highlight the decoded barcodes.
    */
    overlayVisible?: boolean;
    /**
    * Set whether to display the scan region.
    */
    scanRegionVisible?: boolean;
    /**
    * Specify a region of interest with a region object.
    */
    scanRegion?: Region;
    /**
    * Set whether to turn on the torch.
    */
    torchState?: string | EnumTorchState;
    /**
    * Set the torch button with a TorchButton object.
    * You can configure the position, images and visibility of the button.
    */
    torchButton?: TorchButton;
}
export declare class DCVCameraView extends React.Component<Props, {}> {
    dispatcher: CommandDispatcher;
    references: any;
    constructor(props: Props);
    static ConversionTables: any;
    /**
    * Open the camera.
    */
    open(): void;
    /**
    * Open the camera.
    */
    close(): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    convertNativeProps({ children, ...props }: Props): Props;
    convertProp(value: any, key: string): any;
    render(): React.ReactElement | null;
}
/**
 * @deprecated since version 1.1.5,
 * use DCVCameraView instead.
 */
export declare const DynamsoftCameraView: typeof DCVCameraView;
declare class CommandDispatcher {
    dceViewHandle: any;
    constructor(viewHandle: any);
    getViewManagerConfig(viewManagerConfig: string): any;
    open(): void;
    close(): void;
}
export {};
