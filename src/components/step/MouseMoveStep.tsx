import { x } from '@xstyled/emotion'
import { FunctionalComponent } from 'preact'
import { useState } from 'preact/hooks'
import { LANGUAGE } from '../../constants'
import { MouseMoveStep } from '../../model/step'
import NumberEdit from './edit/NumberEdit'
import Node from './Node'
import StepProps from './StepProps'

const MouseMoveStep: FunctionalComponent<StepProps<MouseMoveStep>> = (
  props
) => {
  const { index, step, onChange } = props

  const [isEditing, setEditing] = useState(false)

  const onChangeX = (newX: number) => {
    onChange(index, {
      ...step,
      x: newX,
    })
  }

  const onChangeY = (newY: number) => {
    onChange(index, {
      ...step,
      y: newY,
    })
  }

  return (
    <Node
      color="green"
      isEditing={isEditing}
      onEditChange={setEditing}
      {...props}
    >
      <x.b>
        (
        <NumberEdit value={step.x} isEditing={isEditing} onChange={onChangeX} />
        ,{' '}
        <NumberEdit value={step.y} isEditing={isEditing} onChange={onChangeY} />
        )
      </x.b>
      &nbsp;{LANGUAGE.mouseMove}
    </Node>
  )
}

export default MouseMoveStep
