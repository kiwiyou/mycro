import { x } from '@xstyled/emotion'
import { FunctionalComponent } from 'preact'
import { useState } from 'preact/hooks'
import { LANGUAGE } from '../../constants'
import { Key } from '../../model/input'
import { KeyStep } from '../../model/step'
import KeyEdit from './edit/KeyEdit'
import SelectEdit from './edit/SelectEdit'
import Node from './Node'
import StepProps from './StepProps'

const KeyTypes = Array<keyof typeof LANGUAGE>(
  'keyPress',
  'keyRelease',
  'keyClick'
)
const ActionTexts = KeyTypes.map((t) => LANGUAGE[t])

const KeyStep: FunctionalComponent<StepProps<KeyStep>> = (props) => {
  const { index, step, onChange } = props

  const [isEditing, setEditing] = useState(false)

  const onKeyChange = (newKey: Key) => {
    onChange(index, {
      ...step,
      key: newKey,
    })
  }

  const onActionChange = (newAction: number) => {
    onChange(index, {
      ...step,
      type: KeyTypes[newAction] as any,
    })
  }

  return (
    <Node
      color="purple"
      isEditing={isEditing}
      onEditChange={setEditing}
      {...props}
    >
      <x.b>
        <KeyEdit
          isEditing={isEditing}
          value={step.key}
          onChange={onKeyChange}
        />
        &nbsp;키
      </x.b>
      &nbsp;
      <SelectEdit
        isEditing={isEditing}
        onChange={onActionChange}
        value={KeyTypes.indexOf(step.type)}
        options={ActionTexts}
      />
    </Node>
  )
}

export default KeyStep
