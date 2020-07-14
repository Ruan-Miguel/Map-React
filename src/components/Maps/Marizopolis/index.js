import React, { useState, useEffect } from 'react'

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
    opacity: 0.3,
    transition: 'opacity 1s',
    position: 'absolute',
    right: 0,
    height: '100%',
    width: '30%',
    zIndex: 1,
    '&:hover': {
      opacity: 1,
      transition: 'opacity 1s'
    }
  }
}))

const map = getMap()

const placeId = 301389

function InteractiveMap () {
  const classes = useStyles()

  const [info, setInfo] = useState({})

  const palette = useTheme().palette

  useEffect(() => {
    map.setTarget('map')
    map.addInteraction(getInteraction(setInfo))

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

      map.addLayer(getVectorLayer(placeFeature, palette.secondary.light, palette.primary.main))
    })

    return function clean () {
      map.setTarget('')
    }
  }, [palette])

  return (
    <FullFill className={classes.map} id='map'>
      <Paper
        style={{ display: (Object.keys(info).length === 0) ? 'none' : 'block' }}
        className={classes.paper}
        elevation={3}
        square
      >
        {Object.entries(info).map(pair => (
          <div key={pair[0]}>{pair[0]}: {pair[1]}</div>
        ))}
      </Paper>
    </FullFill>
  )
}

export default InteractiveMap
