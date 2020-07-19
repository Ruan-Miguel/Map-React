import React, {useEffect, useState} from 'react'
import FullFill from '../../FullFill'
import getMap from '../WMS/map'
import getInteraction from '../WMS/interaction'
import 'ol/ol.css'
import ImageLayer from 'ol/layer/Image';
import ImageWMS from 'ol/source/ImageWMS';

// Não estou usando ; pq o repositório é de Ruan
const map = getMap()
map.addInteraction(getInteraction())

const wmsSource = new ImageWMS({
    url: 'http://wms.snirh.gov.br/arcgis/services/SNIRH/2016/MapServer/WMSServer',
    params: { LAYERS: '139' },
    serverType: 'mapserver'
})

const wmsSource2 = new ImageWMS({
    url: 'http://wms.snirh.gov.br/arcgis/services/SNIRH/2016/MapServer/WMSServer',
    params: { LAYERS: '43' },
    serverType: 'mapserver'
})

function getLayer (sourceElement) {
    return new ImageLayer({
        source: sourceElement
    })
}


export default function ChangeLayerMap() {
    const [bacias, setBacias] = useState(false)
    const [rochas, setRochas] = useState(false)

    const baciaLayer = getLayer(wmsSource)
    const rochaLayer = getLayer(wmsSource2)

    useEffect(() => {
        map.setTarget('map')

        return function clean () {
            map.setTarget('')
        }
        }, []
    )

    return(
        <React.Fragment>
            <ul>
                <li>Bacias<input type='checkbox' onClick={async (e) => {
                    setBacias(e.target.checked)
                    if(!bacias){
                        console.log(map.addLayer(baciaLayer))

                    } else {
                        // Todo corrigir remoção de layer
                        map.getLayers().remove(baciaLayer)
                    }
                }
                }/></li>
                <li>Teste<input type='checkbox' onClick={e => {
                    setRochas(e.target.checked)
                    if(!rochas){
                        map.addLayer(rochaLayer)
                    } else {
                        // Todo corrigir remoção de layer
                        map.removeLayer(rochaLayer)
                    }
                }
                }/></li>
            </ul>
        <FullFill id='map'>
        </FullFill>
        </React.Fragment>
    )
}
