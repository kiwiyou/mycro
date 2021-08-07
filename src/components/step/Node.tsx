import { x } from '@xstyled/emotion'
import { FunctionalComponent, RefObject } from 'preact'
import { useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { useClickOutside } from '../../lib/hooks/useClickOutside'
import Arrow from '../Arrow'
import { DragProps, dragSpec, dropSpec } from './Drag'

export interface NodeProps extends DragProps {
  color: string
  isEditing: boolean
  onEditChange: (newEdit: boolean) => void
}

const Node: FunctionalComponent<NodeProps> = (props) => {
  const {
    color,
    index,
    canDrag,
    isRunning,
    isEditing,
    hasArrow,
    onMove,
    onDelete,
    onEditChange,
    children,
  } = props
  const [ref] = useClickOutside(() => onEditChange(false))
  const [{ handlerId }, drop] = useDrop(dropSpec(ref, index))
  const [{ isDragging }, drag] = useDrag(dragSpec({ index, onMove }, canDrag))

  drag(drop(ref))

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault()
      onDelete(index)
    }
  }

  const onDoubleClick = () => {
    onEditChange(true)
  }

  return (
    <>
      <x.li
        borderRadius="full"
        padding={5}
        bg={isRunning ? `${color}-700` : `${color}-500`}
        color="white"
        cursor="pointer"
        userSelect="none"
        tabIndex={index + 1}
        ref={ref}
        data-handler-id={handlerId}
        ring={{ focus: 4 }}
        ringColor={{ focus: `${color}-300` }}
        opacity={isDragging ? 0 : 1}
        onKeyDown={isRunning || isEditing ? undefined : onKeyDown}
        onDblClick={onDoubleClick}
        transform
        scale={isRunning && 1.25}
        transition
        transitionDuration={200}
      >
        {children}
      </x.li>
      {hasArrow ? (
        <Arrow height="4em" stroke={`${color}-500`} fill="white" />
      ) : null}
    </>
  )
}

export default Node
