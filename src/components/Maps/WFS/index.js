import React, { useEffect } from 'react'

import FullFill from '../../FullFill'

import getMap, { getBaciasLayer } from './map'

import 'ol/ol.css'

const map = getMap()

getBaciasLayer().then(baciasLayer => {
  map.addLayer(baciasLayer)
})

function InteractiveMap () {
  useEffect(() => {
    map.setTarget('map')

    return function clean () {
      map.setTarget('')
    }
  }, [])

  return (
    <FullFill id='map'>
    </FullFill>
  )
}

export default InteractiveMap
