import React from 'react'
import { Routes, Route } from 'react-router-dom'

const PageContent = props => {
  const { routers, pages } = props
  return (
    <Routes>
      {
        routers.map(r => {
          const Element = pages[r.element] || (() => <></>)
          return <Route
            path={r.path}
            key={r.name}
            element={<Element router={r} />}
          />
        })
      }
    </Routes>
  )
}

export default PageContent
