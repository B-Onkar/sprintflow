import React from 'react'

const Layout = ({children}) => {
  return (
    <div className='flex items-center justify-center h-screen'>{children}</div>
  )
}

export default Layout