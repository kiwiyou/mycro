import { x } from '@xstyled/emotion'
import { FunctionComponent } from 'preact'
import { useState } from 'preact/hooks'
import { findKey } from '../../../constants'
import { Key } from '../../../model/input'
import EditProps from './EditProps'

const KeyEdit: FunctionComponent<EditProps<Key>> = ({
  isEditing,
  value,
  onChange,
}) => {
  const [isWaitingKey, setWaitingKey] = useState(false)

  const onMouseDown = (e: MouseEvent) => {
    if (e.button === 0) {
      setWaitingKey(true)
    }
  }

  const onMouseUp = (e: MouseEvent) => {
    if (e.button === 0) {
      setWaitingKey(false)
    }
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (isWaitingKey) {
      const key = findKey(e.key)
      if (key !== null) {
        onChange(key)
      }
    }
  }

  if (isEditing) {
    return (
      <x.button
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onKeyDown={onKeyDown}
      >
        {Key[value]}
      </x.button>
    )
  } else {
    return <>{Key[value]}</>
  }
}

export default KeyEdit
