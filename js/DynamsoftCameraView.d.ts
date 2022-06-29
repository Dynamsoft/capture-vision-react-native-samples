import React from 'react';
import {Region} from './BarcodeSettings'
export class DynamsoftCameraView extends React.Component {
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): boolean;
    scanRegionVisible: boolean;
    overlayVisible: boolean;
    scanRegion: Region;
}
