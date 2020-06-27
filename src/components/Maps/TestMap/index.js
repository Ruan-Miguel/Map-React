import React, { useEffect } from 'react'

import FullFill from '../../FullFill'

import axios from 'axios'

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
    if (feature.get('name')) {
      console.log(feature.get('name'))
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
      interactions: defaultInteractions().extend([new Interaction()]),
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      target: 'map',
      view: new View({
        center: [-38.3473088, -6.8440704],
        projection: 'EPSG:4326',
        zoom: 12
      })
    })

    axios.get(`https://www.openstreetmap.org/api/0.6/relation/${placeId}/full`, {
      headers: {
        Accept: 'application/json'
      }
    }).then(({ data }) => {
      const { elements } = data

      const place = elements.find((element) => element.id === placeId)
      const info = {
        name: place.tags.name,
        population: place.tags.population
      }

      const outerRefs = place.members.filter(member => member.role === 'outer')

      const outers = elements.filter((element) => outerRefs.some(outerRef => outerRef.ref === element.id))

      const matrixOuterNodes = outers.map(outer => outer.nodes)

      const orderedOuterNodes = [matrixOuterNodes[0]]
      matrixOuterNodes[0] = []

      for (let aux = 1; aux < matrixOuterNodes.length; aux++) {
        const lastArray = orderedOuterNodes[orderedOuterNodes.length - 1]

        const nextArrayIndex = matrixOuterNodes.findIndex((arrayOuterNodes) => {
          const haveTheNumber = arrayOuterNodes.includes(lastArray[lastArray.length - 1])

          if (haveTheNumber) {
            return true
          }

          return false
        })

        if (matrixOuterNodes[nextArrayIndex][0] !== lastArray[lastArray.length - 1]) {
          matrixOuterNodes[nextArrayIndex].reverse()
        }

        orderedOuterNodes.push(matrixOuterNodes[nextArrayIndex])
        matrixOuterNodes[nextArrayIndex] = []
      }

      const polygonNodes = []

      orderedOuterNodes.forEach((elementsArray, index) => {
        if (index !== orderedOuterNodes.length - 1) {
          elementsArray.pop()
        }

        polygonNodes.push(...elementsArray)
      })

      const polygonCoords = polygonNodes.map((node) => {
        const nodeInformation = elements.find((element) => element.id === node)

        return [nodeInformation.lon, nodeInformation.lat]
      })

      const testFeature = new Feature({
        geometry: new Polygon([polygonCoords]),
        name: info
      })

      map.addLayer(new VectorLayer({
        source: new VectorSource({
          features: [testFeature]
        }),
        style: new Style({
          stroke: new Stroke({
            width: 3,
            color: primaryColor
          }),
          fill: new Fill({
            color: secondaryColor
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
