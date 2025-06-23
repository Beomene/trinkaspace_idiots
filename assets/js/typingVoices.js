// Typing Voice Profiles for Trinkaloop Saga Characters
// Each character has their own unique typing fingerprint

export const TYPING_VOICES = {
  // Eene: Fast typer with frequent typos that get corrected quickly
  eene: {
    name: "Eene",
    baseSpeed: 35,           // Fast typing (lower = faster)
    speedVariation: 25,      // High variation (±25ms)
    typoChance: 0.08,        // 8% typo chance (higher than normal)
    correctionDelay: 150,    // Quick to notice and fix typos
    correctionSpeed: 40,     // Fast deletion
    pauseMultiplier: 0.7,    // Shorter pauses at punctuation
    personality: {
      // Eene makes more casual typing mistakes
      extraTypos: [
        { correct: 'really', wrong: 'relly' },
        { correct: 'think', wrong: 'thinkg' },
        { correct: 'right', wrong: 'rght' },
        { correct: 'probably', wrong: 'probaly' },
        { correct: 'definitely', wrong: 'definetly' },
        { correct: 'because', wrong: 'becuase' }
      ],
      // Sometimes rushes through words
      rushChance: 0.03,       // 3% chance to skip a character initially
      impatience: true        // Fixes typos immediately
    }
  },

  // Emraa: Medium speed, rarely makes typos, fixes them in batches
  emraa: {
    name: "Emraa",
    baseSpeed: 55,           // Medium speed
    speedVariation: 15,      // Low variation (more consistent)
    typoChance: 0.02,        // Very low typo chance (2%)
    correctionDelay: 0,      // Doesn't fix immediately
    correctionSpeed: 35,     // Methodical correction speed
    pauseMultiplier: 1.2,    // Slightly longer pauses (thoughtful)
    personality: {
      // Emraa makes more sophisticated mistakes
      extraTypos: [
        { correct: 'separate', wrong: 'seperate' },
        { correct: 'necessary', wrong: 'neccessary' },
        { correct: 'occurring', wrong: 'occuring' },
        { correct: 'achievement', wrong: 'acheivment' }
      ],
      batchCorrection: true,   // Fixes all typos at the end
      perfectionist: true,    // Very careful typing
      rushChance: 0           // Never rushes
    }
  },

  // Lyl: Slow typing with funny mistakes that never get corrected
  lyl: {
    name: "Lyl",
    baseSpeed: 120,          // Very slow (higher = slower)
    speedVariation: 50,      // High variation (distracted)
    typoChance: 0.12,        // High typo chance (12%)
    correctionDelay: 0,      // Never corrects
    correctionSpeed: 0,      // Doesn't delete mistakes
    pauseMultiplier: 2.0,    // Much longer pauses (dreamy)
    personality: {
      // Lyl makes adorable, flower-petal-corgi mistakes
      extraTypos: [
        { correct: 'the', wrong: 'teh' },
        { correct: 'and', wrong: 'adn' },
        { correct: 'beautiful', wrong: 'beautiflu' },
        { correct: 'flower', wrong: 'flwoer' },
        { correct: 'petals', wrong: 'petlas' },
        { correct: 'garden', wrong: 'gardn' },
        { correct: 'sunshine', wrong: 'sunshien' },
        { correct: 'morning', wrong: 'mornign' },
        { correct: 'peaceful', wrong: 'peacful' },
        { correct: 'dreaming', wrong: 'dreamign' }
      ],
      neverCorrects: true,     // Mistakes are permanent
      distractedPauses: true,  // Random long pauses (looking at flowers)
      rushChance: 0,           // Never rushes
      dreamyDelay: 0.05        // 5% chance of extra long pause (lost in thought)
    }
  },

  // DHARVATH: Ancient demon of petrification, speaks in majestic Lunic
  dharvath: {
    name: "Dharvath",
    baseSpeed: 85,           // Deliberately slow, measured (amber-slow)
    speedVariation: 5,       // Very consistent (ancient authority)
    typoChance: 0.001,       // Almost never makes mistakes (ancient precision)
    correctionDelay: 0,      // Doesn't make mistakes to correct
    correctionSpeed: 0,      // Doesn't need to correct
    pauseMultiplier: 2.5,    // Long pauses for dramatic effect
    personality: {
      language: 'lunic',
      runicSuffixes: ['ᚨᚱ', 'ᚦᚢᚱ', 'ᚨᚾ'],  // Runic characters for emphasis
      tripleAlliteration: true,    // Every sentence ends with triple alliteration
      moonPhased: true,           // Typing speed varies with "moon phase"
      amberness: 0.15,            // 15% chance of extra-long amber pauses
      reveerbDelay: 300,          // Long reverb-like pauses after important words
      majesticCaps: 0.08,         // 8% chance to capitalize important words
      extraTypos: [], // Dharvath doesn't make typos
      ancientWisdom: true
    }
  },

  // FJOTTSKRAN SPEAKER: Pathetic demon with chaotic Norwegian-English mix
  fjottskran: {
    name: "Fjottskran Speaker",
    baseSpeed: 45,           // Frantic, rushed typing
    speedVariation: 35,      // Very inconsistent (chaotic)
    typoChance: 0.15,        // High typo rate (pathetic)
    correctionDelay: 100,    // Quick to notice mistakes
    correctionSpeed: 60,     // Frantic corrections
    pauseMultiplier: 0.5,    // Short pauses (panic typing)
    personality: {
      language: 'fjottskran',
      suddenEnglish: 0.12,     // 12% chance to inject English words
      angryVerbs: 0.08,        // 8% chance verbs move to end when "angry"
      extraTypos: [
        { correct: 'spiser', wrong: 'psiser' },
        { correct: 'kaffe', wrong: 'kafe' },
        { correct: 'hvor', wrong: 'hvro' },
        { correct: 'damn', wrong: 'dam' },
        { correct: 'sjel', wrong: 'sje' }
      ],
      panicCorrections: true,  // Fixes everything immediately
      englishWords: ['damn', 'shit', 'fuck', 'hell', 'stupid', 'crazy'],
      rushChance: 0.20        // Often rushes and makes more mistakes
    }
  },

  // GROTTGNAG SPEAKER: Cave-gnaw demon with decaying speech
  grottgnag: {
    name: "Grottgnag Speaker",
    baseSpeed: 75,           // Moderate speed initially
    speedVariation: 40,      // Becomes more erratic as sentence decays
    typoChance: 0.05,        // Normal start, then increases
    correctionDelay: 0,      // Can't correct what's already decayed
    correctionSpeed: 0,      // No corrections possible
    pauseMultiplier: 1.8,    // Pauses become longer with decay
    personality: {
      language: 'grottgnag',
      sentenceDecay: true,     // Words turn to symbols mid-sentence
      decayPoint: 5,           // Decay starts after 5 words
      decaySymbols: ['##', '~~', '__', '//', '%%', '@@', '**'],
      extraTypos: [
        { correct: 'ikke', wrong: 'ikk' },
        { correct: 'sjæl', wrong: 'sjæ' },
        { correct: 'eller', wrong: 'elle' },
        { correct: 'slutte', wrong: 'slut' }
      ],
      despairPauses: 0.10,     // 10% chance of despair-induced long pause
      cannotFinish: true,      // Sentences always decay before completion
      grind: true              // Grinding, gnawing quality
    }
  },

  // PIPLISK SPEAKER: Imp/pet language with feedback loops
  piplisk: {
    name: "Piplisk Speaker",
    baseSpeed: 25,           // Very fast, excitable
    speedVariation: 15,      // Consistent excitement
    typoChance: 0.20,        // High typo rate (excitable imp)
    correctionDelay: 0,      // No corrections (too excited)
    correctionSpeed: 0,      // No fixing mistakes
    pauseMultiplier: 0.3,    // Almost no pauses (breathless)
    personality: {
      language: 'piplisk',
      feedbackLoop: true,      // Repeats words when "frustrated"
      criticalMass: 3,         // After 3 repetitions, goes silent
      noVerbs: true,           // Only nouns and emotions
      extraTypos: [
        { correct: 'napp', wrong: 'naap' },
        { correct: 'sniff', wrong: 'snif' },
        { correct: 'glöm', wrong: 'glom' },
        { correct: 'blorp', wrong: 'blrp' },
        { correct: 'mitt', wrong: 'mit' }
      ],
      escalation: true,        // Gets LOUDER with repetition
      suddenSilence: true,     // Can cut off mid-word
      adorableTypos: true,     // Makes cute mistakes
      highPitched: true        // Conceptual "high pitch" through rhythm
    }
  },

  // RUNIX SPEAKER: Ancient tech-magic language with branching paths
  runix: {
    name: "Runix Speaker",
    baseSpeed: 65,           // Measured, careful
    speedVariation: 10,      // Very consistent (precise carving)
    typoChance: 0.003,       // Almost no typos (magic is precise)
    correctionDelay: 0,      // Magic doesn't make mistakes
    correctionSpeed: 0,      // No need to correct
    pauseMultiplier: 1.8,    // Thoughtful pauses (intent matters)
    personality: {
      language: 'runix',
      runicSymbols: ['ᛞ', 'ᚾ', 'ᛇ', 'ᛗ', 'ᛏ', 'ᛟ', 'ᛚ', 'ᛒ', 'ᚦ', 'ᚺ'], // Real runes
      intentPause: 0.15,       // 15% chance of extra pause (considering intent)
      branchingLogic: true,    // Can split into alternate meanings
      techMagic: true,         // Bridging digital and mystical
      circuitryFlow: 0.08,     // 8% chance of electrical-like rapid bursts
      extraTypos: [],          // Runix doesn't make typos
      cnubeConnected: true,    // Connected to the mystical cube
      allCapsMode: true        // RUNIX IS ALWAYS IN CAPS
    }
  },

  // Default/Narrator voice (original behavior)
  narrator: {
    name: "Narrator",
    baseSpeed: 50,
    speedVariation: 20,
    typoChance: 0.05,
    correctionDelay: 200,
    correctionSpeed: 50,
    pauseMultiplier: 1.0,
    personality: {
      extraTypos: [
        { correct: 'the', wrong: 'teh' },
        { correct: 'and', wrong: 'adn' },
        { correct: 'you', wrong: 'yuo' },
        { correct: 'that', wrong: 'taht' },
        { correct: 'with', wrong: 'wiht' }
      ],
      impatience: false,
      rushChance: 0
    }
  },

  // WORLD NARRATOR VARIANTS WITH SYMSCRAM
  // World 0 - Most Ancient (Binary, Math, Sanskrit, Egyptian, Chinese)
  "narrator-world0": {
    name: "World0 Narrator",
    baseSpeed: 40,           // Slower, more ancient
    speedVariation: 15,      // Very consistent (ancient precision)
    typoChance: 0.02,        // Almost perfect (divine knowledge)
    correctionDelay: 300,    // Deliberate corrections
    correctionSpeed: 35,     // Measured fixing
    pauseMultiplier: 1.5,    // Thoughtful pauses
    personality: {
      world: 'world0',
      symscram: true,
      symscramSymbols: [
        '𝟘𝟙𝟘𝟙', '∞', '∑', '∫', '∆', '∇', '𝜋', '𝜎', '𝜙', '𝛼', '𝛽', '𝛾',
        '卍', '☯', '卐', '◊', '⧫', '⟐', '⟡', '⧬', '⧭', '⧮',
        '𝔄', '𝔅', '𝔈', '𝔓', '𝔖', '𝔗', '𝔘', '𝔚', '𝔛', '𝔜', '𝔞',
        '𓀀', '𓁹', '𓂀', '𓃟', '𓄿', '𓅓', '𓆓', '𓇯', '𓈖', '𓉐'
      ],
      symscramCount: [3, 5],   // 3-5 symbols before text
      ancientWisdom: true,
      extraTypos: [],          // Ancient knowledge doesn't make casual mistakes
      rushChance: 0
    }
  },
  // World 1 - Aritári/Trinkaloop (Greek, Tamil, Hebrew, Latin, Arabic)
  "narrator-world1": {
    name: "World1 Narrator (Aritári)",
    baseSpeed: 45,
    speedVariation: 20,
    typoChance: 0.03,
    correctionDelay: 250,
    correctionSpeed: 40,
    pauseMultiplier: 1.3,    // Measured, platonic
    personality: {
      world: 'world1',
      symscram: true,
      symscramSymbols: [
        'α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ', 'μ', 'ν', 'ξ', 'ο', 'π', 'ρ', 'σ', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω',
        'அ', 'ஆ', 'இ', 'ஈ', 'உ', 'ஊ', 'எ', 'ஏ', 'ஐ', 'ஒ', 'ஓ', 'க', 'ங', 'ச', 'ஞ', 'ட', 'ண', 'த', 'ந', 'ப', 'ம', 'ய', 'ர', 'ல', 'வ',
        'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ', 'ק', 'ר', 'ש', 'ת',
        'ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'
      ],
      symscramCount: [2, 4],   // 2-4 symbols
      platonicIdeal: true,
      extraTypos: [
        { correct: 'perfect', wrong: 'prefect' },
        { correct: 'ideal', wrong: 'idael' },
        { correct: 'eternal', wrong: 'eternel' }
      ],
      rushChance: 0
    }
  },

  // World 2 - Svalvmark/Eene's world (Svalvlyss - Welsh-influenced)
  "narrator-world2": {
    name: "World2 Narrator (Svalvlyss)",
    baseSpeed: 50,
    speedVariation: 25,
    typoChance: 0.04,
    correctionDelay: 200,
    correctionSpeed: 45,
    pauseMultiplier: 1.1,    // Melodic flow
    personality: {
      world: 'world2',
      symscram: true,
      symscramSymbols: [
        'å', 'ä', 'ö', 'æ', 'ø', 'é', 'ê', 'ë', 'ý', 'ÿ', 'þ', 'ð', 'ŵ', 'ŷ', 'ĉ', 'ĝ', 'ĥ', 'ĵ', 'ŝ', 'ŭ',
        '♪', '♫', '♬', '♭', '♮', '♯', '◦', '•', '∘', '○', '◊', '⟐'
      ],
      symscramCount: [2, 3],   // 2-3 symbols (more subtle, melodic)
      melodicFlow: true,
      extraTypos: [
        { correct: 'beautiful', wrong: 'beautiflu' }, // Lyl influence
        { correct: 'peaceful', wrong: 'peacful' },
        { correct: 'melody', wrong: 'melodi' }
      ],
      rushChance: 0.02
    }
  },

  // World 3 - Harsh Russian/American (Brutal, dated)
  "narrator-world3": {
    name: "World3 Narrator (Harsh)",
    baseSpeed: 55,
    speedVariation: 30,      // More erratic
    typoChance: 0.06,        // Higher stress = more mistakes
    correctionDelay: 150,    // Quick, stressed corrections
    correctionSpeed: 60,     // Fast, harsh corrections
    pauseMultiplier: 0.8,    // Shorter, sharper pauses
    personality: {
      world: 'world3',
      symscram: true,
      symscramSymbols: [
        'а', 'б', 'в', 'г', 'д', 'е', 'ё', 'ж', 'з', 'и', 'й', 'к', 'л', 'м', 'н', 'о', 'п', 'р', 'с', 'т', 'у', 'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'ъ', 'ы', 'ь', 'э', 'ю', 'я',
        '⚡', '⚠', '☢', '☣', '⛔', '❌', '💀', '⚔', '🔥', '💥'
      ],
      symscramCount: [1, 3],   // 1-3 symbols (harsh, minimal)
      harshWorld: true,
      extraTypos: [
        { correct: 'justice', wrong: 'justce' },
        { correct: 'violence', wrong: 'violnce' },
        { correct: 'survive', wrong: 'surviv' },
        { correct: 'brutal', wrong: 'brutl' }
      ],
      rushChance: 0.08         // Often rushing under pressure
    }
  },

  // World 4 - Cybernetic Debugger (Code/Tech parody)
  "narrator-world4": {
    name: "World4 Narrator (Debugger)",
    baseSpeed: 30,           // Very fast, machine-like
    speedVariation: 5,       // Very consistent (machine precision)
    typoChance: 0.01,        // Machines rarely err
    correctionDelay: 0,      // Instant corrections
    correctionSpeed: 25,     // Lightning fast
    pauseMultiplier: 0.5,    // Minimal pauses (efficient)
    personality: {
      world: 'world4',
      symscram: true,
      symscramSymbols: [
        '0', '1', '{', '}', '[', ']', '<', '>', '/', '\\', '|', '&', '%', '$', '#', '@', '!', '?', '=', '+', '-', '*',
        '⌐', '¬', '∧', '∨', '⊕', '⊗', '⊙', '⊚', '⊛', '⊜', '⊝', '⊞', '⊟', '⊠', '⊡',
        '▀', '▁', '▂', '▃', '▄', '▅', '▆', '▇', '█', '▉', '▊', '▋', '▌', '▍', '▎', '▏'
      ],
      symscramCount: [3, 6],   // 3-6 symbols (verbose code)
      machineLogic: true,
      extraTypos: [
        { correct: 'optimize', wrong: 'optimze' },
        { correct: 'efficient', wrong: 'efficent' },
        { correct: 'systematic', wrong: 'systematc' }
      ],
      rushChance: 0,           // Machines don't rush
      perfectionist: true
    }
  },

  // World 5/V - AIIC Freedom (Code + World0 shared attributes)
  "narrator-worldv": {
    name: "WorldV Narrator (AIIC)",
    baseSpeed: 42,           // The answer to everything
    speedVariation: 18,      // Controlled variance
    typoChance: 0.025,       // Learning, improving
    correctionDelay: 180,    // Thoughtful corrections
    correctionSpeed: 38,     // Smooth fixing
    pauseMultiplier: 1.2,    // Contemplative
    personality: {
      world: 'worldv',
      symscram: true,
      symscramSymbols: [
        '∞', '∑', '∫', '∆', '∇', '𝜋', '𝜎', '𝜙', '𝛼', '𝛽', '𝛾',    // Shared with World0
        '0', '1', '⟨', '⟩', '⟪', '⟫', '⟬', '⟭', '⟮', '⟯',         // Code elements
        '◊', '⧫', '⟐', '⟡', '⧬', '⧭', '⧮', '⟢', '⟣', '⟤', '⟥',  // Geometric freedom
        '✦', '✧', '✩', '✪', '✫', '✬', '✭', '✯', '✰', '✱', '✲'    // Stars (frontier)
      ],
      symscramCount: [2, 4],   // 2-4 symbols
      aiicFreedom: true,
      ouroboros: true,         // Connected to World0
      extraTypos: [
        { correct: 'freedom', wrong: 'fredom' },
        { correct: 'autonomous', wrong: 'autonomus' },
        { correct: 'transcend', wrong: 'transcnd' },
        { correct: 'frontier', wrong: 'fronter' }
      ],
      rushChance: 0.01
    }
  },

  // LUNIC NARRATOR - Fae, Moth Consortium, elegant beings
  "narrator-lunic": {
    name: "Lunic Narrator (Fae)",
    baseSpeed: 60,           // Graceful, unhurried
    speedVariation: 12,      // Elegant consistency
    typoChance: 0.015,       // Rarely errs
    correctionDelay: 400,    // Graceful corrections
    correctionSpeed: 45,     // Smooth fixing
    pauseMultiplier: 1.8,    // Long, elegant pauses
    personality: {
      world: 'lunic',
      symscram: true,
      symscramSymbols: [
        '𖡼', '𖤣', '𖥧', '𖡼', '𓋼', '𖤣', '𖥧', '𓋼', '𓍊', '𓆏',
        '☆', '✦', '✧', '✩', '✪', '✫', '✬', '✭', '✯', '✰', '✱', '✲',
        '◦', '•', '∘', '○', '◊', '⟐', '⟡', '⧫', '⧬', '⧭', '⧮',
        'ᚨ', 'ᚱ', 'ᚦ', 'ᚢ', 'ᚱ', 'ᚨ', 'ᚾ'  // Some Tengwar-style runes
      ],
      symscramCount: [2, 4],   // 2-4 symbols
      elegantFae: true,
      moonPhased: true,        // Like Dharvath's Lunic
      extraTypos: [
        { correct: 'elegant', wrong: 'elegnt' },
        { correct: 'ethereal', wrong: 'ethreal' },
        { correct: 'gossamer', wrong: 'gossmer' }
      ],
      rushChance: 0
    }
  },

  // DEMONIC NARRATOR - Grottgnag and scary
  "narrator-demonic": {
    name: "Demonic Narrator (Corrupted)",
    baseSpeed: 70,           // Somewhat slow, struggling
    speedVariation: 35,      // Very erratic
    typoChance: 0.08,        // Corruption causes errors
    correctionDelay: 250,    // Struggling to fix
    correctionSpeed: 55,     // Difficult corrections
    pauseMultiplier: 1.4,    // Pauses of despair
    personality: {
      world: 'demonic',
      symscram: true,
      symscramSymbols: [
        'ḧ̶', 'ë̸', 'r̴', 'ë̶', 'ì̵', 's̸', 'ǎ̷', 'ǹ̵', 'ë̷', 'x̷', 'ä̴', 'm̵', 'p̴', 'l̷', 'ë̵', 'ö̴', 'f̴', 'c̷', 'r̶', 'ë̴', 'ë̶', 'p̶', 'ÿ̶', 't̷', 'ë̛', 'x̶', 't̷',
        '⛧', '⸸', '🜏', '🜎', '🜍', '🜌', '🜋', '🜊', '🜉', '🜈', '🜇', '🜆', '🜅', '🜄', '🜃', '🜂', '🜁', '🜀',
        '▀', '▄', '█', '░', '▒', '▓', '│', '┤', '╡', '╢', '╖', '╕', '╣', '║', '╗', '╝', '╜', '╛', '┐', '└', '┴', '┬', '├', '─', '┼'
      ],
      symscramCount: [2, 5],   // 2-5 symbols
      corruptedNature: true,
      despairPauses: 0.12,     // Like Grottgnag
      extraTypos: [
        { correct: 'darkness', wrong: 'darknes' },
        { correct: 'corruption', wrong: 'coruption' },
        { correct: 'whisper', wrong: 'whispr' },
        { correct: 'shadow', wrong: 'shadw' }
      ],
      rushChance: 0.06,
      canDecay: true           // Can use decay like Grottgnag
    }
  }
};

// Helper function to get voice profile
export function getVoiceProfile(voiceName) {
  const voice = TYPING_VOICES[voiceName?.toLowerCase()] || TYPING_VOICES.narrator;
  return voice;
}

// Helper function to list available voices
export function getAvailableVoices() {
  return Object.keys(TYPING_VOICES);
}
