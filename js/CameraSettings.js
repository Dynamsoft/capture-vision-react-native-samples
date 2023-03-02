"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumCameraPosition = exports.EnumTorchState = void 0;
var EnumTorchState;
(function (EnumTorchState) {
    /**
    * Set the torch state to off.
    */
    EnumTorchState[EnumTorchState["OFF"] = 0] = "OFF";
    /**
    * Set the torch state to on.
    */
    EnumTorchState[EnumTorchState["ON"] = 1] = "ON";
})(EnumTorchState = exports.EnumTorchState || (exports.EnumTorchState = {}));
var EnumCameraPosition;
(function (EnumCameraPosition) {
    /**
    * Use the back-facing camera.
    */
    EnumCameraPosition[EnumCameraPosition["CP_BACK"] = 0] = "CP_BACK";
    /**
    * Use the front-facing camera.
    */
    EnumCameraPosition[EnumCameraPosition["CP_FRONT"] = 1] = "CP_FRONT";
})(EnumCameraPosition = exports.EnumCameraPosition || (exports.EnumCameraPosition = {}));
//# sourceMappingURL=CameraSettings.js.map