import Map from 'ol/Map'
import View from 'ol/View'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { OSM } from 'ol/source'
import { defaults as defaultControls, ScaleLine } from 'ol/control'
import { Stroke, Style } from 'ol/style'
import VectorSource from 'ol/source/Vector'
import { WFS, GeoJSON } from 'ol/format'

import axios from 'axios'

export default function getMap () {
  return new Map({
    controls: defaultControls().extend([
      new ScaleLine()
    ]),
    layers: [
      new TileLayer({
        source: new OSM()
      })
    ],
    view: new View({
      projection: 'EPSG:4326',
      center: [0, 0],
      zoom: 0
    })
  })
}

export async function getBaciasLayer () {
  const featureRequest = new WFS().writeGetFeature({
    srsName: 'EPSG:4326',
    outputFormat: 'application/json',
    featureTypes: ['CMR-PUBLICO:lim_bacias_dnaee_nivel1_a']
  })

  return axios.post('http://cmr.funai.gov.br:80/geoserver/wfs', new XMLSerializer().serializeToString(featureRequest), {
    headers: {
      'Content-Type': 'text/xml'
    }
  })
    .then(function ({ data }) {
      const features = new GeoJSON().readFeatures(data)

      const vectorSource = new VectorSource({
        features: features
      })

      console.log(features)

      const vector = new VectorLayer({
        source: vectorSource,
        style: new Style({
          stroke: new Stroke({
            color: 'blue',
            width: 2
          })
        })
      })

      return vector
    })
}
