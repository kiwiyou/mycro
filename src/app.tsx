import { useCallback, useEffect, useRef, useState } from 'preact/hooks'
import { Step } from './model/step'
import {
  defaultTheme,
  Preflight,
  rpxTransformers,
  ThemeProvider,
  x,
} from '@xstyled/emotion'
import { event, globalShortcut, tauri } from '@tauri-apps/api'
import StepList from './components/StepList'
import Nav from './components/nav/Nav'
import { DndProvider } from 'react-dnd'
import { TouchBackend } from 'react-dnd-touch-backend'
import { HTML5Backend } from 'react-dnd-html5-backend'

const theme = {
  ...defaultTheme,
  transformers: {
    ...rpxTransformers,
  },
}

export function App() {
  const [timestamp, setTimestamp] = useState<number>(1)

  const [steps, setSteps] = useState<[number, Step][]>([])

  const addStep = useCallback(
    (step: Step) => {
      setSteps((steps) => [...steps, [timestamp, step]])
      setTimestamp((timestamp) => timestamp + 1)
    },
    [timestamp]
  )

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

  const deleteStep = (index: number) => {
    setSteps((steps) => [...steps.slice(0, index), ...steps.slice(index + 1)])
  }

  const changeStep = (index: number, step: Step) => {
    setSteps((steps) => [
      ...steps.slice(0, index),
      [steps[index][0], step],
      ...steps.slice(index + 1),
    ])
  }

  const [runningStep, setRunningStep] = useState<number | null>(null)

  const [hotkey, setHotkey] = useState('Alt+R')

  const [started, setStarted] = useState(false)

  const toggleMacro = useCallback(() => {
    if (!started) {
      const stepSerialize = steps.map(([ts, step]) => step)
      tauri.invoke('run_macro', { steps: stepSerialize, repeat: false })
    } else {
      tauri.invoke('stop_macro').then(() => {
        setRunningStep(null)
        setStarted(false)
      })
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

  return (
    <DndProvider backend={HTML5Backend}>
      <DndProvider backend={TouchBackend}>
        <ThemeProvider theme={theme}>
          <Preflight />
          <StepList
            steps={steps}
            canDrag={!started}
            runningIndex={runningStep}
            onDelete={deleteStep}
            onMove={moveStep}
            onChange={changeStep}
          />
          <Nav onStepAdd={addStep} />
        </ThemeProvider>
      </DndProvider>
    </DndProvider>
  )
}
