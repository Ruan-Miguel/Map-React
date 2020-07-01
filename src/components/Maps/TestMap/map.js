import Map from 'ol/Map'
import View from 'ol/View'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { OSM, Vector as VectorSource } from 'ol/source'
import { defaults as defaultControls, ScaleLine } from 'ol/control'
import { Fill, Stroke, Style } from 'ol/style'

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
      projection: 'EPSG:4326'
    })
  })
}

export function getVectorLayer (feature, lineColor, interiorColor) {
  return new VectorLayer({
    source: new VectorSource({
      features: [feature]
    }),
    style: new Style({
      stroke: new Stroke({
        width: 2,
        color: lineColor
      }),
      fill: new Fill({
        color: interiorColor
      })
    })
  })
}
