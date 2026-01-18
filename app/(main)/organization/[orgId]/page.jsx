import React from 'react'

const Organization = ({params}) => {
    const {orgId} = params;
  return (
    <div>Organization {orgId}</div>
  )
}

export default Organization