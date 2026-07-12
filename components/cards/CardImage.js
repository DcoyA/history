'use client'

import React from 'react'
import { cardName, getCardIcon } from '../../lib/cardUtils'

export default function CardImage({
  card,
  size = 'normal',
  appLanguage = 'ko',
  radius = 18
}) {
  const isLarge = size === 'large'
  const isHero = size === 'hero'

  const height = isHero ? 260 : isLarge ? 170 : 112
  const fontSize = isHero ? 72 : isLarge ? 56 : 42
  const altText = cardName(card, appLanguage) || 'card image'

  if (card?.image_url) {
    return (
      <div
        style={{
          ...styles.imageWrap,
          height,
          borderRadius: radius
        }}
      >
        {React.createElement('img', {
          src: card.image_url,
          alt: altText,
          style: styles.image,
          loading: 'lazy',
          referrerPolicy: 'no-referrer',
          draggable: false
        })}
      </div>
    )
  }

  return (
    <div
      style={{
        ...styles.placeholder,
        height,
        fontSize,
        borderRadius: radius
      }}
    >
      {getCardIcon(card?.category)}
    </div>
  )
}

const styles = {
  imageWrap: {
    width: '100%',
    overflow: 'hidden',
    background: '#111827',
    marginBottom: '10px',
    boxShadow: 'inset 0 0 18px rgba(0,0,0,0.35)'
  },

  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block'
  },

  placeholder: {
    width: '100%',
    background: 'linear-gradient(135deg, #1e293b, #111827)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '10px',
    boxShadow: 'inset 0 0 18px rgba(0,0,0,0.35)'
  }
}
