import { x } from '@xstyled/emotion'
import { FunctionalComponent } from 'preact'
import { useState } from 'preact/hooks'
import { LANGUAGE } from '../../constants'
import { MouseMoveStep, WaitStep } from '../../model/step'
import NumberEdit from './edit/NumberEdit'
import Node from './Node'
import StepProps from './StepProps'

const WaitStep: FunctionalComponent<StepProps<WaitStep>> = (props) => {
  const { index, step, onChange } = props

  const [isEditing, setEditing] = useState(false)

  const onTimeChange = (newTime: number) => {
    onChange(index, {
      ...step,
      time: newTime,
    })
  }

  return (
    <Node
      color="red"
      isEditing={isEditing}
      onEditChange={setEditing}
      {...props}
    >
      <x.b>
        <NumberEdit
          value={step.time}
          isEditing={isEditing}
          onChange={onTimeChange}
          isInteger
        />
        초
      </x.b>
      &nbsp;{LANGUAGE.wait}
    </Node>
  )
}

export default WaitStep
