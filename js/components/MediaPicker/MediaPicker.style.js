"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.styles = exports._buttonTextStyle = exports._buttonStyle = exports._modalStyle = void 0;
const react_native_1 = require("react-native");
exports._modalStyle = (backgroundColor) => ({
    backgroundColor,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32
});
exports._buttonStyle = (size, backgroundColor) => ({
    width: size,
    height: size,
    backgroundColor,
    borderRadius: size / 2
});
exports._buttonTextStyle = (color) => ({
    top: 3,
    color
});
exports.styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 16,
        alignItems: "center",
        justifyContent: "center"
    },
    center: {
        alignItems: "center",
        justifyContent: "center"
    },
    containerGlue: {
        width: "50%",
        flexDirection: "row",
        justifyContent: "space-evenly"
    },
    buttonContainer: {
        alignItems: "center",
        justifyContent: "center"
    },
    content__heading: {
        fontSize: 20,
        marginTop: 12,
        color: "#333",
        fontWeight: "500"
    },
    content__button: {
        paddingVertical: 15,
        width: "100%",
        backgroundColor: "#333",
        borderRadius: 6
    },
    content__buttonText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "600",
        textAlign: "center"
    }
});
