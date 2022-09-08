import { Rect } from "./BasicStructures";

export interface TorchButton {
    location: Rect;
    visible: boolean;
    torchOnImageBase64: string;
    torchOffImageBase64: string;
}


export enum EnumTorchState {
    OFF,
    ON
}

export enum EnumCameraPosition {
    CP_BACK,
    CP_FRONT
}