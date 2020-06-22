import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core'
import indigo from '@material-ui/core/colors/indigo'
import teal from '@material-ui/core/colors/teal'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: teal[600]
    },
    secondary: indigo
  }
})

ReactDOM.render(
  <React.StrictMode>
    <MuiThemeProvider theme={theme}>
      <App />
    </MuiThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
