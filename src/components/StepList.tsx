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
    <x.div
      display="grid"
      gridTemplateColumns="auto 1fr"
      columnGap={runningIndex != null && 3}
      alignItems="center"
      padding={5}
      fontSize="md"
    >
      {runningIndex != null && (
        <x.svg
          gridArea={`${runningIndex * 2 + 1} / 1 / auto / 1`}
          width="2rem"
          height="2rem"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          transform="rotate(-90deg)"
        >
          <x.path
            d="M9.10557 18.4472C9.27496 18.786 9.62123 19 10 19C10.3788 19 10.725 18.786 10.8944 18.4472L18.8944 2.44721C19.0494 2.13723 19.0329 1.76909 18.8507 1.47427C18.6684 1.17945 18.3466 1 18 1L2 0.999999C1.65342 0.999999 1.33156 1.17945 1.14935 1.47427C0.967142 1.76908 0.950579 2.13722 1.10557 2.44721L9.10557 18.4472Z"
            fill="green-500"
            stroke="green-300"
            stroke-width="2"
            stroke-linejoin="round"
          />
        </x.svg>
      )}
      {stepViews}
    </x.div>
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
