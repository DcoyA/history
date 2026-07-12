'use client'

import CardImage from './CardImage'
import {
  cardName,
  cardEra,
  cardCategory,
  cardFlavor,
  getRarityStyle
} from '../../lib/cardUtils'

export default function OwnedCard({
  item,
  card,
  appLanguage = 'ko',
  onClick
}) {
  const targetCard = card || item?.card
  const count = item?.count || 1
  const rarityStyle = getRarityStyle(targetCard?.rarity)

  return (
    <button
      type="button"
      onClick={() => onClick?.(item || { card: targetCard, count })}
      style={{
        ...styles.card,
        border: `1px solid ${rarityStyle.border}`,
        background: rarityStyle.cardBackground
      }}
    >
      <div style={styles.topRow}>
        <span style={{ ...styles.rarityBadge, ...rarityStyle.badge }}>
          {targetCard?.rarity || 'N'}
        </span>

        <span style={styles.countBadge}>
          x{count}
        </span>
      </div>

      <CardImage
        card={targetCard}
        size="normal"
        appLanguage={appLanguage}
      />

      <h3 style={styles.title}>
        {cardName(targetCard, appLanguage)}
      </h3>

      <p style={styles.meta}>
        {cardEra(targetCard, appLanguage)} · {cardCategory(targetCard, appLanguage)}
      </p>

      {cardFlavor(targetCard, appLanguage) && (
        <p style={styles.flavor}>
          {cardFlavor(targetCard, appLanguage)}
        </p>
      )}
    </button>
  )
}

const styles = {
  card: {
    width: '100%',
    padding: '12px',
    borderRadius: '22px',
    boxShadow: '0 12px 24px rgba(0,0,0,0.28)',
    color: '#f8fafc',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease',
    WebkitTapHighlightColor: 'transparent'
  },

  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '6px',
    marginBottom: '8px'
  },

  rarityBadge: {
    padding: '4px 8px',
    borderRadius: '999px',
    fontSize: '11px',
    fontWeight: 900
  },

  countBadge: {
    padding: '4px 8px',
    borderRadius: '999px',
    background: 'rgba(214,179,90,0.18)',
    color: '#facc15',
    fontSize: '11px',
    fontWeight: 900
  },

  title: {
    margin: '0 0 5px',
    fontSize: '16px',
    lineHeight: 1.3,
    color: '#f8fafc'
  },

  meta: {
    margin: 0,
    color: '#94a3b8',
    fontSize: '13px'
  },

  flavor: {
    margin: '9px 0 0',
    color: '#cbd5e1',
    fontSize: '12px',
    lineHeight: 1.45
  }
}
