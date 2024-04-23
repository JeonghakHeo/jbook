import { useTypedSelector } from './use-typed-selector'

export const useCumulativeCode = (cellId: string) => {
  return useTypedSelector((state) => {
    const { data, order } = state.cells
    const orderedCells = order.map((id) => data[id])

    const showFunc = `
    import _React from 'react'
    import _ReactDOM from 'react-dom/client'
  
      var show = (value) => {
        const el = document.querySelector('#root')
        const root = _ReactDOM.createRoot(el)
  
        if(typeof value === 'object') {
          if(value.$$typeof && value.props) {
            root.render(value)
          } else {
            root.render(JSON.stringify(value))
          }
        } else {
          root.render(value)
        }
      }
    `
    const showFuncNoop = 'var show = () => {}'

    const cumulativeCode = []
    for (let c of orderedCells) {
      if (c.type === 'code') {
        if (c.id === cellId) {
          cumulativeCode.push(showFunc)
        } else {
          cumulativeCode.push(showFuncNoop)
        }
        cumulativeCode.push(c.content)
      }
      if (c.id === cellId) {
        break
      }
    }

    return cumulativeCode
  }).join('\n')
}
