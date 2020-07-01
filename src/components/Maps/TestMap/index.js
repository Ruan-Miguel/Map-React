import React, { useEffect } from 'react'

import FullFill from '../../FullFill'

import Paper from '@material-ui/core/Paper'
import { makeStyles, useTheme } from '@material-ui/core/styles'

import getMap, { getVectorLayer } from './map'
import getInteraction from './interaction'

import OpenStreetMap from '../../../services/OpenStreetMap'

import 'ol/ol.css'
import Feature from 'ol/Feature'
import { Polygon } from 'ol/geom'

const useStyles = makeStyles(() => ({
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

const map = getMap()
map.addInteraction(getInteraction())

const placeId = 301389

function InteractiveMap () {
  const classes = useStyles()

  const primaryColor = useTheme().palette.primary.main
  const secondaryColor = useTheme().palette.secondary.light

  useEffect(() => {
    map.setTarget('map')

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

      map.addLayer(getVectorLayer(placeFeature, secondaryColor, primaryColor))
    })
  })

  return (
    <FullFill className={classes.map} id='map'>
      <Paper className={classes.paper} elevation={3} square></Paper>
    </FullFill>
  )
}

export default InteractiveMap
