import { x } from '@xstyled/emotion'
import { FunctionalComponent } from 'preact'
import { useState } from 'preact/hooks'
import { LANGUAGE } from '../../constants'
import { MouseButtonStep } from '../../model/step'
import SelectEdit from './edit/SelectEdit'
import Node from './Node'
import StepProps from './StepProps'

const ButtonTexts = Array.from({
  length: Object.keys(LANGUAGE.mouseButton).length,
  ...LANGUAGE.mouseButton,
})
const ButtonTypes = Array<keyof typeof LANGUAGE>(
  'mousePress',
  'mouseRelease',
  'mouseClick'
)
const ActionTexts = ButtonTypes.map((t) => LANGUAGE[t])

const MouseButtonStep: FunctionalComponent<StepProps<MouseButtonStep>> = (
  props
) => {
  const { index, step, onChange } = props

  const [isEditing, setEditing] = useState(false)

  const onButtonChange = (newButton: number) => {
    onChange(index, {
      ...step,
      button: newButton,
    })
  }

  const onActionChange = (newAction: number) => {
    onChange(index, {
      ...step,
      type: ButtonTypes[newAction] as any,
    })
  }

  return (
    <Node
      color="orange"
      isEditing={isEditing}
      onEditChange={setEditing}
      {...props}
    >
      <x.b>
        <SelectEdit
          isEditing={isEditing}
          onChange={onButtonChange}
          value={step.button}
          options={ButtonTexts}
        />
      </x.b>
      &nbsp;
      <SelectEdit
        isEditing={isEditing}
        onChange={onActionChange}
        value={ButtonTypes.indexOf(step.type)}
        options={ActionTexts}
      />
    </Node>
  )
}

export default MouseButtonStep
