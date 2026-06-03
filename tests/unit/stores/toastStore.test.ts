import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useToastStore } from '~/stores/toastStore'

describe('stores/toastStore', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    setActivePinia(createPinia())
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts with empty toasts', () => {
    const store = useToastStore()
    expect(store.toasts).toEqual([])
  })

  it('show() adds a toast and returns its id', () => {
    const store = useToastStore()
    const id = store.show({ message: 'Hello' })
    expect(typeof id).toBe('string')
    expect(store.toasts).toHaveLength(1)
    expect(store.toasts[0].message).toBe('Hello')
    expect(store.toasts[0].type).toBe('info')
    expect(store.toasts[0].open).toBe(true)
  })

  it('show() applies custom type and title', () => {
    const store = useToastStore()
    store.show({ message: 'Err', type: 'error', title: 'Oops' })
    expect(store.toasts[0].type).toBe('error')
    expect(store.toasts[0].title).toBe('Oops')
  })

  it('auto-removes toast after duration', () => {
    const store = useToastStore()
    store.show({ message: 'temp', duration: 1000 })
    expect(store.toasts).toHaveLength(1)
    vi.advanceTimersByTime(1000)
    expect(store.toasts).toHaveLength(0)
  })

  it('does not auto-remove when duration is 0', () => {
    const store = useToastStore()
    store.show({ message: 'sticky', duration: 0 })
    vi.advanceTimersByTime(60000)
    expect(store.toasts).toHaveLength(1)
  })

  it('hide() removes a specific toast by id', () => {
    const store = useToastStore()
    const id1 = store.show({ message: 'first' })
    store.show({ message: 'second' })
    expect(store.toasts).toHaveLength(2)
    store.hide(id1)
    expect(store.toasts).toHaveLength(1)
    expect(store.toasts[0].message).toBe('second')
  })

  it('hide() clears the auto-dismiss timeout', () => {
    const store = useToastStore()
    const id = store.show({ message: 'test', duration: 5000 })
    store.hide(id)
    expect(store.toasts).toHaveLength(0)
  })

  it('clear() removes all toasts and clears timeouts', () => {
    const store = useToastStore()
    store.show({ message: 'a' })
    store.show({ message: 'b' })
    store.show({ message: 'c' })
    expect(store.toasts).toHaveLength(3)
    store.clear()
    expect(store.toasts).toHaveLength(0)
  })

  it('uses default duration of 5000ms', () => {
    const store = useToastStore()
    store.show({ message: 'default duration' })
    expect(store.toasts).toHaveLength(1)
    vi.advanceTimersByTime(4999)
    expect(store.toasts).toHaveLength(1)
    vi.advanceTimersByTime(1)
    expect(store.toasts).toHaveLength(0)
  })
})
