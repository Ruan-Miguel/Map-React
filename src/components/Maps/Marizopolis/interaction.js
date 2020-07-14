import { Pointer as PointerInteraction } from 'ol/interaction'

const handleDownEvent = (handleFunction) => function (evt) {
  const feature = evt.map.forEachFeatureAtPixel(evt.pixel, (feature) => feature)

  if (feature) {
    this.feature_ = feature
    if (this.feature_.get('info')) {
      handleFunction(this.feature_.get('info'))
      console.log(this.feature_.get('info'))
    }
  } else {
    this.feature_ = null
    handleFunction({})
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

export function getInteraction (handleFunction) {
  const test = new PointerInteraction({
    handleDownEvent: handleDownEvent(handleFunction),
    handleMoveEvent: handleMoveEvent,
    feature_: null
  })

  return test
}

export default getInteraction
