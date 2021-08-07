import { x } from '@xstyled/emotion'
import { FunctionalComponent } from 'preact'
import { useState } from 'preact/hooks'

export interface NavItemProps {
  title?: string
  onClick?: (e: MouseEvent) => void
}

const NavItem: FunctionalComponent<NavItemProps> = ({
  title,
  children,
  onClick,
}) => {
  const [isTitleShow, setTitleShow] = useState(false)

  return (
    <x.button
      display="flex"
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
      gap={2}
      padding={3}
      bg={{ _: 'blue-200', hover: 'blue-300' }}
      borderRadius="full"
      ring={{ focus: 2 }}
      onMouseEnter={() => setTitleShow(true)}
      onMouseLeave={() => setTitleShow(false)}
      onClick={onClick}
    >
      {isTitleShow && title}
      {children}
    </x.button>
  )
}

export default NavItem
