import React, { useEffect } from 'react'

import FullFill from '../../FullFill'

import getMap, { getBaciaLayer } from './map'
import getInteraction from './interaction'

import 'ol/ol.css'

const map = getMap()
map.addInteraction(getInteraction())

const bacias = getBaciaLayer()
map.addLayer(bacias)

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
