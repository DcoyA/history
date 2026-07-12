export const WORLD_MAP_IMAGE_URL =
  'https://tvnzwteynxjhtznxwagh.supabase.co/storage/v1/object/public/cards/ui/world-map-dark.png'

export const WORLD_DATA = [
  {
    id: 'korea',
    name: '🇰🇷 한국사',
    nameEn: '🇰🇷 Korean History',
    progress: 18,
    enabled: true,
    eras: [
      {
        id: 'gojoseon',
        name: '고조선',
        nameEn: 'Gojoseon',
        period: '기원전',
        enabled: false,
        routes: []
      },
      {
        id: 'three_kingdoms',
        name: '삼국시대',
        nameEn: 'Three Kingdoms',
        period: '1C - 7C',
        enabled: true,
        routes: [
          {
            id: 'goguryeo',
            name: '🏰 고구려',
            nameEn: '🏰 Goguryeo',
            enabled: true
          },
          {
            id: 'baekje',
            name: '🏯 백제',
            nameEn: '🏯 Baekje',
            enabled: false
          },
          {
            id: 'silla',
            name: '🟢 신라',
            nameEn: '🟢 Silla',
            enabled: false
          },
          {
            id: 'gaya',
            name: '🌊 가야',
            nameEn: '🌊 Gaya',
            enabled: false
          }
        ]
      },
      {
        id: 'goryeo',
        name: '고려',
        nameEn: 'Goryeo',
        period: '918 - 1392',
        enabled: false,
        routes: []
      },
      {
        id: 'joseon',
        name: '조선',
        nameEn: 'Joseon',
        period: '1392 - 1897',
        enabled: false,
        routes: []
      },
      {
        id: 'modern',
        name: '근현대',
        nameEn: 'Modern Korea',
        period: '1897 - 현재',
        enabled: false,
        routes: []
      }
    ]
  },
  {
    id: 'china',
    name: '🇨🇳 중국사',
    nameEn: '🇨🇳 Chinese History',
    progress: 0,
    enabled: false,
    comingSoon: true,
    eras: []
  },
  {
    id: 'japan',
    name: '🇯🇵 일본사',
    nameEn: '🇯🇵 Japanese History',
    progress: 0,
    enabled: false,
    comingSoon: true,
    eras: []
  },
  {
    id: 'world',
    name: '🌍 세계사',
    nameEn: '🌍 World History',
    progress: 0,
    enabled: false,
    comingSoon: true,
    eras: []
  }
]

export const MAP_REGIONS = [
  {
    id: 'world',
    flag: '🌍',
    labelKo: '세계사',
    labelEn: 'World',
    x: 23,
    y: 42,
    enabled: false
  },
  {
    id: 'china',
    flag: '🇨🇳',
    labelKo: '중국사',
    labelEn: 'China',
    x: 63,
    y: 49,
    enabled: false
  },
  {
    id: 'korea',
    flag: '🇰🇷',
    labelKo: '한국사',
    labelEn: 'Korea',
    x: 72,
    y: 47,
    enabled: true
  },
  {
    id: 'japan',
    flag: '🇯🇵',
    labelKo: '일본사',
    labelEn: 'Japan',
    x: 80,
    y: 45,
    enabled: false
  }
]

export function getSubject(subjectId) {
  return WORLD_DATA.find((subject) => subject.id === subjectId) || WORLD_DATA[0]
}

export function getEra(subjectId, eraId) {
  const subject = getSubject(subjectId)

  return (
    subject.eras.find((era) => era.id === eraId) ||
    subject.eras.find((era) => era.enabled) ||
    subject.eras[0]
  )
}

export function getRoute(subjectId, eraId, routeId) {
  const era = getEra(subjectId, eraId)

  if (!era) return null

  return (
    era.routes.find((route) => route.id === routeId) ||
    era.routes.find((route) => route.enabled) ||
    era.routes[0]
  )
}

export function getDisplayName(item, lang = 'ko') {
  if (!item) return ''

  return lang === 'en' ? item.nameEn || item.name : item.name
}
