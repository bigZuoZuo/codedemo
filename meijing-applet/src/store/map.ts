
import { observable, action, computed } from "mobx";
import { marker } from '@tarojs/components/types/Map'
import { PollutionSource } from '../model'
import { getPollutionSources, Region } from '../service/dispatch'
import { getLocation } from "../service/userDivision";
import { rootSourceBaseUrl } from "@common/utils/requests";
import get from "lodash/get";

const MARKER_TYPE_SUFFIX_MAP = {
  'Site': 1,
  'Inspect': 2,
  'PollutionSource': 3,
  'Staff': 4,
}

const enumPollutionTypes = {
  '1': {
    "id": 1,
    "name": "道路扬尘源",
    "imgKey": 'daoluyangcheng'
  },
  '2': {
    "id": 2,
    "name": "工地扬尘源",
    "imgKey": 'gongdiyangchen'
  },
  '3': {
    "id": 3,
    "name": "餐饮油烟",
    "imgKey": 'canyinyouyan'
  },
  '4': {
    "id": 4,
    "name": "工业源",
    "imgKey": 'gongyeyuan'
  },
  '5': {
    "id": 5,
    "name": "散乱污企业",
    "imgKey": 'sanluanwuqiye'
  },
  '6': {
    "id": 6,
    "name": "道路移动源",
    "imgKey": 'daoluyidong'
  },
  '7': {
    "id": 7,
    "name": "非道路移动源",
    "imgKey": 'feidaoluyidong'
  },
  '9': {
    "id": 9,
    "name": "小区散乱污",
    "imgKey": 'xiaoqusanluanwu'
  },
  '10': {
    "id": 10,
    "name": "散煤燃烧",
    "imgKey": 'sanmeiranshao'
  },
  '11': {
    "id": 11,
    "name": "积水排水",
    "imgKey": 'jishuipaishui'
  },
  '12': {
    "id": 12,
    "name": "固定源",
    "imgKey": 'gudingyuan'
  },
  '13': {
    "id": 13,
    "name": "消纳场",
    "imgKey": 'xiaonachang'
  }
}

type MarkerType = 'Site' | 'PollutionSource' | 'Inspect' | 'Staff'

export class MapStore {
  @observable pollutionSources: PollutionSource[] = []
  @observable selectedMarker: {
    markerId?: number;
    id?: number;
    type?: MarkerType,
    data?: any,
  } = {}
  @observable platform: string = 'ios'

  @action async loadPollutionSources() {
    getLocation()
      .then(location => getPollutionSources(location))
      .then(pollutionSources => this.pollutionSources = pollutionSources)
  }

  @computed get pollutionSourceMarkers(): marker[] {
    return this.pollutionSources.map(source => {
      const markerId = source.id * 10 + MARKER_TYPE_SUFFIX_MAP.PollutionSource
      const selected = markerId === this.selectedMarker.markerId
      let endfix = 'default'
      let width = 16
      let height = 18
      let anchor = { x: .5, y: 1 }
      if (selected) {
        width = 56
        height = 46
        endfix = 'select'
        anchor = { x: .5, y: .8 }
      }
      else if (source.distance <= 200) {
        width = 34
        height = 28
        endfix = 'near'
        anchor = { x: .5, y: .8 }
      }
      return {
        "id": markerId,
        "latitude": source.latitude,
        "longitude": source.longitude,
        width,
        height,
        anchor,
        "iconPath": this.parsePollutantSourceIconByType(source.pollutionSourceTypeId, endfix),
      }
    })
  }

  @action async selectMarker(markerId: number | undefined) {
    if (markerId === undefined) {
      this.selectedMarker = {}
      return
    }
    for (const key in MARKER_TYPE_SUFFIX_MAP) {
      if (MARKER_TYPE_SUFFIX_MAP.hasOwnProperty(key)) {
        const suffix = MARKER_TYPE_SUFFIX_MAP[key];
        if ((markerId - suffix) % 10 === 0) {
          const selectedId = (markerId - suffix) / 10
          this.selectedMarker = {
            markerId: markerId,
            id: selectedId,
            // @ts-ignore
            type: key,
            data: this.pollutionSources.find(item => item.id === selectedId)
          }
          break
        }
      }
    }
  }

  @action resetSelectedMarker() {
    this.selectedMarker = {}
  }

  @action setCurrentPlatform(platform: string) {
    this.platform = platform
  }

  parsePollutantSourceIconByType = (typeId: number, endfix: string) => {
    return `${rootSourceBaseUrl}/assets/map/pollution_source/${get(enumPollutionTypes, '[typeId].imgKey', 'gudingyuan')}_${endfix}.png`
  }
}

export default new MapStore()