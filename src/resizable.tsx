import './resizable.css'
import { type ReactNode } from 'react'
import { ResizableBox } from 'react-resizable'

interface ResizableProps {
  direction: 'horizontal' | 'vertical'
  children: ReactNode
}

const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
  return (
    <ResizableBox
      height={300}
      width={Infinity}
      resizeHandles={['s']}
      maxConstraints={[Infinity, window.innerHeight * 0.9]}
      minConstraints={[Infinity, 24]}
    >
      {children}
    </ResizableBox>
  )
}

export default Resizable
