'use client'

import CardImage from './CardImage'
import {
  cardName,
  cardEra,
  cardCategory,
  cardFlavor,
  cardDetail,
  getRarityStyle
} from '../../lib/cardUtils'

export default function CardDetailModal({
  item,
  card,
  appLanguage = 'ko',
  onClose
}) {
  const targetCard = card || item?.card

  if (!targetCard) return null

  const count = item?.count || 1
  const rarityStyle = getRarityStyle(targetCard?.rarity)
  const isEnglish = appLanguage === 'en'

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div
        style={{
          ...styles.modal,
          border: `1px solid ${rarityStyle.border}`,
          background: rarityStyle.cardBackground
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div style={styles.modalGlow} />

        <div style={styles.topBar}>
          <span style={{ ...styles.rarityBadge, ...rarityStyle.badge }}>
            {targetCard?.rarity || 'N'}
          </span>

          <button type="button" onClick={onClose} style={styles.closeButton}>
            ✕
          </button>
        </div>

        <div style={styles.cardFrame}>
          <CardImage
            card={targetCard}
            size="hero"
            appLanguage={appLanguage}
            radius={22}
          />
        </div>

        <div style={styles.content}>
          <h2 style={styles.title}>
            {cardName(targetCard, appLanguage)}
          </h2>

          <p style={styles.meta}>
            {cardEra(targetCard, appLanguage)} · {cardCategory(targetCard, appLanguage)}
          </p>

          <div style={styles.infoRow}>
            <span>
              {isEnglish ? 'Owned' : '보유'}
            </span>
            <strong>x{count}</strong>
          </div>

          {targetCard?.year_start && (
            <div style={styles.infoRow}>
              <span>
                {isEnglish ? 'Period' : '시기'}
              </span>
              <strong>
                {targetCard.year_start}
                {targetCard.year_end && targetCard.year_end !== targetCard.year_start
                  ? ` - ${targetCard.year_end}`
                  : ''}
              </strong>
            </div>
          )}

          <section style={styles.section}>
            <h3>
              {isEnglish ? 'Card Story' : '카드 설명'}
            </h3>
            <p>
              {cardDetail(targetCard, appLanguage) || cardFlavor(targetCard, appLanguage)}
            </p>
          </section>

          <section style={styles.section}>
            <h3>
              {isEnglish ? 'Language Note' : '언어 학습 포인트'}
            </h3>

            <div style={styles.languageBox}>
              <strong>
                {isEnglish
                  ? 'Learn the history through a sentence.'
                  : '이 역사 개념을 문장으로 익혀보세요.'}
              </strong>

              <p>
                {isEnglish
                  ? buildEnglishSentence(targetCard)
                  : buildKoreanGuide(targetCard)}
              </p>
            </div>
          </section>

          <section style={styles.section}>
            <h3>
              {isEnglish ? 'Collection Value' : '수집 가치'}
            </h3>

            <p>
              {buildRarityDescription(targetCard?.rarity, appLanguage)}
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

function buildEnglishSentence(card) {
  const name = card?.name_en || card?.name || 'This card'
  const category = card?.category_en || card?.category || 'history'

  if (category === 'War' || category === '전쟁') {
    return `${name} was an important event in Goguryeo history.`
  }

  if (category === 'Figure' || category === '인물') {
    return `${name} played an important role in Goguryeo history.`
  }

  if (category === 'Artifact' || category === '유물') {
    return `${name} shows the culture and power of Goguryeo.`
  }

  return `${name} helps us understand Goguryeo history.`
}

function buildKoreanGuide(card) {
  const name = card?.name || card?.name_en || '이 카드'

  return `${name}와 관련된 영어 문장을 함께 익히면 역사 지식과 어휘를 동시에 학습할 수 있습니다.`
}

function buildRarityDescription(rarity, lang) {
  const isEnglish = lang === 'en'

  if (rarity === 'SSR') {
    return isEnglish
      ? 'This is a legendary-grade card with high collection value.'
      : '전설급 카드로 수집 가치가 매우 높은 카드입니다.'
  }

  if (rarity === 'SR') {
    return isEnglish
      ? 'This is a special rare card connected to an important historical theme.'
      : '중요한 역사 주제와 연결된 특별 희귀 카드입니다.'
  }

  if (rarity === 'R') {
    return isEnglish
      ? 'This is a rare card that expands your understanding of the period.'
      : '시대 이해를 넓혀주는 희귀 카드입니다.'
  }

  return isEnglish
    ? 'This is a basic card that helps build your historical foundation.'
    : '역사 기초를 쌓는 기본 카드입니다.'
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 100,
    background: 'rgba(2, 6, 23, 0.78)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '18px',
    boxSizing: 'border-box'
  },

  modal: {
    position: 'relative',
    width: '100%',
    maxWidth: '390px',
    maxHeight: '88vh',
    overflowY: 'auto',
    borderRadius: '30px',
    padding: '16px',
    color: '#f8fafc',
    boxShadow: '0 30px 80px rgba(0,0,0,0.58)'
  },

  modalGlow: {
    position: 'absolute',
    inset: 0,
    borderRadius: '30px',
    pointerEvents: 'none',
    background: 'radial-gradient(circle at 50% 0%, rgba(250,204,21,0.18), transparent 38%)'
  },

  topBar: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },

  rarityBadge: {
    padding: '6px 11px',
    borderRadius: '999px',
    fontSize: '13px',
    fontWeight: 900
  },

  closeButton: {
    width: '34px',
    height: '34px',
    border: '1px solid rgba(255,255,255,0.16)',
    borderRadius: '999px',
    background: 'rgba(15,23,42,0.75)',
    color: '#f8fafc',
    fontWeight: 900,
    cursor: 'pointer'
  },

  cardFrame: {
    position: 'relative',
    zIndex: 1,
    padding: '8px',
    borderRadius: '26px',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
    border: '1px solid rgba(255,255,255,0.10)',
    marginBottom: '14px'
  },

  content: {
    position: 'relative',
    zIndex: 1
  },

  title: {
    margin: '0 0 6px',
    fontSize: '28px',
    letterSpacing: '-0.5px'
  },

  meta: {
    margin: '0 0 14px',
    color: '#d6b35a',
    fontSize: '14px',
    fontWeight: 800
  },

  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 12px',
    borderRadius: '14px',
    background: 'rgba(255,255,255,0.06)',
    marginBottom: '8px',
    color: '#cbd5e1'
  },

  section: {
    marginTop: '18px'
  },

  languageBox: {
    padding: '13px',
    borderRadius: '16px',
    background: 'rgba(59,130,246,0.12)',
    border: '1px solid rgba(147,197,253,0.16)',
    color: '#dbeafe',
    lineHeight: 1.5
  }
}
