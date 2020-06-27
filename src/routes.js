import React from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'

import Header from './components/Header'
import SimpleMap from './components/Maps/SimpleMap'
import GeolocationMap from './components/Maps/GeolocationMap'
import InteractiveMap from './components/Maps/InteractiveMap'
import TestMap from './components/Maps/TestMap'

export default function Routes () {
  return (
    <BrowserRouter>
      <Route path='/' component={Header} />
      <Switch>
        <Route path='/SimpleMap' component={SimpleMap} />
        <Route path='/GeolocationMap' component={GeolocationMap}/>
        <Route path='/InteractiveMap' component={InteractiveMap}/>
        <Route path='/TestMap' component={TestMap}/>
        <Route exact path='*'>
          <Redirect to={{ pathname: '/SimpleMap' }} />
        </Route>
      </Switch>
    </BrowserRouter>
  )
}
