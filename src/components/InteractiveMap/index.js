import React, { useEffect } from 'react'

import FullFill from '../FullFill'

import 'ol/ol.css'
import Feature from 'ol/Feature'
import Map from 'ol/Map'
import View from 'ol/View'
import { LineString, Polygon } from 'ol/geom'
import { defaults as defaultInteractions, Pointer as PointerInteraction } from 'ol/interaction'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { OSM, Vector as VectorSource } from 'ol/source'
import { Fill, Stroke, Style } from 'ol/style'

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
    console.log('acessou forma')
    this.feature_ = feature
  } else {
    console.log('nao acessou forma')
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

const lineFeature = new Feature(new LineString([[-1e7, 1e6], [-1e6, 3e6]]))

const polygonFeature = new Feature(
  new Polygon([[[-3e6, -1e6], [-3e6, 1e6],
    [-1e6, 1e6], [-1e6, -1e6], [-3e6, -1e6]]]))

function InteractiveMap () {
  useEffect(() => {
    // eslint-disable-next-line no-new
    new Map({
      interactions: defaultInteractions().extend([new Interaction()]),
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        new VectorLayer({
          source: new VectorSource({
            features: [lineFeature, polygonFeature]
          }),
          style: new Style({
            stroke: new Stroke({
              width: 3,
              color: [255, 0, 0, 1]
            }),
            fill: new Fill({
              color: [0, 0, 255, 0.6]
            })
          })
        })
      ],
      target: 'map',
      view: new View({
        center: [0, 0],
        zoom: 2
      })
    })
  })

  return (
    <FullFill id='map'/>
  )
}

export default InteractiveMap
