import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Header from './components/Header'
import SimpleMap from './components/SimpleMap'

export default function Routes () {
  return (
    <BrowserRouter>
      <Route path='/' component={Header}/>
      <Switch>
        <Route path='/simpleMap' component={SimpleMap}/>
      </Switch>
    </BrowserRouter>
  )
}
