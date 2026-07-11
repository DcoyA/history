export const dictionaries = {
  ko: {
    app: {
      title: 'Hi-Story',
      subtitle: '역사로 언어를 배우는 카드 수집 학습 RPG',
      startWithGoogle: 'Google로 시작하기'
    },

    hero: {
      label: '고구려 퀘스트',
      description: '퀴즈를 풀며 고구려 로드맵과 언어 카드를 완성하세요.',
      progress: '고구려 진행도',
      completed: '완료',
      remaining: '남은 퀘스트',
      total: '전체'
    },

    tabs: {
      quiz: '퀴즈',
      roadmap: '로드맵',
      collection: '도감',
      profile: '내정보'
    },

    quiz: {
      eyebrow: '오늘의 도전',
      title: '고구려 퀴즈',
      currentQuest: '현재 퀘스트',
      questHint: '정답을 맞히면 연결된 역사 카드와 언어 표현이 해금됩니다.',
      question: '문제',
      nextQuestion: '다음 문제로'
    },

    result: {
      correct: '정답입니다!',
      wrong: '오답입니다',
      tryAgain: '괜찮습니다. 다시 골라보세요.',
      rewardError: '하지만 보상 카드 정보를 불러오지 못했습니다.',
      cardCheckError: '카드 확인 중 오류가 발생했습니다.',
      cardSaveError: '카드 저장 중 오류가 발생했습니다.',
      newCard: '새 카드 획득',
      duplicateCard: '카드 수량이 증가했습니다.'
    },

    reward: {
      label: '획득 보상'
    },

    roadmap: {
      eyebrow: '전체 흐름',
      title: '고구려 로드맵',
      summaryTitle: '이 앱의 핵심 커리큘럼입니다.',
      summaryText: '퀴즈를 풀면 아래 노드가 하나씩 컬러로 해금됩니다.',
      tapNode: '노드를 눌러보세요',
      tapNodeDesc: '각 퀘스트가 어떤 역사 흐름에 속하는지 확인할 수 있습니다.',
      unlocked: '해금 완료',
      locked: '미해금',
      lockedQuest: '아직 해금되지 않은 퀘스트'
    },

    collection: {
      eyebrow: '수집 현황',
      title: '내 도감',
      ownedCards: '획득한 카드',
      lockedCards: '미획득 카드',
      empty: '아직 획득한 카드가 없습니다.',
      complete: '고구려 도감을 모두 완성했습니다!',
      undiscovered: '미발견 카드',
      unlockHint: '퀴즈를 풀어 해금'
    },

    profile: {
      collector: '고구려 로드맵 탐험가',
      level: '레벨',
      exp: '경험치',
      quest: '퀘스트',
      completion: '완성도',
      serviceExpansion: '서비스 확장 방향',
      expansionText: '고구려 로드맵을 완성하면 백제, 신라, 고려, 조선 로드맵으로 확장할 수 있습니다.',
      logout: '로그아웃',
      appLanguage: '앱 언어',
      studyLanguage: '학습 언어'
    },

    language: {
      ko: '한국어',
      en: 'English',
      ja: '日本語',
      zh: '中文'
    }
  },

  en: {
    app: {
      title: 'Hi-Story',
      subtitle: 'Learn languages through history with collectible cards',
      startWithGoogle: 'Continue with Google'
    },

    hero: {
      label: 'Goguryeo Quest',
      description: 'Complete the Goguryeo roadmap and unlock language cards through quizzes.',
      progress: 'Goguryeo Progress',
      completed: 'Completed',
      remaining: 'Remaining',
      total: 'Total'
    },

    tabs: {
      quiz: 'Quiz',
      roadmap: 'Roadmap',
      collection: 'Cards',
      profile: 'Profile'
    },

    quiz: {
      eyebrow: "Today's Challenge",
      title: 'Goguryeo Quiz',
      currentQuest: 'Current Quest',
      questHint: 'Answer correctly to unlock a history card and language expression.',
      question: 'Question',
      nextQuestion: 'Next Question'
    },

    result: {
      correct: 'Correct!',
      wrong: 'Not quite',
      tryAgain: 'No worries. Try again.',
      rewardError: 'The reward card could not be loaded.',
      cardCheckError: 'There was an error checking your card.',
      cardSaveError: 'There was an error saving your card.',
      newCard: 'New card unlocked',
      duplicateCard: 'Card count increased.'
    },

    reward: {
      label: 'Reward'
    },

    roadmap: {
      eyebrow: 'Full Journey',
      title: 'Goguryeo Roadmap',
      summaryTitle: 'This is the core learning journey.',
      summaryText: 'Each node is unlocked as you answer quizzes.',
      tapNode: 'Tap a node',
      tapNodeDesc: 'See how each quest connects to the historical flow.',
      unlocked: 'Unlocked',
      locked: 'Locked',
      lockedQuest: 'Locked quest'
    },

    collection: {
      eyebrow: 'Collection',
      title: 'My Cards',
      ownedCards: 'Unlocked Cards',
      lockedCards: 'Locked Cards',
      empty: 'You have not unlocked any cards yet.',
      complete: 'You completed the Goguryeo collection!',
      undiscovered: 'Undiscovered card',
      unlockHint: 'Unlock through quizzes'
    },

    profile: {
      collector: 'Goguryeo Roadmap Explorer',
      level: 'Level',
      exp: 'EXP',
      quest: 'Quests',
      completion: 'Completion',
      serviceExpansion: 'Expansion Plan',
      expansionText: 'After Goguryeo, this can expand to Baekje, Silla, Goryeo, and Joseon.',
      logout: 'Log out',
      appLanguage: 'App Language',
      studyLanguage: 'Study Language'
    },

    language: {
      ko: '한국어',
      en: 'English',
      ja: '日本語',
      zh: '中文'
    }
  }
}

export function getTranslator(language) {
  const dictionary = dictionaries[language] || dictionaries.ko

  return function t(path) {
    return path.split('.').reduce((current, key) => {
      return current?.[key]
    }, dictionary) || path
  }
}
