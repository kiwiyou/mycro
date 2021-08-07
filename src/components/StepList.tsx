import { x } from '@xstyled/emotion'
import { FunctionalComponent } from 'preact'
import { Step } from '../model/step'
import KeyStep from './step/KeyStep'
import MouseButtonStep from './step/MouseButtonStep'
import MouseMoveStep from './step/MouseMoveStep'
import StepProps from './step/StepProps'
import WaitStep from './step/WaitStep'

export interface StepListProps {
  steps: [number, Step][]
  runningIndex: number | null
  canDrag: boolean
  onDelete: (index: number) => void
  onMove: (drag: number, hover: number) => void
  onChange: (index: number, step: Step) => void
}

const StepList: FunctionalComponent<StepListProps> = (props) => {
  const { steps, runningIndex, canDrag, onDelete, onMove, onChange } = props

  const stepViews = steps.map(([ts, step], i, a) =>
    StepViewFactory(step, {
      key: ts,
      index: i,
      isRunning: i === runningIndex,
      canDrag,
      hasArrow: i + 1 < a.length,
      onDelete,
      onMove,
      onChange,
    })
  )

  return (
    <x.ol
      display="flex"
      flexDirection="column"
      alignItems="start"
      padding={5}
      fontSize="md"
    >
      {stepViews}
    </x.ol>
  )
}

const StepViewFactory = (
  step: Step,
  props: Omit<StepProps<never>, 'step'> & { key: any }
) => {
  switch (step.type) {
    case 'mouseMove':
      return <MouseMoveStep step={step} {...props} />
    case 'mousePress':
    case 'mouseRelease':
    case 'mouseClick':
      return <MouseButtonStep step={step} {...props} />
    case 'keyPress':
    case 'keyRelease':
    case 'keyClick':
      return <KeyStep step={step} {...props} />
    case 'wait':
      return <WaitStep step={step} {...props} />
    default:
      return
  }
}

export default StepList
