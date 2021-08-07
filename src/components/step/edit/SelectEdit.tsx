import { x } from '@xstyled/emotion'
import { FunctionComponent } from 'preact'
import EditProps from './EditProps'

export interface SelectEditProps extends EditProps<number> {
  options: any[]
}

const SelectEdit: FunctionComponent<SelectEditProps> = ({
  isEditing,
  value,
  options,
  onChange,
}) => {
  const optionView = options.map((option, i) => (
    <x.option selected={i === value}>{option}</x.option>
  ))
  const onSelectChange = (e: Event) => {
    if (e.target instanceof HTMLSelectElement) {
      console.log(e.target.selectedIndex)
      onChange(e.target.selectedIndex)
    }
  }

  if (isEditing) {
    return <x.select onChange={onSelectChange}>{optionView}</x.select>
  } else {
    return <>{options[value]}</>
  }
}

export default SelectEdit
