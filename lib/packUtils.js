export function getPackConfig(difficulty = 1) {
  if (Number(difficulty) === 3) {
    return {
      key: 'advanced',
      name: 'Advanced Goguryeo Pack',
      nameKo: '고구려 고급 카드팩',
      count: 5,
      guaranteedMinimumRarity: 'R',
      rates: [
        { rarity: 'N', weight: 25 },
        { rarity: 'R', weight: 45 },
        { rarity: 'SR', weight: 25 },
        { rarity: 'SSR', weight: 5 }
      ]
    }
  }

  if (Number(difficulty) === 2) {
    return {
      key: 'intermediate',
      name: 'Intermediate Goguryeo Pack',
      nameKo: '고구려 중급 카드팩',
      count: 4,
      guaranteedMinimumRarity: null,
      rates: [
        { rarity: 'N', weight: 45 },
        { rarity: 'R', weight: 40 },
        { rarity: 'SR', weight: 13 },
        { rarity: 'SSR', weight: 2 }
      ]
    }
  }

  return {
    key: 'beginner',
    name: 'Beginner Goguryeo Pack',
    nameKo: '고구려 초급 카드팩',
    count: 3,
    guaranteedMinimumRarity: null,
    rates: [
      { rarity: 'N', weight: 70 },
      { rarity: 'R', weight: 25 },
      { rarity: 'SR', weight: 4 },
      { rarity: 'SSR', weight: 1 }
    ]
  }
}

export function getDifficultyLabel(difficulty = 1, lang = 'ko') {
  if (Number(difficulty) === 3) {
    return lang === 'en' ? 'Advanced' : '고급'
  }

  if (Number(difficulty) === 2) {
    return lang === 'en' ? 'Intermediate' : '중급'
  }

  return lang === 'en' ? 'Beginner' : '초급'
}

export function drawRarity(rates) {
  const totalWeight = rates.reduce((sum, item) => sum + item.weight, 0)
  let roll = Math.random() * totalWeight

  for (const item of rates) {
    roll -= item.weight

    if (roll <= 0) {
      return item.rarity
    }
  }

  return 'N'
}

export function upgradeRarityForGuarantee(rarity, minimumRarity) {
  if (!minimumRarity) return rarity

  const rarityOrder = {
    N: 1,
    R: 2,
    SR: 3,
    SSR: 4
  }

  if ((rarityOrder[rarity] || 1) >= (rarityOrder[minimumRarity] || 1)) {
    return rarity
  }

  return minimumRarity
}

export function pickRandomCard(cards, rarity) {
  const rarityPool = cards.filter((card) => card.rarity === rarity)
  const fallbackPool = cards || []
  const pool = rarityPool.length > 0 ? rarityPool : fallbackPool

  if (pool.length === 0) return null

  return pool[Math.floor(Math.random() * pool.length)]
}

export function simulatePackPull(cards, difficulty = 1) {
  const packConfig = getPackConfig(difficulty)
  const pulledCards = []

  for (let index = 0; index < packConfig.count; index += 1) {
    let rarity = drawRarity(packConfig.rates)

    if (index === 0 && packConfig.guaranteedMinimumRarity) {
      rarity = upgradeRarityForGuarantee(
        rarity,
        packConfig.guaranteedMinimumRarity
      )
    }

    const card = pickRandomCard(cards, rarity)

    if (card) {
      pulledCards.push(card)
    }
  }

  return {
    packConfig,
    cards: pulledCards
  }
}
