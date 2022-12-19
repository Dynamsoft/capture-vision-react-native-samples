import { Rect } from "./BasicStructures";

export interface TorchButton {
    /**
    * Defines the location of the torch button.
    */
    location: Rect;
    /**
    * True: the torch will be displayed.
    * False: the torch will be hide.
    */
    visible: boolean;
    /**
    * A base 64 string that specify the torch on image.
    * When the torch is on, this image will be displayed as the torch image.
    */
    torchOnImageBase64: string;
    /**
    * A base 64 string that specify the torch off image.
    * When the torch is off, this image will be displayed as the torch image.
    */
    torchOffImageBase64: string;
}


export enum EnumTorchState {
    /**
    * Set the torch state to off.
    */
    OFF,
    /**
    * Set the torch state to on.
    */
    ON
}

export enum EnumCameraPosition {
    /**
    * Use the back-facing camera.
    */
    CP_BACK,
    /**
    * Use the front-facing camera.
    */
    CP_FRONT
}