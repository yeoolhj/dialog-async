import { PropType } from "vue";
declare class DialogPromise<T = unknown> extends Promise<T> {
    #private;
    component: JSX.Element | ((dialog: DialogPromise<T>) => JSX.Element);
    get visible(): any;
    get props(): {
        [x: string]: any;
    };
    init(component: DialogPromise<T>["component"], resolve: (value?: any) => void, reject: (value?: any) => void): void;
    submit: (value?: any) => void;
    cancel: () => void;
    show(): void;
    private close;
}
export declare const DialogProvider: import("vue").DefineComponent<{
    dialogPropsNames: {
        type: PropType<{
            visible?: string;
            onCancel?: string;
        }>;
        default: {};
    };
}, () => (import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}> | import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>[] | undefined)[], unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    dialogPropsNames: {
        type: PropType<{
            visible?: string;
            onCancel?: string;
        }>;
        default: {};
    };
}>>, {
    dialogPropsNames: {
        visible?: string;
        onCancel?: string;
    };
}, {}>;
export declare function showDialog<T = unknown>(component: DialogPromise<T>["component"]): DialogPromise<T>;
export declare function useDialog(): DialogPromise<unknown>;
export declare function clearDialogs(): void;
export {};
