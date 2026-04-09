export const SKILLS = {
  FARMING: 'farming',
  FISHING: 'fishing',
  FORAGING: 'foraging',
  MINING: 'mining',
  COMBAT: 'combat',
};

export const PROFESSION_DEFS = {
  rancher: { id: 'rancher', skill: SKILLS.FARMING, level: 5, bonusType: 'price', multiplier: 1.2 },
  tiller: { id: 'tiller', skill: SKILLS.FARMING, level: 5, bonusType: 'price', multiplier: 1.1 },
  coopmaster: { id: 'coopmaster', skill: SKILLS.FARMING, level: 10, parent: 'rancher', bonusType: 'perk' },
  shepherd: { id: 'shepherd', skill: SKILLS.FARMING, level: 10, parent: 'rancher', bonusType: 'perk' },
  artisan: { id: 'artisan', skill: SKILLS.FARMING, level: 10, parent: 'tiller', bonusType: 'price', multiplier: 1.4, exclusions: ['oil'] },
  agriculturist: { id: 'agriculturist', skill: SKILLS.FARMING, level: 10, parent: 'tiller', bonusType: 'perk' },

  fisher: { id: 'fisher', skill: SKILLS.FISHING, level: 5, bonusType: 'price', multiplier: 1.25 },
  trapper: { id: 'trapper', skill: SKILLS.FISHING, level: 5, bonusType: 'perk' },
  angler: { id: 'angler', skill: SKILLS.FISHING, level: 10, parent: 'fisher', bonusType: 'price', multiplier: 1.5 },
  pirate: { id: 'pirate', skill: SKILLS.FISHING, level: 10, parent: 'fisher', bonusType: 'perk' },
  mariner: { id: 'mariner', skill: SKILLS.FISHING, level: 10, parent: 'trapper', bonusType: 'perk' },
  luremaster: { id: 'luremaster', skill: SKILLS.FISHING, level: 10, parent: 'trapper', bonusType: 'perk' },

  forester: { id: 'forester', skill: SKILLS.FORAGING, level: 5, bonusType: 'perk' },
  gatherer: { id: 'gatherer', skill: SKILLS.FORAGING, level: 5, bonusType: 'perk' },
  lumberjack: { id: 'lumberjack', skill: SKILLS.FORAGING, level: 10, parent: 'forester', bonusType: 'perk' },
  tapper: { id: 'tapper', skill: SKILLS.FORAGING, level: 10, parent: 'forester', bonusType: 'price', multiplier: 1.25 },
  botanist: { id: 'botanist', skill: SKILLS.FORAGING, level: 10, parent: 'gatherer', bonusType: 'perk' },
  tracker: { id: 'tracker', skill: SKILLS.FORAGING, level: 10, parent: 'gatherer', bonusType: 'perk' },

  miner: { id: 'miner', skill: SKILLS.MINING, level: 5, bonusType: 'perk' },
  geologist: { id: 'geologist', skill: SKILLS.MINING, level: 5, bonusType: 'perk' },
  blacksmith: { id: 'blacksmith', skill: SKILLS.MINING, level: 10, parent: 'miner', bonusType: 'price', multiplier: 1.5 },
  prospector: { id: 'prospector', skill: SKILLS.MINING, level: 10, parent: 'miner', bonusType: 'perk' },
  excavator: { id: 'excavator', skill: SKILLS.MINING, level: 10, parent: 'geologist', bonusType: 'perk' },
  gemologist: { id: 'gemologist', skill: SKILLS.MINING, level: 10, parent: 'geologist', bonusType: 'price', multiplier: 1.3 },

  fighter: { id: 'fighter', skill: SKILLS.COMBAT, level: 5, bonusType: 'perk' },
  scout: { id: 'scout', skill: SKILLS.COMBAT, level: 5, bonusType: 'perk' },
  brute: { id: 'brute', skill: SKILLS.COMBAT, level: 10, parent: 'fighter', bonusType: 'perk' },
  defender: { id: 'defender', skill: SKILLS.COMBAT, level: 10, parent: 'fighter', bonusType: 'perk' },
  acrobat: { id: 'acrobat', skill: SKILLS.COMBAT, level: 10, parent: 'scout', bonusType: 'perk' },
  desperado: { id: 'desperado', skill: SKILLS.COMBAT, level: 10, parent: 'scout', bonusType: 'perk' },
};

export const PROFESSION_TREES = {
  [SKILLS.FARMING]: {
    level5: ['rancher', 'tiller'],
    level10: {
      rancher: ['coopmaster', 'shepherd'],
      tiller: ['artisan', 'agriculturist'],
    },
  },
  [SKILLS.FISHING]: {
    level5: ['fisher', 'trapper'],
    level10: {
      fisher: ['angler', 'pirate'],
      trapper: ['mariner', 'luremaster'],
    },
  },
  [SKILLS.FORAGING]: {
    level5: ['forester', 'gatherer'],
    level10: {
      forester: ['lumberjack', 'tapper'],
      gatherer: ['botanist', 'tracker'],
    },
  },
  [SKILLS.MINING]: {
    level5: ['miner', 'geologist'],
    level10: {
      miner: ['blacksmith', 'prospector'],
      geologist: ['excavator', 'gemologist'],
    },
  },
  [SKILLS.COMBAT]: {
    level5: ['fighter', 'scout'],
    level10: {
      fighter: ['brute', 'defender'],
      scout: ['acrobat', 'desperado'],
    },
  },
};

export const DEFAULT_PROFESSION_SELECTION = {
  [SKILLS.FARMING]: { level5: null, level10: null },
  [SKILLS.FISHING]: { level5: null, level10: null },
  [SKILLS.FORAGING]: { level5: null, level10: null },
  [SKILLS.MINING]: { level5: null, level10: null },
  [SKILLS.COMBAT]: { level5: null, level10: null },
};

export function normalizeProfessionSelection(selection = {}) {
  const normalized = {};
  Object.keys(DEFAULT_PROFESSION_SELECTION).forEach((skill) => {
    const value = selection[skill] || {};
    normalized[skill] = {
      level5: value.level5 ?? null,
      level10: value.level10 ?? null,
    };
  });
  return normalized;
}

export function validateProfessionSelection(selection = {}) {
  const normalized = normalizeProfessionSelection(selection);
  const errors = [];

  Object.entries(PROFESSION_TREES).forEach(([skill, tree]) => {
    const choice = normalized[skill];
    const level5 = choice.level5;
    const level10 = choice.level10;

    if (level5 && !tree.level5.includes(level5)) {
      errors.push(`Invalid level 5 profession "${level5}" for skill "${skill}"`);
    }

    if (level10) {
      const allowedLevel10 = level5 ? (tree.level10[level5] || []) : [];
      if (!level5) {
        errors.push(`Level 10 profession "${level10}" requires level 5 choice for "${skill}"`);
      } else if (!allowedLevel10.includes(level10)) {
        errors.push(`Invalid level 10 profession "${level10}" for level 5 "${level5}" in "${skill}"`);
      }
    }
  });

  return { valid: errors.length === 0, errors, normalized };
}

export function getActiveProfessionIds(selection = {}) {
  const { normalized } = validateProfessionSelection(selection);
  const active = new Set();
  Object.values(normalized).forEach(({ level5, level10 }) => {
    if (level5) active.add(level5);
    if (level10) active.add(level10);
  });
  return active;
}
