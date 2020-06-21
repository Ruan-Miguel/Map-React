import React, { useEffect } from 'react'

import FullFill from '../FullFill'

import 'ol/ol.css'
import Feature from 'ol/Feature'
import Geolocation from 'ol/Geolocation'
import Map from 'ol/Map'
import View from 'ol/View'
import Point from 'ol/geom/Point'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { OSM, Vector as VectorSource } from 'ol/source'
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style'

const view = new View({
  center: [0, 0],
  zoom: 2
})

const geolocation = new Geolocation({
  // enableHighAccuracy must be set to true to have the heading value.
  tracking: true,
  trackingOptions: {
    enableHighAccuracy: true
  },
  projection: view.getProjection()
})

// handle geolocation error.
geolocation.on('error', function (error) {
  const info = document.getElementById('info')
  info.innerHTML = error.message
  info.style.display = ''
})

const accuracyFeature = new Feature()
geolocation.on('change:accuracyGeometry', function () {
  accuracyFeature.setGeometry(geolocation.getAccuracyGeometry())
})

const positionFeature = new Feature()
positionFeature.setStyle(new Style({
  image: new CircleStyle({
    radius: 6,
    fill: new Fill({
      color: '#3399CC'
    }),
    stroke: new Stroke({
      color: '#fff',
      width: 2
    })
  })
}))

geolocation.on('change:position', function () {
  const coordinates = geolocation.getPosition()

  view.setCenter(coordinates)
  view.setZoom(18)

  positionFeature.setGeometry(coordinates
    ? new Point(coordinates) : null)
})

function GeolocationMap () {
  useEffect(() => {
    const map = new Map({
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      target: 'map',
      view: view
    })

    // eslint-disable-next-line no-new
    new VectorLayer({
      map: map,
      source: new VectorSource({
        features: [accuracyFeature, positionFeature]
      })
    })
  })

  return (
    <FullFill id='map'/>
  )
}

export default GeolocationMap
