import './code-cell.css'
import { useEffect } from 'react'
import CodeEditor from './code-editor'
import Preview from './preview'
import Resizable from './resizable'
import { Cell } from '../redux'
import { useActions } from '../hooks/use-actions'
import { useTypedSelector } from '../hooks/use-typed-selector'

interface CodeCellProps {
  cell: Cell
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const { updateCell, createBundle } = useActions()
  const bundle = useTypedSelector((state) => state.bundles[cell.id])
  const cumulativeCode = useTypedSelector((state) => {
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
        if (c.id === cell.id) {
          cumulativeCode.push(showFunc)
        } else {
          cumulativeCode.push(showFuncNoop)
        }
        cumulativeCode.push(c.content)
      }
      if (c.id === cell.id) {
        break
      }
    }

    return cumulativeCode
  })

  useEffect(() => {
    if (!bundle) {
      createBundle(cell.id, cumulativeCode.join('\n'))
      return
    }
    const timer = setTimeout(async () => {
      createBundle(cell.id, cumulativeCode.join('\n'))
    }, 750)

    return () => {
      clearTimeout(timer)
    }
  }, [cell.id, cumulativeCode.join('\n'), createBundle])

  return (
    <Resizable direction='vertical'>
      <div
        style={{
          height: 'calc(100% - 10px)',
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <Resizable direction='horizontal'>
          <CodeEditor
            initialValue={cell.content}
            onChange={(value) => updateCell(cell.id, value)}
          />
        </Resizable>
        <div className='progress-wrapper'>
          {!bundle || bundle.loading ? (
            <div className='progress-cover'>
              <progress className='progress is-primary is-small' max='100'>
                Loading
              </progress>
            </div>
          ) : (
            <Preview code={bundle.code} err={bundle.err} />
          )}
        </div>
      </div>
    </Resizable>
  )
}

export default CodeCell
