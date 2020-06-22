import React from 'react'
import styled from 'styled-components'

import Router from './routes'

const Div = styled.div`
display: flex;
flex-direction: column;
height: 100vh;
width: 100vw;
`

function App () {
  return (
    <Div>
      <Router/>
    </Div>
  )
}

export default App
