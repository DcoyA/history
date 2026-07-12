'use client'

import { useState } from 'react'
import OwnedCard from './OwnedCard'
import CardDetailModal from './CardDetailModal'
import { cardCategory } from '../../lib/cardUtils'

export default function CollectionTab({
  t,
  appLanguage = 'ko',
  ownedCards = [],
  lockedCards = [],
  ownedCount = 0,
  totalCount = 0,
  collectionRate = 0
}) {
  const [selectedCardItem, setSelectedCardItem] = useState(null)

  return (
    <section style={styles.section}>
      <div style={styles.sectionHeader}>
        <div>
          <p style={styles.goldEyebrow}>
            {t.collection.eyebrow}
          </p>

          <h2 style={styles.sectionTitle}>
            {t.collection.title}
          </h2>
        </div>

        <span style={styles.pill}>
          {collectionRate}%
        </span>
      </div>

      <div style={styles.collectionSummary}>
        <div>
          <strong>{ownedCount} / {totalCount}</strong>
          <span>{t.collection.locked}: {lockedCards.length}</span>
        </div>

        <div style={styles.progressTrack}>
          <div
            style={{
              ...styles.progressFill,
              width: `${collectionRate}%`
            }}
          />
        </div>
      </div>

      <h3 style={styles.subTitle}>
        {t.collection.owned}
      </h3>

      {ownedCards.length === 0 ? (
        <div style={styles.emptyBox}>
          {t.collection.empty}
        </div>
      ) : (
        <div style={styles.cardGrid}>
          {ownedCards.map((item) => (
            <OwnedCard
              key={item.id}
              item={item}
              appLanguage={appLanguage}
              onClick={setSelectedCardItem}
            />
          ))}
        </div>
      )}

      <h3 style={styles.subTitle}>
        {t.collection.locked}
      </h3>

      {lockedCards.length === 0 ? (
        <div style={styles.completeBox}>
          {t.collection.complete}
        </div>
      ) : (
        <div style={styles.cardGrid}>
          {lockedCards.map((card) => (
            <LockedCard
              key={card.id}
              t={t}
              appLanguage={appLanguage}
              card={card}
            />
          ))}
        </div>
      )}

      {selectedCardItem && (
        <CardDetailModal
          item={selectedCardItem}
          appLanguage={appLanguage}
          onClose={() => setSelectedCardItem(null)}
        />
      )}
    </section>
  )
}

function LockedCard({ t, appLanguage, card }) {
  return (
    <div style={styles.lockedCard}>
      <div style={styles.lockedGlow} />

      <div style={styles.lockedIcon}>
        ?
      </div>

      <h3 style={styles.lockedTitle}>
        ?????
      </h3>

      <p style={styles.lockedText}>
        {cardCategory(card, appLanguage) || t.collection.undiscovered}
      </p>

      <small style={styles.lockedHint}>
        {t.collection.unlockHint}
      </small>
    </div>
  )
}

const styles = {
  section: {
    marginTop: '18px'
  },

  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },

  goldEyebrow: {
    margin: '0 0 4px',
    color: '#d6b35a',
    fontSize: '13px',
    fontWeight: 900
  },

  sectionTitle: {
    margin: 0,
    fontSize: '25px',
    letterSpacing: '-0.4px',
    color: '#f8fafc'
  },

  pill: {
    padding: '7px 10px',
    borderRadius: '999px',
    background: 'rgba(214,179,90,0.16)',
    color: '#facc15',
    fontWeight: 800,
    fontSize: '13px',
    border: '1px solid rgba(214,179,90,0.25)'
  },

  collectionSummary: {
    padding: '15px',
    borderRadius: '20px',
    background: '#0f172a',
    border: '1px solid rgba(214,179,90,0.18)',
    color: '#f8fafc',
    display: 'grid',
    gap: '10px',
    marginBottom: '20px'
  },

  progressTrack: {
    height: '10px',
    borderRadius: '999px',
    background: 'rgba(255,255,255,0.12)',
    overflow: 'hidden'
  },

  progressFill: {
    height: '100%',
    borderRadius: '999px',
    background: 'linear-gradient(90deg, #22c55e, #d6b35a)',
    transition: 'width 0.35s ease'
  },

  subTitle: {
    margin: '22px 0 10px',
    fontSize: '18px',
    color: '#f8fafc'
  },

  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '12px'
  },

  emptyBox: {
    padding: '18px',
    borderRadius: '18px',
    background: '#0f172a',
    border: '1px dashed #475569',
    color: '#94a3b8'
  },

  completeBox: {
    padding: '18px',
    borderRadius: '18px',
    background: 'rgba(34,197,94,0.12)',
    border: '1px solid #22c55e',
    color: '#86efac',
    fontWeight: 900
  },

  lockedCard: {
    minHeight: '188px',
    borderRadius: '22px',
    padding: '15px',
    background: 'linear-gradient(135deg, #111827, #1e293b)',
    color: 'white',
    border: '1px solid #334155',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: 'inset 0 0 30px rgba(0,0,0,0.35)'
  },

  lockedGlow: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(circle at center, rgba(214,179,90,0.16), transparent 58%)'
  },

  lockedIcon: {
    position: 'relative',
    zIndex: 1,
    width: '54px',
    height: '54px',
    borderRadius: '999px',
    background: 'rgba(255,255,255,0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '30px',
    marginBottom: '12px'
  },

  lockedTitle: {
    position: 'relative',
    zIndex: 1,
    margin: '0 0 8px',
    fontSize: '20px',
    letterSpacing: '2px'
  }
