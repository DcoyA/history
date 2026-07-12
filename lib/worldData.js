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
        routeId: 'gojoseon',
        name: '고조선',
        nameEn: 'Gojoseon',
        period: '기원전',
        enabled: true,
        type: 'era',
        description: '한반도 초기 국가 형성과 청동기 문화를 배웁니다.',
        descriptionEn: 'Learn early state formation and Bronze Age culture.',
        routes: []
      },
      {
        id: 'three_kingdoms',
        name: '삼국시대',
        nameEn: 'Three Kingdoms',
        period: '1C - 7C',
        enabled: true,
        type: 'era_group',
        description: '고구려, 백제, 신라, 가야가 경쟁하던 시대입니다.',
        descriptionEn: 'The age of Goguryeo, Baekje, Silla, and Gaya.',
        routes: [
          {
            id: 'goguryeo',
            eraId: 'three_kingdoms',
            name: '🏰 고구려',
            nameEn: '🏰 Goguryeo',
            enabled: true,
            description: '현재 플레이 가능한 삼국시대 콘텐츠입니다.',
            descriptionEn: 'Playable Three Kingdoms content.'
          },
          {
            id: 'baekje',
            eraId: 'three_kingdoms',
            name: '🏯 백제',
            nameEn: '🏯 Baekje',
            enabled: false,
            description: '추후 공개 예정입니다.',
            descriptionEn: 'Coming soon.'
          },
          {
            id: 'silla',
            eraId: 'three_kingdoms',
            name: '🟢 신라',
            nameEn: '🟢 Silla',
            enabled: false,
            description: '추후 공개 예정입니다.',
            descriptionEn: 'Coming soon.'
          },
          {
            id: 'gaya',
            eraId: 'three_kingdoms',
            name: '🌊 가야',
            nameEn: '🌊 Gaya',
            enabled: false,
            description: '추후 공개 예정입니다.',
            descriptionEn: 'Coming soon.'
          }
        ]
      },
      {
        id: 'goryeo',
        routeId: 'goryeo',
        name: '고려',
        nameEn: 'Goryeo',
        period: '918 - 1392',
        enabled: true,
        type: 'era',
        description: '불교 문화, 대외 항쟁, 인쇄 문화를 배웁니다.',
        descriptionEn: 'Learn Buddhist culture, foreign invasions, and printing culture.',
        routes: []
      },
      {
        id: 'joseon',
        routeId: 'joseon',
        name: '조선',
        nameEn: 'Joseon',
        period: '1392 - 1897',
        enabled: true,
        type: 'era',
        description: '유교 국가, 훈민정음, 전쟁과 개혁을 배웁니다.',
        descriptionEn: 'Learn Confucian governance, Hunminjeongeum, wars, and reform.',
        routes: []
      },
      {
        id: 'modern',
        routeId: 'modern',
        name: '근현대',
        nameEn: 'Modern Korea',
        period: '1897 - 현재',
        enabled: true,
        type: 'era',
        description: '독립운동, 광복, 전쟁, 민주화를 배웁니다.',
        descriptionEn: 'Learn independence movements, liberation, war, and democratization.',
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

  if (era.routes && era.routes.length > 0) {
    return (
      era.routes.find((route) => route.id === routeId) ||
      era.routes.find((route) => route.enabled) ||
      era.routes[0]
    )
  }

  return {
    id: era.routeId || era.id,
    eraId: era.id,
    name: era.name,
    nameEn: era.nameEn,
    enabled: era.enabled
  }
}

export function getDisplayName(item, lang = 'ko') {
  if (!item) return ''

  return lang === 'en' ? item.nameEn || item.name : item.name
}

export function getCurrentContentKey(selectedEra, selectedRoute) {
  if (selectedRoute) return selectedRoute
  if (selectedEra) return selectedEra
  return 'goguryeo'
}

export function getCurrentEraKey(selectedEra, selectedRoute) {
  if (selectedRoute === 'goguryeo') return 'three_kingdoms'
  if (selectedRoute) return selectedRoute
  if (selectedEra) return selectedEra
  return 'three_kingdoms'
}
