import { x } from '@xstyled/emotion'
import { FunctionalComponent } from 'preact'
import { useState } from 'react'
import NavItem from './NavItem'
import {
  MdAdd,
  MdKeyboard,
  MdLocationSearching,
  MdMouse,
  MdTimer,
} from 'react-icons/md'
import { Step } from '../../model/step'
import { Key, MouseButton } from '../../model/input'

export interface NavProps {
  onStepAdd: (step: Step) => void
}

const Nav: FunctionalComponent<NavProps> = ({ onStepAdd }) => {
  const [open, setOpen] = useState(false)
  const onMenuClick = () => setOpen((open) => !open)

  const items = [
    {
      title: '커서 움직이기',
      content: <MdLocationSearching size="1.5em" />,
      onClick: () => onStepAdd({ type: 'mouseMove', x: 0, y: 0 }),
    },
    {
      title: '마우스 누르기',
      content: <MdMouse size="1.5em" />,
      onClick: () =>
        onStepAdd({ type: 'mouseClick', button: MouseButton.Left }),
    },
    {
      title: '키보드 누르기',
      content: <MdKeyboard size="1.5em" />,
      onClick: () => onStepAdd({ type: 'keyClick', key: Key.X }),
    },
    {
      title: '기다리기',
      content: <MdTimer size="1.5em" />,
      onClick: () => onStepAdd({ type: 'wait', time: 1 }),
    },
  ]

  const nav = (
    <x.nav
      display="flex"
      flexDirection="column"
      alignItems="flex-end"
      gap={1}
      position="fixed"
      right={32}
      bottom={85}
    >
      {items.map(({ content, title, onClick }) => (
        <NavItem title={title} onClick={onClick}>
          {content}
        </NavItem>
      ))}
    </x.nav>
  )

  return (
    <>
      {open && nav}
      <x.button
        position="fixed"
        right={32}
        bottom={32}
        padding={3}
        bg={{ _: 'blue-500', hover: 'blue-700' }}
        color="white"
        borderRadius="full"
        ring={{ focus: true }}
        onClick={onMenuClick}
      >
        <MdAdd size="1.5em" />
      </x.button>
    </>
  )
}

export default Nav
