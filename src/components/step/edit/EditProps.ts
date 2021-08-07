export default interface EditProps<T> {
  isEditing: boolean
  value: T
  onChange: (newValue: T) => void
}
