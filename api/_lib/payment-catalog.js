function readFixedAmount(envName) {
  const raw = process.env[envName];
  if (raw === undefined || raw === null || String(raw).trim() === '') return null;
  const value = Number(raw);
  if (!Number.isFinite(value) || value <= 0 || value > 10000000) return null;
  return Math.round(value * 100) / 100;
}

const DEFINITIONS = {
  'donation-general': {
    label: 'General Donation',
    kind: 'donation',
    category: 'General event fund',
    customAmount: true
  },
  'puja-seva': {
    label: 'Puja & Seva',
    kind: 'puja_seva',
    category: 'Puja & Seva',
    amountEnv: 'PAYMENT_AMOUNT_PUJA_SEVA'
  },
  'puja-participation': {
    label: 'Puja Participation',
    kind: 'puja_seva',
    category: 'Puja participation',
    amountEnv: 'PAYMENT_AMOUNT_PUJA_PARTICIPATION'
  },
  'yajna-seva': {
    label: 'Yajna Seva',
    kind: 'puja_seva',
    category: 'Yajna seva',
    amountEnv: 'PAYMENT_AMOUNT_YAJNA_SEVA'
  },
  'annadanam': {
    label: 'Annadanam',
    kind: 'seva',
    category: 'Annadanam',
    amountEnv: 'PAYMENT_AMOUNT_ANNADANAM'
  },
  'sponsorship-general': {
    label: 'General Sponsorship',
    kind: 'sponsorship',
    category: 'General sponsorship',
    amountEnv: 'PAYMENT_AMOUNT_SPONSORSHIP_GENERAL'
  },
  'sponsorship-main-ceremony': {
    label: 'Main Ceremony Sponsorship',
    kind: 'sponsorship',
    category: 'Main Ceremony',
    amountEnv: 'PAYMENT_AMOUNT_SPONSOR_MAIN_CEREMONY'
  },
  'sponsorship-puja-seva': {
    label: 'Puja & Seva Arrangements Sponsorship',
    kind: 'sponsorship',
    category: 'Puja & Seva Arrangements',
    amountEnv: 'PAYMENT_AMOUNT_SPONSOR_PUJA_SEVA'
  },
  'sponsorship-accommodation': {
    label: 'Accommodation Sponsorship',
    kind: 'sponsorship',
    category: 'Accommodation',
    amountEnv: 'PAYMENT_AMOUNT_SPONSOR_ACCOMMODATION'
  },
  'sponsorship-transportation': {
    label: 'Transportation Sponsorship',
    kind: 'sponsorship',
    category: 'Transportation',
    amountEnv: 'PAYMENT_AMOUNT_SPONSOR_TRANSPORTATION'
  },
  'sponsorship-drinking-water': {
    label: 'Drinking Water Sponsorship',
    kind: 'sponsorship',
    category: 'Drinking Water',
    amountEnv: 'PAYMENT_AMOUNT_SPONSOR_DRINKING_WATER'
  },
  'sponsorship-venue-infrastructure': {
    label: 'Venue & Infrastructure Sponsorship',
    kind: 'sponsorship',
    category: 'Venue & Infrastructure',
    amountEnv: 'PAYMENT_AMOUNT_SPONSOR_VENUE_INFRASTRUCTURE'
  },
  'sponsorship-media-documentation': {
    label: 'Media & Documentation Sponsorship',
    kind: 'sponsorship',
    category: 'Media & Documentation',
    amountEnv: 'PAYMENT_AMOUNT_SPONSOR_MEDIA_DOCUMENTATION'
  },
  'sponsorship-live-streaming': {
    label: 'Live Streaming Sponsorship',
    kind: 'sponsorship',
    category: 'Live Streaming',
    amountEnv: 'PAYMENT_AMOUNT_SPONSOR_LIVE_STREAMING'
  },
  'sponsorship-publications': {
    label: 'Publications Sponsorship',
    kind: 'sponsorship',
    category: 'Publications',
    amountEnv: 'PAYMENT_AMOUNT_SPONSOR_PUBLICATIONS'
  },
  'sponsorship-visitor-services': {
    label: 'Visitor Services Sponsorship',
    kind: 'sponsorship',
    category: 'Visitor Services',
    amountEnv: 'PAYMENT_AMOUNT_SPONSOR_VISITOR_SERVICES'
  }
};

export function getPaymentOption(optionKey) {
  const definition = DEFINITIONS[optionKey];
  if (!definition) return null;
  if (definition.customAmount) {
    return { optionKey, ...definition, amountRupees: null, amountPaise: null, available: true };
  }
  const amountRupees = readFixedAmount(definition.amountEnv);
  return {
    optionKey,
    ...definition,
    amountRupees,
    amountPaise: amountRupees === null ? null : Math.round(amountRupees * 100),
    available: amountRupees !== null
  };
}

export function getPublicPaymentOptions() {
  return Object.fromEntries(Object.keys(DEFINITIONS).map((optionKey) => {
    const option = getPaymentOption(optionKey);
    return [optionKey, {
      label: option.label,
      kind: option.kind,
      category: option.category,
      customAmount: Boolean(option.customAmount),
      amountRupees: option.amountRupees,
      available: option.available
    }];
  }));
}
