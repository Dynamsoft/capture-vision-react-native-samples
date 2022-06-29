import React from 'react';
import PropTypes from 'prop-types';
import {
    findNodeHandle,
    requireNativeComponent,
    View,
    StyleSheet,
    Platform, UIManager
} from 'react-native';

const propTypes = {
    name: 'DYSCameraView',
    propTypes: {
        scanRegionVisible: PropTypes.bool,
        overlayVisible: PropTypes.bool,
        scanRegion: PropTypes.shape({
            regionLeft: PropTypes.number,
            regionRight: PropTypes.number,
            regionTop: PropTypes.number,
            regionBottom: PropTypes.number,
            regionMeasuredByPercentage: PropTypes.bool
        }),
        ...View.propTypes
    }
};

const ReactDCEView = requireNativeComponent('DYSCameraView', propTypes);

export class DynamsoftCameraView extends React.Component {

    componentDidMount() {
        this.dispatcher = new CommandDispatcher(findNodeHandle(this.references));
        if(Platform.OS === 'ios') {
            this.open()
        }
    }

    componentWillUnmount(){
        if(Platform.OS === 'ios') {
            this.close()
        }
    }

    renderChildren = () => {
        return this.props.children
    }

    render() {
        return (
            <View style={this.props.style}>
                <ReactDCEView
                    style={StyleSheet.absoluteFill}
                    ref={(ref) => {
                        this.references = ref
                    }}
                    overlayVisible={this.props.overlayVisible}
                    scanRegionVisible={this.props.scanRegionVisible}
                    scanRegion={this.props.scanRegion}
                />
                {this.renderChildren()}
            </View>
        );
    }

    open() {
        this.dispatcher.open();
    }

    close() {
        this.dispatcher.close();
    }

}

class CommandDispatcher {
    dceViewHandle;

    constructor(viewHandle) {
        //console.log(viewHandle)
        this.dceViewHandle = viewHandle;
    }

    getViewManagerConfig(viewManagerConfig) {
        if (UIManager.getViewManagerConfig) {
            return UIManager.getViewManagerConfig(viewManagerConfig);
        } else {
            return UIManager[viewManagerConfig];
        }
    }

    open() {
        UIManager.dispatchViewManagerCommand(
            this.dceViewHandle,
            this.getViewManagerConfig('DYSCameraView').Commands.open,
            null);
    }

    close() {
        UIManager.dispatchViewManagerCommand(
            this.dceViewHandle,
            this.getViewManagerConfig('DYSCameraView').Commands.close,
            null);
    }

}


