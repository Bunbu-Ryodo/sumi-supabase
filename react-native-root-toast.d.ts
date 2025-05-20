declare module "react-native-root-toast" {
  interface ToastOptions {
    duration?: number;
    position?: number;
    shadow?: boolean;
    animation?: boolean;
    hideOnPress?: boolean;
    delay?: number;
    onShow?: () => void;
    onShown?: () => void;
    onHide?: () => void;
    onHidden?: () => void;
    backgroundColor?: string;
    textColor?: string;
    containerStyle?: object;
  }
  interface ToastStatic {
    show(message: string, options?: ToastOptions): any;
    hide(toast: any): void;
    durations: { SHORT: number; LONG: number };
    positions: { TOP: number; BOTTOM: number; CENTER: number };
  }
  const Toast: ToastStatic;
  export default Toast;
}