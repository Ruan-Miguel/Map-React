import { Pointer as PointerInteraction } from 'ol/interaction'

import { getFeatureInfo } from './map'

const handleDownEvent = () => function (evt) {
  getFeatureInfo(evt.map.getView(), evt.coordinate)
}

export function getInteraction () {
  const test = new PointerInteraction({
    handleDownEvent: handleDownEvent()
  })

  return test
}

export default getInteraction
