import Map from 'ol/Map'
import View from 'ol/View'
import { Tile as TileLayer } from 'ol/layer'
import { OSM } from 'ol/source'
import { defaults as defaultControls, ScaleLine } from 'ol/control'
import ImageLayer from 'ol/layer/Image'
import ImageWMS from 'ol/source/ImageWMS'

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

const wmsSource = new ImageWMS({
  url: 'http://wms.snirh.gov.br/arcgis/services/SNIRH/2016/MapServer/WMSServer',
  params: { LAYERS: '139' },
  serverType: 'mapserver'
})

export function getBaciaLayer () {
  return new ImageLayer({
    source: wmsSource
  })
}

export function getFeatureInfo (view, coordinate) {
  const viewResolution = view.getResolution()

  const url = wmsSource.getFeatureInfoUrl(
    coordinate, viewResolution, 'EPSG:4326',
    { INFO_FORMAT: 'text/xml' }
  )

  axios.get(url).then(res => {
    const xml = new DOMParser().parseFromString(res.data, 'text/xml')
    const tag = xml.getElementsByTagName('FIELDS')[0]

    if (tag) {
      const attributes = {
        objectId: tag.getAttribute('OBJECTID'),
        codigo: tag.getAttribute('Código'),
        nome: tag.getAttribute('Nome')
      }

      console.log(attributes)
    }
  })
}
