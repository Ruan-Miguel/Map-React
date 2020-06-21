import React, { useEffect } from 'react'

import FullFill from '../FullFill'

import 'ol/ol.css'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'

function SimpleMap () {
  useEffect(() => {
    // eslint-disable-next-line no-new
    new Map({
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      target: 'map',
      view: new View({
        projection: 'EPSG:4326',
        center: [0, 0],
        zoom: 2
      })
    })
  }, [])

  return (
    <FullFill id='map'/>
  )
}

export default SimpleMap
