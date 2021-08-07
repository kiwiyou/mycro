import { x } from '@xstyled/emotion'
import { FunctionalComponent } from 'preact'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Step } from '../model/step'
import StepView from './StepView'

export interface StepProps {
  steps: [number, Step][]
  runningIndex: number | null
  isDraggable?: boolean
  onDelete?: (index: number) => void
  onDrag: (drag: number, hover: number) => void
}

const StepList: FunctionalComponent<StepProps> = (props) => {
  const {
    steps,
    isDraggable,
    onDelete: deleteStep,
    onDrag,
    runningIndex,
  } = props
  const stepViews = steps.map(([ts, step], i) => (
    <StepView
      key={ts}
      draggable={isDraggable ?? true}
      deleteView={deleteStep}
      index={i}
      step={step}
      moveView={onDrag}
      running={i === runningIndex}
      hasArrow={i + 1 < steps.length}
    />
  ))

  return (
    <x.ol
      display="flex"
      flexDirection="column"
      alignItems="start"
      padding={5}
      fontSize="md"
    >
      <DndProvider backend={HTML5Backend}>{stepViews}</DndProvider>
    </x.ol>
  )
}

export default StepList
