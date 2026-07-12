export function pick(value, fallback) {
  return value || fallback || ''
}

export function cardName(card, lang = 'ko') {
  if (!card) return ''
  return lang === 'en' ? pick(card.name_en, card.name) : card.name
}

export function cardEra(card, lang = 'ko') {
  if (!card) return ''
  return lang === 'en' ? pick(card.era_en, card.era) : card.era
}

export function cardCategory(card, lang = 'ko') {
  if (!card) return ''
  return lang === 'en' ? pick(card.category_en, card.category) : card.category
}

export function cardFlavor(card, lang = 'ko') {
  if (!card) return ''
  return lang === 'en' ? pick(card.flavor_text_en, card.flavor_text) : card.flavor_text
}

export function cardDetail(card, lang = 'ko') {
  if (!card) return ''

  if (lang === 'en') {
    return (
      card.detail_text_en ||
      card.flavor_text_en ||
      card.detail_text ||
      card.flavor_text ||
      ''
    )
  }

  return card.detail_text || card.flavor_text || ''
}

export function lessonQuestion(lesson, lang = 'ko') {
  if (!lesson) return ''
  return lang === 'en' ? pick(lesson.question_en, lesson.question) : lesson.question
}

export function lessonChoice(lesson, number, lang = 'ko') {
  if (!lesson) return ''

  const ko = lesson[`choice${number}`]
  const en = lesson[`choice${number}_en`]

  return lang === 'en' ? pick(en, ko) : ko
}

export function lessonExplanation(lesson, lang = 'ko') {
  if (!lesson) return ''
  return lang === 'en' ? pick(lesson.explanation_en, lesson.explanation) : lesson.explanation
}

export function nodeLabel(node, lang = 'ko') {
  if (!node) return ''
  return lang === 'en' ? pick(node.label_en, node.label) : node.label
}

export function nodeCategory(node, lang = 'ko') {
  if (!node) return ''
  return lang === 'en' ? pick(node.category_en, node.category) : node.category
}

export function nodeGroup(node, lang = 'ko') {
  if (!node) return ''
  return lang === 'en' ? pick(node.roadmap_group_en, node.roadmap_group) : node.roadmap_group
}

export function getCardIcon(category) {
  if (category === '인물' || category === 'Figure') return '👑'
  if (category === '유물' || category === 'Artifact') return '🏺'
  if (category === '전쟁' || category === 'War') return '⚔️'
  if (category === '건축' || category === 'Architecture') return '🏯'
  if (category === '예술' || category === 'Art') return '🎨'
  if (category === '복식' || category === 'Clothing') return '🥻'
  if (category === '제도' || category === 'Institution') return '📜'
  if (category === '사상' || category === 'Belief') return '🪷'

  return '✨'
}

export function getLockedLabel(node, lang = 'ko') {
  const category = nodeCategory(node, lang)

  if (lang === 'en') {
    if (category === 'Figure') return '??? Figure'
    if (category === 'War') return '??? Battle'
    if (category === 'Artifact') return '??? Artifact'
    if (category === 'Architecture') return '??? Building'
    if (category === 'Art') return '??? Art'
    if (category === 'Clothing') return '??? Clothing'
    if (category === 'Institution') return '??? System'

    return '????'
  }

  if (category === '인물') return '??? 왕'
  if (category === '전쟁') return '??? 전투'
  if (category === '유물') return '??? 유물'
  if (category === '건축') return '??? 건축'
  if (category === '예술') return '??? 예술'
  if (category === '복식') return '??? 복식'
  if (category === '제도') return '??? 제도'

  return '????'
}

export function getRarityStyle(rarity) {
  if (rarity === 'SSR') {
    return {
      border: '#d6b35a',
      cardBackground: 'linear-gradient(180deg, #2a2115, #111827)',
      badge: {
        background: 'linear-gradient(135deg, #d6b35a, #facc15)',
        color: '#2a1600'
      }
    }
  }

  if (rarity === 'SR') {
    return {
      border: '#8b5cf6',
      cardBackground: 'linear-gradient(180deg, #21183d, #111827)',
      badge: {
        background: 'linear-gradient(135deg, #7c3aed, #c4b5fd)',
        color: 'white'
      }
    }
  }

  if (rarity === 'R') {
    return {
      border: '#3b82f6',
      cardBackground: 'linear-gradient(180deg, #10213f, #111827)',
      badge: {
        background: 'linear-gradient(135deg, #2563eb, #93c5fd)',
        color: 'white'
      }
    }
  }

  return {
    border: '#475569',
    cardBackground: 'linear-gradient(180deg, #1f2937, #111827)',
    badge: {
      background: '#475569',
      color: '#e5e7eb'
    }
  }
}
