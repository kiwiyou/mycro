import { useCallback, useEffect, useRef, useState } from 'preact/hooks'
import { Clock, MousePointer, Plus, Type } from 'preact-feather'
import { MouseButton, Key } from './model/input'
import { Step, Mouse, Keyboard, Wait } from './model/step'
import {
  defaultTheme,
  Preflight,
  rpxTransformers,
  ThemeProvider,
  x,
} from '@xstyled/emotion'
import { event, globalShortcut, tauri } from '@tauri-apps/api'
import StepList from './components/StepList'

const theme = {
  ...defaultTheme,
  transformers: {
    ...rpxTransformers,
  },
}

export function App() {
  const [steps, setSteps] = useState<[number, Step][]>([
    [1, Mouse.move(100, 200)],
    [3, Mouse.press(MouseButton.Left)],
    [5, Mouse.release(MouseButton.Right)],
    [2, Mouse.click(MouseButton.Right)],
    [4, Keyboard.press(Key.A)],
    [6, Keyboard.release(Key.Shift)],
    [7, Keyboard.click(Key.F10)],
    [8, Wait.sec(2)],
  ])

  const moveStep = useCallback(
    (drag: number, hover: number) => {
      setSteps((steps) => {
        const old = steps[drag]
        const removeDrag = [...steps.slice(0, drag), ...steps.slice(drag + 1)]
        const addOld = [
          ...removeDrag.slice(0, hover),
          old,
          ...removeDrag.slice(hover),
        ]
        return addOld
      })
    },
    [steps]
  )

  const [runningStep, setRunningStep] = useState<number | null>(null)
  const deleteStep = (index: number) => {
    const removed = [...steps.slice(0, index), ...steps.slice(index + 1)]
    setSteps(removed)
  }

  const [hotkey, setHotkey] = useState('Alt+R')

  const [started, setStarted] = useState(false)

  const toggleMacro = useCallback(() => {
    if (!started) {
      const stepSerialize = steps.map(([ts, step]) => step)
      console.log(stepSerialize)
      tauri.invoke('run_macro', { steps: stepSerialize, repeat: false })
    } else {
      tauri.invoke('stop_macro').then(() => setStarted(false))
    }
  }, [started, steps])

  const toggleMacroRef = useRef<typeof toggleMacro | null>(null)

  useEffect(() => {
    toggleMacroRef.current = toggleMacro
  }, [toggleMacro])

  useEffect(() => {
    globalShortcut
      .register(hotkey, () => {
        toggleMacroRef.current?.()
      })
      .catch(() => {})

    return () => globalShortcut.unregisterAll()
  }, [hotkey])

  useEffect(() => {
    event.listen('started', () => {
      setStarted(true)
    })
    event.listen('running', (e: { payload: number }) => {
      setRunningStep(e.payload)
    })
    event.listen('finished', () => {
      setRunningStep(null)
      setStarted(false)
    })
  }, [])

  const [navOpen, setNavOpen] = useState(false)
  const onMenuClick = () => setNavOpen((prev) => !prev)

  const nav = navOpen && (
    <x.nav
      display="flex"
      flexDirection="column"
      gap={1}
      position="fixed"
      right={32}
      bottom={64}
      transform
      translateX="50%"
    >
      <x.button
        padding={3}
        bg="blue-200"
        borderRadius="full"
        ring={{ focus: 2 }}
      >
        <Clock />
      </x.button>
      <x.button
        padding={3}
        bg="blue-200"
        borderRadius="full"
        ring={{ focus: 2 }}
      >
        <Type />
      </x.button>
      <x.button
        padding={3}
        bg="blue-200"
        borderRadius="full"
        ring={{ focus: 2 }}
      >
        <MousePointer />
      </x.button>
    </x.nav>
  )

  return (
    <ThemeProvider theme={theme}>
      <Preflight />
      <StepList
        steps={steps}
        runningIndex={runningStep}
        onDrag={moveStep}
        isDraggable={!started}
        onDelete={deleteStep}
      />
      {nav}
      <x.button
        position="fixed"
        right={32}
        bottom={32}
        transform
        translateX="50%"
        translateY="50%"
        padding={3}
        bg="blue-500"
        color="white"
        borderRadius="full"
        ring={{ focus: true }}
        onClick={onMenuClick}
      >
        <Plus />
      </x.button>
    </ThemeProvider>
  )
}
