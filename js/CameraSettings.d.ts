import { Rect } from "./BasicStructures";
export interface TorchButton {
    location: Rect;
    visible: boolean;
    torchOnImageBase64: string;
    torchOffImageBase64: string;
}
export declare enum EnumTorchState {
    ON = 0,
    OFF = 1
}
