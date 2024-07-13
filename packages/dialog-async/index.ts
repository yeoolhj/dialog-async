import {
  PropType,
  defineComponent,
  h,
  inject,
  markRaw,
  provide,
  reactive,
  ref,
} from "vue";

const dialogs = reactive(new Set<DialogPromise<any>>());

const dialogPropsNames = { visible: "visible", onCancel: "onCancel" };

class DialogPromise<T = unknown> extends Promise<T> {
  #resolve!: (value?: any) => void;
  #reject!: (value?: any) => void;
  component!: JSX.Element | ((dialog: DialogPromise<T>) => JSX.Element);

  #visible = ref(false);

  get visible() {
    return this.#visible.value;
  }

  get props() {
    return {
      [dialogPropsNames.visible]: this.visible,
      [dialogPropsNames.onCancel]: () => this.cancel(),
    };
  }

  init(
    component: DialogPromise<T>["component"],
    resolve: (value?: any) => void,
    reject: (value?: any) => void
  ) {
    this.component = component;
    this.#resolve = resolve;
    this.#reject = reject;
  }

  submit = (value?: any) => {
    this.#resolve(value);
    this.close();
  };

  cancel = () => {
    this.#reject(new Error("dialog:cancel"));
    this.close();
  };

  show() {
    dialogs.add(markRaw(this));
    this.#visible.value = true;
  }

  private close() {
    this.#visible.value = false;

    setTimeout(() => {
      const hasDialog = dialogs.has(this);
      if (hasDialog) {
        dialogs.delete(this);
      }
    }, 500);
  }
}

const dialogName = Symbol("dialog");

const DialogItem = defineComponent({
  props: {
    dialog: {
      type: DialogPromise,
      required: true,
    },
  },
  setup(props) {
    provide(dialogName, props.dialog);
    return () => {
      const { component } = props.dialog;
      const isJsx = isJSXElement(component);
      return isJsx ? component : component(props.dialog);
    };
  },
});

function isJSXElement(
  component: DialogPromise["component"]
): component is JSX.Element {
  return typeof component && (component as any).__v_isVNode;
}

export const DialogProvider = defineComponent({
  props: {
    dialogPropsNames: {
      type: Object as PropType<{ visible?: string; onCancel?: string }>,
      default: {},
    },
  },
  setup(props, { slots }) {
    Object.assign(dialogPropsNames, props.dialogPropsNames);
    return () => [
      slots.default?.(),
      ...Array.from(dialogs).map((dialog: any) => h(DialogItem, { dialog })),
    ];
  },
});

export function showDialog<T = unknown>(
  component: DialogPromise<T>["component"]
) {
  const dialog = new DialogPromise<T>((resolve, reject) => {
    Promise.resolve().then(() => {
      dialog.init(component, resolve, reject);
      dialog.show();
    });
  });

  return dialog;
}

export function useDialog() {
  const dialog = inject<DialogPromise>(dialogName);
  if (dialog) {
    return dialog;
  } else {
    throw new Error("没有可用的dialog");
  }
}

export function clearDialogs() {
  dialogs.forEach((dialog: any) => dialog.cancel());
  dialogs.clear();
}
