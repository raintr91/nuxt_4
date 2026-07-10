'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useDialogStore } from '@/stores/use-dialog-store';
import { dialogBtnTestId } from '@/lib/test-id';

export function ConfirmDialogHost() {
  const visible = useDialogStore((s) => s.visible);
  const title = useDialogStore((s) => s.title);
  const text = useDialogStore((s) => s.text);
  const btnConfirmTitle = useDialogStore((s) => s.btnConfirmTitle);
  const btnCancelTitle = useDialogStore((s) => s.btnCancelTitle);
  const hideBtnCancel = useDialogStore((s) => s.hideBtnCancel);
  const hide = useDialogStore((s) => s.hide);
  const confirm = useDialogStore((s) => s.confirm);

  return (
    <Dialog open={visible} onOpenChange={(open) => !open && hide()}>
      <DialogContent data-testid="app-dialog">
        <DialogHeader>
          {title ? <DialogTitle>{title}</DialogTitle> : null}
          {text ? <DialogDescription>{text}</DialogDescription> : null}
        </DialogHeader>
        <DialogFooter>
          {!hideBtnCancel ? (
            <Button
              variant="outline"
              onClick={hide}
              testId={dialogBtnTestId('app-dialog', 'cancel')}
            >
              {btnCancelTitle}
            </Button>
          ) : null}
          <Button onClick={confirm} testId={dialogBtnTestId('app-dialog', 'confirm')}>
            {btnConfirmTitle}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
