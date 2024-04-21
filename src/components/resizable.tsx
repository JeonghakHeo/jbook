import './resizable.css'
import { useEffect, useState, type ReactNode } from 'react'
import { ResizableBox, type ResizableBoxProps } from 'react-resizable'

interface ResizableProps {
  direction: 'horizontal' | 'vertical'
  children: ReactNode
}

const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
  let resizableProps: ResizableBoxProps
  const [innerHeight, setInnerHeight] = useState(Math.floor(window.innerHeight))
  const [innerWidth, setInnerWidth] = useState(Math.floor(window.innerWidth))
  const [width, setWidth] = useState(Math.floor(window.innerWidth * 0.6))

  useEffect(() => {
    let timer: any
    const listener = () => {
      if (timer) {
        clearTimeout(timer)
      }

      timer = setTimeout(() => {
        setInnerHeight(Math.floor(window.innerHeight))
        setInnerWidth(Math.floor(window.innerWidth))
        if (window.innerWidth * 0.6 < width) {
          setWidth(Math.floor(window.innerWidth * 0.6))
        }
      }, 100)
    }

    window.addEventListener('resize', listener)

    return () => {
      window.removeEventListener('resize', listener)
    }
  }, [])

  if (direction === 'horizontal') {
    resizableProps = {
      className: 'resize-horizontal',
      height: Infinity,
      width,
      resizeHandles: ['e'],
      maxConstraints: [Math.floor(innerWidth * 0.6), Infinity],
      minConstraints: [Math.floor(innerWidth * 0.2), Infinity],
      onResizeStop: (event, data) => {
        setWidth(data.size.width)
      },
    }
  } else {
    resizableProps = {
      height: 300,
      width: Infinity,
      resizeHandles: ['s'],
      maxConstraints: [Infinity, Math.floor(innerHeight * 0.9)],
      minConstraints: [Infinity, 24],
    }
  }
  return <ResizableBox {...resizableProps}>{children}</ResizableBox>
}

export default Resizable
