"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _DialogPromise_resolve, _DialogPromise_reject, _DialogPromise_visible;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DialogProvider = void 0;
exports.showDialog = showDialog;
exports.useDialog = useDialog;
exports.clearDialogs = clearDialogs;
const vue_1 = require("vue");
const dialogs = (0, vue_1.reactive)(new Set());
const dialogPropsNames = { visible: "visible", onCancel: "onCancel" };
class DialogPromise extends Promise {
    constructor() {
        super(...arguments);
        _DialogPromise_resolve.set(this, void 0);
        _DialogPromise_reject.set(this, void 0);
        _DialogPromise_visible.set(this, (0, vue_1.ref)(false));
        this.submit = (value) => {
            __classPrivateFieldGet(this, _DialogPromise_resolve, "f").call(this, value);
            this.close();
        };
        this.cancel = () => {
            __classPrivateFieldGet(this, _DialogPromise_reject, "f").call(this, new Error("dialog:cancel"));
            this.close();
        };
    }
    get visible() {
        return __classPrivateFieldGet(this, _DialogPromise_visible, "f").value;
    }
    get props() {
        return {
            [dialogPropsNames.visible]: this.visible,
            [dialogPropsNames.onCancel]: () => this.cancel(),
        };
    }
    init(component, resolve, reject) {
        this.component = component;
        __classPrivateFieldSet(this, _DialogPromise_resolve, resolve, "f");
        __classPrivateFieldSet(this, _DialogPromise_reject, reject, "f");
    }
    show() {
        dialogs.add((0, vue_1.markRaw)(this));
        __classPrivateFieldGet(this, _DialogPromise_visible, "f").value = true;
    }
    close() {
        __classPrivateFieldGet(this, _DialogPromise_visible, "f").value = false;
        setTimeout(() => {
            const hasDialog = dialogs.has(this);
            if (hasDialog) {
                dialogs.delete(this);
            }
        }, 500);
    }
}
_DialogPromise_resolve = new WeakMap(), _DialogPromise_reject = new WeakMap(), _DialogPromise_visible = new WeakMap();
const dialogName = Symbol("dialog");
const DialogItem = (0, vue_1.defineComponent)({
    props: {
        dialog: {
            type: DialogPromise,
            required: true,
        },
    },
    setup(props) {
        (0, vue_1.provide)(dialogName, props.dialog);
        return () => {
            const { component } = props.dialog;
            const isJsx = isJSXElement(component);
            return isJsx ? component : component(props.dialog);
        };
    },
});
function isJSXElement(component) {
    return typeof component && component.__v_isVNode;
}
exports.DialogProvider = (0, vue_1.defineComponent)({
    props: {
        dialogPropsNames: {
            type: Object,
            default: {},
        },
    },
    setup(props, { slots }) {
        Object.assign(dialogPropsNames, props.dialogPropsNames);
        return () => {
            var _a;
            return [
                (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots),
                ...Array.from(dialogs).map((dialog) => (0, vue_1.h)(DialogItem, { dialog })),
            ];
        };
    },
});
function showDialog(component) {
    const dialog = new DialogPromise((resolve, reject) => {
        Promise.resolve().then(() => {
            dialog.init(component, resolve, reject);
            dialog.show();
        });
    });
    return dialog;
}
function useDialog() {
    const dialog = (0, vue_1.inject)(dialogName);
    if (dialog) {
        return dialog;
    }
    else {
        throw new Error("没有可用的dialog");
    }
}
function clearDialogs() {
    dialogs.forEach((dialog) => dialog.cancel());
    dialogs.clear();
}
