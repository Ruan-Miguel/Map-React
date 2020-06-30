import React, { useEffect } from 'react'

import FullFill from '../../FullFill'

import getInteraction from './interaction'

import OpenStreetMap from '../../../services/OpenStreetMap'

import Paper from '@material-ui/core/Paper'
import { makeStyles, useTheme } from '@material-ui/core/styles'

import 'ol/ol.css'
import Feature from 'ol/Feature'
import Map from 'ol/Map'
import View from 'ol/View'
import { Polygon } from 'ol/geom'
import { defaults as defaultInteractions } from 'ol/interaction'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { OSM, Vector as VectorSource } from 'ol/source'
import { Fill, Stroke, Style } from 'ol/style'
import { defaults as defaultControls, ScaleLine } from 'ol/control'

const useStyles = makeStyles((theme) => ({
  map: {
    position: 'relative'
  },
  paper: {
    position: 'absolute',
    right: 0,
    height: '100%',
    width: '30%',
    zIndex: 1
  }
}))

const placeId = 301389

function InteractiveMap () {
  const classes = useStyles()

  const primaryColor = useTheme().palette.primary.main
  const secondaryColor = useTheme().palette.secondary.light

  useEffect(() => {
    const map = new Map({
      controls: defaultControls().extend([
        new ScaleLine()
      ]),
      interactions: defaultInteractions().extend([getInteraction()]),
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
    <FullFill className={classes.map} id='map'>
      <Paper className={classes.paper} elevation={3} square></Paper>
    </FullFill>
  )
}

export default InteractiveMap
