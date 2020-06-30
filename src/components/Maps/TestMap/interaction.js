import { Pointer as PointerInteraction } from 'ol/interaction'

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

export function getInteraction () {
  return new PointerInteraction({
    handleDownEvent: handleDownEvent,
    handleMoveEvent: handleMoveEvent
  })
}

export default getInteraction
