import { describe, expect, it, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useDialogStore } from '~/stores/dialogStore'

vi.stubGlobal('useI18n', () => ({
  t: (key: string) => key
}))

describe('stores/dialogStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('starts hidden', () => {
    const store = useDialogStore()
    expect(store.visible).toBe(false)
  })

  it('show() sets all fields and makes dialog visible', () => {
    const store = useDialogStore()
    const onConfirm = vi.fn()
    store.show({
      title: 'Delete?',
      text: 'Are you sure?',
      type: 'confirm',
      btnConfirmTitle: 'Yes',
      btnCancelTitle: 'No',
      hideBtn: true,
      hideBtnConfirm: true,
      hideBtnCancel: true,
      onConfirm
    })
    expect(store.visible).toBe(true)
    expect(store.title).toBe('Delete?')
    expect(store.text).toBe('Are you sure?')
    expect(store.type).toBe('confirm')
    expect(store.btnConfirmTitle).toBe('Yes')
    expect(store.btnCancelTitle).toBe('No')
    expect(store.hideBtn).toBe(true)
    expect(store.hideBtnConfirm).toBe(true)
    expect(store.hideBtnCancel).toBe(true)
  })

  it('show() uses defaults when params are not provided', () => {
    const store = useDialogStore()
    store.show({})
    expect(store.visible).toBe(true)
    expect(store.title).toBe('')
    expect(store.text).toBe('')
    expect(store.type).toBe('info')
    expect(store.btnConfirmTitle).toBe('OK')
    expect(store.hideBtn).toBe(false)
    expect(store.hideBtnConfirm).toBe(false)
    expect(store.hideBtnCancel).toBe(false)
  })

  it('hide() sets visible to false', () => {
    const store = useDialogStore()
    store.show({ title: 'Test' })
    expect(store.visible).toBe(true)
    store.hide()
    expect(store.visible).toBe(false)
  })

  it('confirm() calls onConfirm handler and hides', () => {
    const store = useDialogStore()
    const onConfirm = vi.fn()
    store.show({ onConfirm })
    store.confirm()
    expect(onConfirm).toHaveBeenCalledOnce()
    expect(store.visible).toBe(false)
  })

  it('confirm() works without onConfirm handler', () => {
    const store = useDialogStore()
    store.show({})
    expect(() => store.confirm()).not.toThrow()
    expect(store.visible).toBe(false)
  })
})
