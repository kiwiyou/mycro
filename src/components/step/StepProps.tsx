import { Step } from '../../model/step'
import { DragProps } from './Drag'

export default interface StepProps<T extends Step> extends DragProps {
  step: T
  onChange: (index: number, newStep: Step) => void
}
