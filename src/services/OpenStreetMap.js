import axios from 'axios'

export default class OpenStreetMap {
  static async getPolygon (placeId) {
    return axios.get(`https://www.openstreetmap.org/api/0.6/relation/${placeId}/full`, {
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

      return {
        coords: polygonCoords,
        info: info
      }
    })
  }
}
