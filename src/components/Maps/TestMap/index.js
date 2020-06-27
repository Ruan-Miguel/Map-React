import React, { useEffect } from 'react'

import FullFill from '../../FullFill'

import OpenStreetMap from '../../../services/OpenStreetMap'

import 'ol/ol.css'
import Feature from 'ol/Feature'
import Map from 'ol/Map'
import View from 'ol/View'
import { Polygon } from 'ol/geom'
import { defaults as defaultInteractions, Pointer as PointerInteraction } from 'ol/interaction'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { OSM, Vector as VectorSource } from 'ol/source'
import { Fill, Stroke, Style } from 'ol/style'
import { useTheme } from '@material-ui/core/styles'
import { defaults as defaultControls, ScaleLine } from 'ol/control'

const Interaction = (function (PointerInteraction) {
  function Interaction () {
    PointerInteraction.call(this, {
      handleDownEvent: handleDownEvent,
      handleMoveEvent: handleMoveEvent
    })

    this.feature_ = null
  }

  Interaction.prototype = Object.create(PointerInteraction && PointerInteraction.prototype)
  Interaction.prototype.constructor = Interaction

  return Interaction
}(PointerInteraction))

function handleDownEvent (evt) {
  const feature = evt.map.forEachFeatureAtPixel(evt.pixel, (feature) => feature)

  if (feature) {
    if (feature.get('info')) {
      console.log(feature.get('info'))
    }

    this.feature_ = feature
  } else {
    this.feature_ = null
  }
}

function handleMoveEvent (evt) {
  const feature = evt.map.forEachFeatureAtPixel(evt.pixel, (feature) => feature)

  const element = evt.map.getTargetElement()

  if (feature) {
    if (element.style.cursor !== 'pointer') {
      element.style.cursor = 'pointer'
    }
  } else if (element.style.cursor !== 'default') {
    element.style.cursor = 'default'
  }
}

const placeId = 301389

function InteractiveMap () {
  const primaryColor = useTheme().palette.primary.main
  const secondaryColor = useTheme().palette.secondary.light

  useEffect(() => {
    const map = new Map({
      controls: defaultControls().extend([
        new ScaleLine()
      ]),
      interactions: defaultInteractions().extend([new Interaction()]),
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      target: 'map',
      view: new View({
        projection: 'EPSG:4326'
      })
    })

    OpenStreetMap.getPolygon(placeId).then(res => {
      const place = new Polygon([res.coords])

      const mapView = map.getView()
      mapView.fit(place, {
        padding: [50, 50, 50, 50]
      })

      const placeFeature = new Feature({
        geometry: place,
        info: res.info
      })

      map.addLayer(new VectorLayer({
        source: new VectorSource({
          features: [placeFeature]
        }),
        style: new Style({
          stroke: new Stroke({
            width: 2,
            color: secondaryColor
          }),
          fill: new Fill({
            color: primaryColor
          })
        })
      }))
    })
  })

  return (
    <FullFill id='map' />
  )
}

export default InteractiveMap
