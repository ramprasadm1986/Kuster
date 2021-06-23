"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const react_native_1 = require("react-native");
const MediaPicker_style_1 = require("./MediaPicker.style");
const react_native_modalize_1 = require("react-native-modalize");
const react_native_dynamic_vector_icons_1 = tslib_1.__importDefault(require("react-native-dynamic-vector-icons"));
const react_native_helpers_1 = require("@freakycoder/react-native-helpers");
const react_native_image_crop_picker_1 = tslib_1.__importDefault(require("react-native-image-crop-picker"));
class MediaPicker extends React.Component {
    constructor() {
        super(...arguments);
        this.modal = React.createRef();
        this.openModal = () => {
            if (this.modal.current) {
                this.modal.current.open();
            }
        };
        this.closeModal = () => {
            if (this.modal.current) {
                this.modal.current.close();
            }
        };
        this.openGallery = () => {
            this.closeModal();
            return react_native_image_crop_picker_1.default.openPicker({
                multiple: this.props.multiple,
                writeTempFile: true,
                compressImageQuality: this.props.compressImageQuality,
            });
        };
        this.openCamera = () => {
            this.closeModal();
            return react_native_image_crop_picker_1.default.openCamera({
                mediaType: "any",
                writeTempFile: true,
                compressImageQuality: this.props.compressImageQuality,
            });
        };
        this.handleCameraPressed = () => {
            this.openCamera()
                .then((image) => this.props.cameraOnPress && this.props.cameraOnPress(image))
                .catch((err) => this.props.cameraOnPress && this.props.cameraOnPress(err));
        };
        this.handleGalleryPressed = () => {
            this.openGallery()
                .then((images) => this.props.galleryOnPress && this.props.galleryOnPress(images))
                .catch((err) => this.props.galleryOnPress && this.props.galleryOnPress(err));
        };
        this.renderContent = () => {
            const { cameraText, galleryText, IconComponent, cameraIconName, cameraIconType, cameraIconSize, cameraIconColor, galleryIconName, galleryIconType, galleryIconSize, cameraTextColor, galleryIconColor, cameraButtonSize, galleryTextColor, galleryButtonSize, cameraButtonBackgroundColor, galleryButtonBackgroundColor, } = this.props;
            return (<react_native_1.View style={MediaPicker_style_1.styles.container}>
        <react_native_1.View style={MediaPicker_style_1.styles.containerGlue}>
          <react_native_1.View style={MediaPicker_style_1.styles.buttonContainer}>
            <react_native_1.TouchableOpacity style={[
                MediaPicker_style_1.styles.center,
                MediaPicker_style_1._buttonStyle(cameraButtonSize, cameraButtonBackgroundColor),
            ]} onPress={this.handleCameraPressed}>
              <IconComponent name={cameraIconName} type={cameraIconType} size={cameraIconSize} color={cameraIconColor}/>
            </react_native_1.TouchableOpacity>
            <react_native_1.Text style={MediaPicker_style_1._buttonTextStyle(cameraTextColor)}>{cameraText}</react_native_1.Text>
          </react_native_1.View>
          <react_native_1.View style={MediaPicker_style_1.styles.buttonContainer}>
            <react_native_1.TouchableOpacity style={[
                MediaPicker_style_1.styles.center,
                MediaPicker_style_1._buttonStyle(galleryButtonSize, galleryButtonBackgroundColor),
            ]} onPress={this.handleGalleryPressed}>
              <IconComponent name={galleryIconName} type={galleryIconType} size={galleryIconSize} color={galleryIconColor}/>
            </react_native_1.TouchableOpacity>
            <react_native_1.Text style={MediaPicker_style_1._buttonTextStyle(galleryTextColor)}>
              {galleryText}
            </react_native_1.Text>
          </react_native_1.View>
        </react_native_1.View>
      </react_native_1.View>);
        };
    }
    render() {
        const { backgroundColor, ...rest } = this.props;
        return (<react_native_modalize_1.Modalize ref={this.modal} snapPoint={react_native_helpers_1.isIPhoneXFamily() ? 115 : 100} modalStyle={MediaPicker_style_1._modalStyle(backgroundColor)} {...rest}>
        {this.renderContent()}
      </react_native_modalize_1.Modalize>);
    }
}
exports.default = MediaPicker;
MediaPicker.defaultProps = {
    multiple: true,
    cameraIconSize: 20,
    IconComponent: react_native_dynamic_vector_icons_1.default,
    galleryIconSize: 23,
    cameraText: "Camera",
    cameraButtonSize: 50,
    galleryButtonSize: 50,
    galleryText: "Gallery",
    cameraIconName: "camera",
    cameraIconColor: "#90a1fc",
    backgroundColor: "#90a1fc",
    cameraTextColor: "#fdfdfd",
    galleryIconType: "FontAwesome",
    galleryIconColor: "#90a1fc",
    galleryTextColor: "#fdfdfd",
    galleryIconName: "image",
    cameraIconType: "FontAwesome",
    cameraButtonBackgroundColor: "#fdfdfd",
    galleryButtonBackgroundColor: "#fdfdfd",
    compressImageQuality: 0.8,
};
