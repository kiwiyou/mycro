import { x } from '@xstyled/emotion'
import { FunctionComponent } from 'preact'
import EditProps from './EditProps'

export interface NumberEditProps extends EditProps<number> {
  isInteger?: boolean
}

const NumberEdit: FunctionComponent<NumberEditProps> = ({
  value,
  isEditing,
  isInteger,
  onChange,
}) => {
  const onInputChange = (e: Event) => {
    if (e.target instanceof HTMLInputElement) {
      onChange(e.target.valueAsNumber)
    }
  }

  if (isEditing) {
    return (
      <x.input
        type={isInteger ?? true ? 'number' : undefined}
        value={value}
        onChange={onInputChange}
      />
    )
  } else {
    return <>{value}</>
  }
}

export default NumberEdit
