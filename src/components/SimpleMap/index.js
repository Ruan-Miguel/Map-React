import React, { useEffect } from 'react'

import styled from 'styled-components'

import 'ol/ol.css'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'

const MyMap = styled.div`
  height: 100vh;
  width: 100vw;
`

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
    <MyMap id='map'></MyMap>
  )
}

export default SimpleMap
