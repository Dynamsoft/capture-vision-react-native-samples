import * as React from 'react';
import { ViewProps } from 'react-native';
import { Region } from './BasicStructures';
import { EnumCameraPosition, EnumTorchState, TorchButton } from './CameraSettings';
interface Props extends ViewProps {
    cameraPosition?: EnumCameraPosition;
    overlayVisible?: boolean;
    scanRegionVisible?: boolean;
    scanRegion?: Region;
    torchState?: string | EnumTorchState;
    torchButton?: TorchButton;
}
export declare class DCVCameraView extends React.Component<Props, {}> {
    dispatcher: CommandDispatcher;
    references: number | React.ComponentClass<any, any> | React.Component<any, any, any> | null;
    constructor(props: Props);
    static ConversionTables: {
        torchState: any;
    };
    open(): void;
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
