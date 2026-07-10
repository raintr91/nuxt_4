'use client';

import { create } from 'zustand';

export type DialogType = 'info' | 'warning' | 'confirm' | 'error';

export interface DialogParams {
  title?: string;
  text?: string;
  type?: DialogType;
  btnConfirmTitle?: string;
  btnCancelTitle?: string;
  hideBtn?: boolean;
  hideBtnConfirm?: boolean;
  hideBtnCancel?: boolean;
  onConfirm?: () => void;
}

interface DialogStore {
  visible: boolean;
  title: string;
  text: string;
  type: DialogType;
  btnConfirmTitle: string;
  btnCancelTitle: string;
  hideBtn: boolean;
  hideBtnConfirm: boolean;
  hideBtnCancel: boolean;
  onConfirm?: () => void;
  show: (params: DialogParams) => void;
  hide: () => void;
  confirm: () => void;
}

export const useDialogStore = create<DialogStore>((set, get) => ({
  visible: false,
  title: '',
  text: '',
  type: 'info',
  btnConfirmTitle: 'OK',
  btnCancelTitle: 'キャンセル',
  hideBtn: false,
  hideBtnConfirm: false,
  hideBtnCancel: false,
  onConfirm: undefined,
  show(params) {
    set({
      visible: true,
      title: params.title ?? '',
      text: params.text ?? '',
      type: params.type ?? 'info',
      btnConfirmTitle: params.btnConfirmTitle ?? 'OK',
      btnCancelTitle: params.btnCancelTitle ?? 'キャンセル',
      hideBtn: params.hideBtn ?? false,
      hideBtnConfirm: params.hideBtnConfirm ?? false,
      hideBtnCancel: params.hideBtnCancel ?? false,
      onConfirm: params.onConfirm,
    });
  },
  hide() {
    set({ visible: false, onConfirm: undefined });
  },
  confirm() {
    get().onConfirm?.();
    get().hide();
  },
}));
