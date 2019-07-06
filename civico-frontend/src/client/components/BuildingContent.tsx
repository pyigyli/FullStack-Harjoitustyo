import React from 'react'
import Embassy from './buildingContent/Embassy'
import Barracks from './buildingContent/Barracks'
import Stable from './buildingContent/Stable'

interface Props {
  lumber: number
  iron: number
  clay: number
  wheat: number
  buildingName: string
  buildingLevel: number
  pacifist: boolean
  pacifismDisabledUntil: number
  onClose: () => void
  onTogglePacifism: (days: number) => void
  onTrainTroops: (troopType: string, amountToTrain: number) => void
}

class BuildingContent extends React.Component<Props> {

  public render() {
    const {
      lumber,
      iron,
      clay,
      wheat,
      buildingName,
      buildingLevel,
      pacifist,
      pacifismDisabledUntil,
      onClose,
      onTogglePacifism,
      onTrainTroops
    } = this.props

    switch (buildingName) {
      case 'Embassy':
        return (
          <Embassy
            buildingLevel={buildingLevel}
            pacifist={pacifist}
            pacifismDisabledUntil={pacifismDisabledUntil}
            onTogglePacifism={onTogglePacifism}
          />
        )
      case 'Barracks':
        return (
          <Barracks
            lumber={lumber}
            iron={iron}
            clay={clay}
            wheat={wheat}
            buildingLevel={buildingLevel}
            onClose={onClose}
            onTrainTroops={onTrainTroops}
          />
        )
        case 'Stable':
          return (
            <Stable
              lumber={lumber}
              iron={iron}
              clay={clay}
              wheat={wheat}
              buildingLevel={buildingLevel}
              onClose={onClose}
              onTrainTroops={onTrainTroops}
            />
          )
      default:
        return null
    }
  }
}

export default BuildingContent
