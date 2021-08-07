import { RefObject } from 'preact'
import { useEffect, useRef, useState } from 'preact/hooks'

export type ClickOutsideHandler = (
  e: PointerEvent | MouseEvent | TouchEvent
) => void

export const useClickOutside = (
  onClickOutside: ClickOutsideHandler
): [RefObject<any>, boolean] => {
  const ref = useRef<HTMLElement>(null)
  const [state, setState] = useState({
    hasClickedOutside: false,
  })

  const handleEvent = (e: PointerEvent | MouseEvent | TouchEvent) => {
    /* istanbul ignore else  */
    if (ref && ref.current && e.target instanceof Node) {
      if (ref.current.contains(e.target)) {
        setState({ hasClickedOutside: false })
      } else {
        setState({ hasClickedOutside: true })
        onClickOutside(e)
      }
    }
  }

  useEffect(() => {
    if (window.PointerEvent) {
      document.addEventListener('pointerdown', handleEvent)
    } else {
      document.addEventListener('mousedown', handleEvent)
      document.addEventListener('touchstart', handleEvent)
    }

    return () => {
      if (window.PointerEvent) {
        document.removeEventListener('pointerdown', handleEvent)
      } else {
        document.removeEventListener('mousedown', handleEvent)
        document.removeEventListener('touchstart', handleEvent)
      }
    }
  }, [])

  return [ref, state.hasClickedOutside]
}
