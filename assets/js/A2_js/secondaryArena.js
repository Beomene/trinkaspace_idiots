import { getVoiceProfile } from './typingVoices.js';

// Function declarations for symscram that will be exported
export function generateSymscram(voiceName) {
  const voiceProfile = getVoiceProfile(voiceName);
  
  if (!voiceProfile.personality.symscram || !voiceProfile.personality.symscramSymbols) {
    return '';
  }
  
  const symbols = voiceProfile.personality.symscramSymbols;
  const countRange = voiceProfile.personality.symscramCount || [2, 4];
  const count = Math.floor(Math.random() * (countRange[1] - countRange[0] + 1)) + countRange[0];
  
  let symscram = '';
  for (let i = 0; i < count; i++) {
    symscram += symbols[Math.floor(Math.random() * symbols.length)];
  }
  
  return symscram + ' '; // Add space after symscram
}

export function typeSymscram(element, text, voiceName) {
  return new Promise((resolve) => {
    const voiceProfile = getVoiceProfile(voiceName);
    const scramText = generateSymscram(voiceName);
    
    if (!scramText) {
      element.innerHTML += text;
      resolve();
      return;
    }
    
    // Add subtle visual styling for symscram
    const scramSpan = document.createElement('span');
    scramSpan.style.opacity = '0.7';
    scramSpan.style.fontStyle = 'italic';
    scramSpan.style.color = getSymscramColorForVoice(voiceProfile);
    element.appendChild(scramSpan);
    
    let scramIndex = 0;
    const scramSpeed = Math.max(15, voiceProfile.baseSpeed * 0.7); // Faster than normal text
    
    function typeScramChar() {
      if (scramIndex < scramText.length) {
        scramSpan.textContent += scramText.charAt(scramIndex);
        scramIndex++;
        setTimeout(typeScramChar, scramSpeed);
      } else {
        // After symscram, add the main text
        const textSpan = document.createElement('span');
        textSpan.textContent = text;
        element.appendChild(textSpan);
        resolve();
      }
    }
    
    typeScramChar();
  });
}

function getSymscramColorForVoice(voiceProfile) {
  const world = voiceProfile.personality.world;
  switch (world) {
    case 'world0': return '#FFD700';    // Gold for ancient
    case 'world1': return '#E6E6FA';    // Lavender for platonic
    case 'world2': return '#87CEEB';    // Sky blue for melodic
    case 'world3': return '#CD5C5C';    // Indian red for harsh
    case 'world4': return '#00FF00';    // Green for matrix/debug
    case 'worldv': return '#40E0D0';    // Turquoise for AIIC freedom
    case 'lunic': return '#DDA0DD';     // Plum for fae elegance
    case 'demonic': return '#8B0000';   // Dark red for corruption
    default: return '#ACABBB';          // Default color
  }
}

// --- Character-specific typewriter effect with unique typing fingerprints ---
export function typeText(element, text, voiceName = 'narrator', baseSpeed = 50) {
  element.textContent = "";
  const voice = getVoiceProfile(voiceName);
  
  let i = 0;
  let typoQueue = []; // For Emraa's batch correction
  let wordsTyped = 0; // For Grottgnag decay tracking
  let repetitionCount = 0; // For Piplisk feedback loops
  let lastWord = ""; // For Piplisk repetition detection
  
  console.log(`[typeText] Using voice: ${voice.name}${voice.personality.language ? ` (${voice.personality.language})` : ''}`);
  
  // Parse special pause markers from text
  const pauseMarkers = {
    '...': 800,     // Long pause for ellipsis
    '.': 300,       // Pause at sentence end
    '!': 250,       // Pause at exclamation
    '?': 250,       // Pause at question
    ',': 150,       // Short pause at comma
    ':': 200,       // Pause at colon
    ';': 180,       // Pause at semicolon
    '\n': 100       // Pause at line break
  };

  // Combine default and character-specific typos
  const allTypos = [
    ...voice.personality.extraTypos,
    ...(voice.personality.extraTypos || [])
  ];

  // DEMONIC LANGUAGE HELPERS
  function shouldDecay() {
    return voice.personality.sentenceDecay && wordsTyped >= voice.personality.decayPoint;
  }

  function getDecaySymbol() {
    const symbols = voice.personality.decaySymbols || ['##', '~~', '__'];
    return symbols[Math.floor(Math.random() * symbols.length)];
  }

  function shouldInjectEnglish() {
    return voice.personality.suddenEnglish && Math.random() < voice.personality.suddenEnglish;
  }

  function getRandomEnglishWord() {
    const words = voice.personality.englishWords || ['damn', 'hell', 'crazy'];
    return words[Math.floor(Math.random() * words.length)];
  }

  function shouldAddRunicSymbol() {
    return voice.personality.runicSymbols && Math.random() < 0.05; // 5% chance
  }

  function getRandomRunicSymbol() {
    const runes = voice.personality.runicSymbols || ['ᛞ', 'ᚾ', 'ᛇ'];
    return runes[Math.floor(Math.random() * runes.length)];
  }

  function shouldHaveAmberPause() {
    return voice.personality.amberness && Math.random() < voice.personality.amberness;
  }

  function shouldCapitalizeMajestically() {
    return voice.personality.majesticCaps && Math.random() < voice.personality.majesticCaps;
  }

  function detectWordRepetition(currentWord) {
    if (voice.personality.feedbackLoop && currentWord === lastWord) {
      repetitionCount++;
      return repetitionCount >= voice.personality.criticalMass;
    } else {
      repetitionCount = 0;
      lastWord = currentWord;
      return false;
    }
  }  // Using exported symscram functions from the top of the file

  function getTypingSpeed() {
    const variation = Math.random() * voice.speedVariation * 2 - voice.speedVariation;
    return Math.max(20, voice.baseSpeed + variation);
  }

  function shouldMakeTypo() {
    return Math.random() < voice.typoChance;
  }

  function shouldGetDistracted() {
    return voice.personality.dreamyDelay && Math.random() < voice.personality.dreamyDelay;
  }

  function findTypoMatch(upcomingText) {
    for (const typo of allTypos) {
      if (upcomingText.toLowerCase().startsWith(typo.correct.toLowerCase())) {
        return typo;
      }
    }
    return null;
  }

  function type() {
    // GROTTGNAG: Check if sentence should decay
    if (shouldDecay()) {
      console.log(`[${voice.name}] Sentence decaying after ${wordsTyped} words`);
      const decaySymbol = getDecaySymbol();
      element.textContent += decaySymbol;
      if (Math.random() < 0.7) { // 70% chance to add more decay
        setTimeout(() => {
          element.textContent += getDecaySymbol();
          if (Math.random() < 0.5) {
            setTimeout(() => element.textContent += getDecaySymbol(), 200);
          }
        }, 300);
      }
      return; // Stop typing - sentence has decayed
    }

    if (i < text.length) {
      let currentChar = text.charAt(i);
      const upcomingText = text.slice(i, i + 15);
      
      // RUNIX: Convert to uppercase if enabled
      if (voice.personality.allCapsMode) {
        currentChar = currentChar.toUpperCase();
      }
      
      // DHARVATH: Majestic capitalization
      if (shouldCapitalizeMajestically() && currentChar.match(/[a-z]/)) {
        currentChar = currentChar.toUpperCase();
        console.log(`[${voice.name}] Majestic capitalization`);
      }
      
      // Track word boundaries for decay counting
      if (currentChar === ' ' && i > 0) {
        wordsTyped++;
        
        // PIPLISK: Check for repetition and feedback loop
        if (voice.personality.feedbackLoop) {
          const words = element.textContent.split(' ');
          const currentWord = words[words.length - 1];
          if (detectWordRepetition(currentWord)) {
            console.log(`[${voice.name}] Critical feedback mass reached - sudden silence`);
            return; // Sudden silence
          }
        }
      }
      
      // FJOTTSKRAN: Inject sudden English
      if (currentChar === ' ' && shouldInjectEnglish()) {
        const englishWord = getRandomEnglishWord();
        console.log(`[${voice.name}] Injecting English: ${englishWord}`);
        element.textContent += ` *${englishWord}*`;
        setTimeout(type, getTypingSpeed());
        return;
      }
      
      // Check for typo opportunity
      const typoMatch = findTypoMatch(upcomingText);
      
      if (typoMatch && shouldMakeTypo()) {
        console.log(`[${voice.name}] Making typo: ${typoMatch.correct} → ${typoMatch.wrong}`);
        
        // Different correction behaviors per character
        if (voice.personality.neverCorrects) {
          // Lyl: Just type the wrong word and continue
          typeWrongWord(typoMatch.wrong, typoMatch.correct.length);
          return;
        } else if (voice.personality.batchCorrection) {
          // Emraa: Note the typo but don't fix it yet
          const typoStart = element.textContent.length;
          typeWrongWord(typoMatch.wrong, typoMatch.correct.length, () => {
            typoQueue.push({
              start: typoStart,
              wrong: typoMatch.wrong,
              correct: typoMatch.correct
            });
          });
          return;
        } else {
          // Eene & Narrator: Fix immediately
          typeWrongWordWithCorrection(typoMatch.wrong, typoMatch.correct);
          return;
        }
      }
      
      // Normal typing
      element.textContent += currentChar;
      i++;
      
      // RUNIX: Add occasional runic symbols
      if (shouldAddRunicSymbol()) {
        const rune = getRandomRunicSymbol();
        element.textContent += rune;
        console.log(`[${voice.name}] Added runic symbol: ${rune}`);
      }
      
      // Handle pauses
      let pauseTime = 0;
      
      // DHARVATH: Amber pauses (extra long, amber-like delays)
      if (shouldHaveAmberPause()) {
        pauseTime += Math.random() * 1500 + 1000; // 1-2.5 second amber pause
        console.log(`[${voice.name}] Amber pause: ${pauseTime}ms`);
      }
      
      // Check for ellipsis first
      if (text.slice(i-3, i) === '...') {
        pauseTime += pauseMarkers['...'] * voice.pauseMultiplier;
      } else if (pauseMarkers[currentChar]) {
        pauseTime += pauseMarkers[currentChar] * voice.pauseMultiplier;
      }
      
      // DHARVATH: Reverb delay after important words
      if (voice.personality.reveerbDelay && (currentChar === '.' || currentChar === '!' || currentChar === '?')) {
        pauseTime += voice.personality.reveerbDelay;
        console.log(`[${voice.name}] Reverb delay: ${voice.personality.reveerbDelay}ms`);
      }
      
      // Lyl gets distracted and pauses randomly
      if (shouldGetDistracted()) {
        pauseTime += Math.random() * 1000 + 500; // 500-1500ms extra pause
        console.log(`[${voice.name}] Got distracted, pausing for ${pauseTime}ms`);
      }
      
      // GROTTGNAG: Despair pauses
      if (voice.personality.despairPauses && Math.random() < voice.personality.despairPauses) {
        pauseTime += Math.random() * 800 + 400; // 400-1200ms despair pause
        console.log(`[${voice.name}] Despair pause: ${pauseTime}ms`);
      }
      
      // RUNIX: Intent pauses (considering magical intent)
      if (voice.personality.intentPause && Math.random() < voice.personality.intentPause) {
        pauseTime += Math.random() * 600 + 300; // 300-900ms intent pause
        console.log(`[${voice.name}] Intent pause: ${pauseTime}ms`);
      }
      
      // RUNIX: Circuitry flow (rapid electrical bursts)
      if (voice.personality.circuitryFlow && Math.random() < voice.personality.circuitryFlow) {
        pauseTime = Math.max(10, pauseTime - 200); // Much faster typing
        console.log(`[${voice.name}] Circuitry flow - rapid burst`);
      }
      
      setTimeout(type, getTypingSpeed() + pauseTime);
    } else {
      // Finished typing - handle batch corrections for Emraa
      if (voice.personality.batchCorrection && typoQueue.length > 0) {
        console.log(`[${voice.name}] Fixing ${typoQueue.length} typos in batch`);
        setTimeout(() => fixTyposInBatch(), 500);
      }
    }
  }

  function typeWrongWord(wrongWord, correctLength, callback = null) {
    let wrongIndex = 0;
    function typeWrong() {
      if (wrongIndex < wrongWord.length) {
        element.textContent += wrongWord.charAt(wrongIndex);
        wrongIndex++;
        setTimeout(typeWrong, getTypingSpeed());
      } else {
        i += correctLength;
        if (callback) callback();
        setTimeout(type, getTypingSpeed());
      }
    }
    typeWrong();
  }

  function typeWrongWordWithCorrection(wrongWord, correctWord) {
    let wrongIndex = 0;
    function typeWrong() {
      if (wrongIndex < wrongWord.length) {
        element.textContent += wrongWord.charAt(wrongIndex);
        wrongIndex++;
        setTimeout(typeWrong, getTypingSpeed());
      } else {
        // Pause, then delete and correct
        setTimeout(() => {
          deleteAndCorrect(wrongWord.length, correctWord);
        }, voice.correctionDelay);
      }
    }
    typeWrong();
  }

  function deleteAndCorrect(deleteCount, correctWord) {
    let deleteIndex = 0;
    function deleteChar() {
      if (deleteIndex < deleteCount) {
        element.textContent = element.textContent.slice(0, -1);
        deleteIndex++;
        setTimeout(deleteChar, voice.correctionSpeed);
      } else {
        // Type the correct word
        let correctIndex = 0;
        function typeCorrect() {
          if (correctIndex < correctWord.length) {
            element.textContent += correctWord.charAt(correctIndex);
            correctIndex++;
            setTimeout(typeCorrect, getTypingSpeed());
          } else {
            i += correctWord.length;
            setTimeout(type, getTypingSpeed());
          }
        }
        setTimeout(typeCorrect, 100);
      }
    }
    deleteChar();
  }

  function fixTyposInBatch() {
    if (typoQueue.length === 0) return;
    
    const typo = typoQueue.shift();
    const currentText = element.textContent;
    
    // Find and fix this typo
    const beforeTypo = currentText.substring(0, typo.start);
    const afterTypo = currentText.substring(typo.start + typo.wrong.length);
    
    console.log(`[${voice.name}] Fixing: ${typo.wrong} → ${typo.correct}`);
    
    // Replace the typo
    element.textContent = beforeTypo + typo.correct + afterTypo;
    
    // Update positions of remaining typos
    const lengthDiff = typo.correct.length - typo.wrong.length;
    typoQueue.forEach(remainingTypo => {
      if (remainingTypo.start > typo.start) {
        remainingTypo.start += lengthDiff;
      }
    });
    
    // Continue with next typo
    if (typoQueue.length > 0) {
      setTimeout(fixTyposInBatch, 200);
    }
  }
  // Start typing after initial pause
  // If this voice uses symscram, type it first, then the main text
  if (voice.personality && voice.personality.symscram) {
    // Use the exported symscram generator
    const scramText = generateSymscram(voiceName);
    console.log(`[typeText] Generating symscram for ${voiceName}: "${scramText}"`);
    
    setTimeout(() => {
      if (!scramText) {
        // No symscram, start typing normally
        console.log(`[typeText] No symscram generated, starting normal typing`);
        setTimeout(type, 100);
        return;
      }
      
      let scramIndex = 0;
      const scramSpeed = Math.max(15, voice.baseSpeed * 0.7); // Faster than normal text
      
      // Add subtle visual styling for symscram
      const scramSpan = document.createElement('span');
      scramSpan.className = 'symscram';
      scramSpan.style.opacity = '0.7';
      scramSpan.style.fontStyle = 'italic';
      scramSpan.style.color = getSymscramColorForVoice(voice);
      element.appendChild(scramSpan);
      
      console.log(`[typeText] Starting to type symscram: "${scramText}"`);
      
      function typeScramChar() {
        if (scramIndex < scramText.length) {
          scramSpan.textContent += scramText.charAt(scramIndex);
          scramIndex++;
          setTimeout(typeScramChar, scramSpeed);
        } else {
          console.log(`[typeText] Symscram complete, continuing with main text`);
          // Brief pause after symscram, then continue with main text
          setTimeout(type, 100);
        }
      }
      
      typeScramChar();
    }, 300);
  } else {
    // No symscram, start typing normally
    console.log(`[typeText] Voice has no symscram, starting normal typing`);
    setTimeout(type, 300);
  }
}

// --- Create a Trinka Textbox with options ---
export function createTrinkaTextbox({
  text = "",
  speaker = "",
  voice = "narrator",      // New: typing voice personality
  align = "left",          // Default to left alignment
  boxColor = "rgba(0, 0, 0, 0.7)",  // Pure black at 0.7 opacity
  textColor = "#ACABBB",
  opacity = 1.0,           // Box itself should be 1.0, transparency is in boxColor
  font = "Noto Sans",
  skipTypewriter = false
} = {}) {
  const box = document.createElement("div");
  box.className = `trinka-textbox ${align}`;
  box.style.background = boxColor;
  box.style.opacity = opacity;
  box.style.color = textColor;
  box.style.fontFamily = font;

  if (speaker) {
    const speakerSpan = document.createElement("span");
    speakerSpan.className = "speaker";
    speakerSpan.textContent = speaker;
    box.appendChild(speakerSpan);
  }

  const textSpan = document.createElement("span");
  textSpan.className = "trinka-text-content";
  box.appendChild(textSpan);

  // Store voice for later use
  box._voice = voice;

  // Only run typewriter if not skipped
  if (!skipTypewriter) {
    typeText(textSpan, text, voice); // Pass voice to typeText
  }

  return box;
}

// --- Scribe Box (write-and-send-to-nowhere) ---
export function createScribeBox({ placeholder = "Write your thoughts...", buttonText = "Send to Svalvmark" } = {}) {
  const wrapper = document.createElement("div");
  wrapper.className = "scribe-box";

  const textarea = document.createElement("textarea");
  textarea.placeholder = placeholder;
  textarea.rows = 3;

  const button = document.createElement("button");
  button.textContent = buttonText;

  button.onclick = () => {
    textarea.value = ""; // Clear the box
    button.textContent = "Sent!"; // Feedback
    setTimeout(() => { button.textContent = buttonText; }, 1500);
  };

  wrapper.appendChild(textarea);
  wrapper.appendChild(button);
  return wrapper;
}

// --- Sound Box (audio player with click) ---
export function createSoundBox({ src, label = "Play Sound", icon = "🔊" } = {}) {
  const wrapper = document.createElement("div");
  wrapper.className = "sound-box";

  const button = document.createElement("button");
  button.className = "sound-btn";
  button.innerHTML = `${icon} ${label}`;

  const audio = document.createElement("audio");
  audio.src = src;

  button.onclick = () => {
    audio.currentTime = 0;
    audio.play();
  };

  wrapper.appendChild(button);
  wrapper.appendChild(audio);
  return wrapper;
}

// --- Clickable word popup logic ---
export function setupClickableWords() {
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('trinka-clickable')) {
      const infoKey = e.target.getAttribute('data-info');
      showTrinkaPopup(infoKey);
    }
  });
}

function showTrinkaPopup(key) {
  // Replace this with your custom popup/modal logic
  alert('Show info for: ' + key);
}

// --- Create a Trinka Textbox from Markdown file (with sanitization) ---
export async function createTextboxFromMarkdown(mdPath, options = {}) {
  // Handle arena type for path construction
  const arenaType = options.arenaType || 'A2';
  
  // Fetch content using the appropriate path
  const response = await fetch(mdPath);
  const mdText = await response.text();

  // Use marked to convert markdown to HTML, then sanitize with DOMPurify
  const rawHtml = window.marked ? window.marked.parse(mdText) : mdText;
  const safeHtml = window.DOMPurify ? window.DOMPurify.sanitize(rawHtml) : rawHtml;
  // Create the box
  const box = document.createElement("div");
  box.className = `trinka-textbox ${options.align || "left"}`;
  box.style.background = options.boxColor || "#242424";
  box.style.opacity = options.opacity || 0.7;
  box.style.color = options.textColor || "#ACABBB";
  box.style.fontFamily = options.font || "Noto Sans";
  
  // Store arena type for reference
  box.dataset.arenaType = options.arenaType || 'A2';

  if (options.speaker) {
    const speakerSpan = document.createElement("span");
    speakerSpan.className = "speaker";
    speakerSpan.textContent = options.speaker;
    box.appendChild(speakerSpan);
  }

  const textSpan = document.createElement("span");
  textSpan.className = "trinka-text-content";
  box.appendChild(textSpan);

  // Typewriter effect will be triggered later if skipTypewriter is true
  if (!options.skipTypewriter) {
    typeText(textSpan, mdText, 30);
  }

  // If skipTypewriter, just set the HTML for now (will type later)
  if (options.skipTypewriter) {
    textSpan.innerHTML = ""; // Empty, will fill on intersection
    box._fullText = mdText;  // Store for later
    box._safeHtml = safeHtml;
  } else {
    textSpan.innerHTML = safeHtml;
  }

  return box;
}

// --- Place a Trinka Textbox using a scope.json file, with typewriter on viewport ---
export async function placeTextBoxFromScope(folder) {
  try {
    // Load scope.json
    const scope = await fetch(`${folder}/scope.json`).then(r => r.json());
    // Markdown file path construction
    const mdPath = `${folder}/${folder.split('/').pop()}.md`;
    
    console.log(`[placeTextBoxFromScope] Loading scope from: ${folder}/scope.json`);
    console.log(`[placeTextBoxFromScope] Loading markdown from: ${mdPath}`);
    console.log(`[placeTextBoxFromScope] Looking for anchor: diorama-${scope.anchorTo}`);

    // Find anchor diorama - wait for it to be loaded
    const waitForAnchor = () => {
      return new Promise((resolve) => {
        const checkAnchor = () => {
          const anchor = document.getElementById(`diorama-${scope.anchorTo}`);
          if (anchor) {
            console.log(`[placeTextBoxFromScope] Found anchor:`, anchor);
            resolve(anchor);
          } else {
            console.log(`[placeTextBoxFromScope] Anchor not found yet, retrying...`);
            setTimeout(checkAnchor, 100);
          }
        };
        checkAnchor();
      });
    };

    const anchor = await waitForAnchor();
    const rect = anchor.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;
    const anchorBottom = rect.bottom + scrollY;
    const offsetY = scope.offsetY && scope.offsetY.endsWith('vh')
      ? window.innerHeight * (parseFloat(scope.offsetY) / 100)
      : parseFloat(scope.offsetY) || 0;

    console.log(`[placeTextBoxFromScope] Positioning: anchorBottom=${anchorBottom}, offsetY=${offsetY}`);

    // Create box with typewriter skipped for now
    const box = await createTextboxFromMarkdown(mdPath, { 
      ...scope, 
      skipTypewriter: true,
      speaker: scope.speaker || "Narrator",
      voice: scope.voice || "narrator"  // Support voice in scope.json
    });

    box.style.position = "absolute";
    box.style.left = "50%";
    box.style.transform = "translateX(-50%)";
    box.style.top = `${anchorBottom + offsetY}px`;
    box.style.opacity = scope.opacity ?? 0.7;
    box.style.zIndex = "1000"; // Ensure it's above dioramas

    document.body.appendChild(box);
    console.log(`[placeTextBoxFromScope] Text box placed at top: ${anchorBottom + offsetY}px`);

    // Set up IntersectionObserver for typewriter effect
    const textSpan = box.querySelector('.trinka-text-content');
    let typewriterStarted = false;
    const observer = new window.IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !typewriterStarted) {
            typewriterStarted = true;
            console.log(`[placeTextBoxFromScope] Starting typewriter effect with voice: ${box._voice || scope.voice || 'narrator'}`);
            typeText(textSpan, box._fullText, box._voice || scope.voice || 'narrator'); // Use voice from box or scope
            observer.unobserve(box);
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(box);

  } catch (error) {
    console.error(`[placeTextBoxFromScope] Error:`, error);
  }
}

// --- Easy Text-box API for quick setup ---
export function addTextBox(options = {}) {
  const {
    id,              // Required: unique ID for the text-box
    text = "",       // Text content (can be markdown)
    speaker = "",    // Speaker name
    voice = "narrator", // Typing voice personality
    anchorTo,        // Required: ID of diorama to anchor to
    offsetY = "5vh", // Offset from anchor
    align = "left",  // Default to left alignment
    boxColor = "rgba(0, 0, 0, 0.7)", // Pure black at 0.7 opacity
    textColor = "#ACABBB",
    opacity = 1.0,   // Box opacity (transparency is in boxColor)
    font = "Noto Sans",
    skipTypewriter = false,
    zIndex = 1000
  } = options;

  if (!id || !anchorTo) {
    console.error('[addTextBox] id and anchorTo are required');
    return;
  }

  // Wait for anchor to be available
  setTimeout(async () => {
    try {
      const anchor = document.getElementById(`diorama-${anchorTo}`);
      if (!anchor) {
        console.error(`[addTextBox] Anchor diorama not found: diorama-${anchorTo}`);
        return;
      }

      const rect = anchor.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset;
      const anchorBottom = rect.bottom + scrollY;
      const calculatedOffsetY = offsetY && offsetY.endsWith('vh')
        ? window.innerHeight * (parseFloat(offsetY) / 100)
        : parseFloat(offsetY) || 0;

      // Create text-box
      const box = createTrinkaTextbox({
        text,
        speaker,
        voice,           // Pass voice to createTrinkaTextbox
        align,
        boxColor,
        textColor,
        opacity,
        font,
        skipTypewriter: true // We'll handle typewriter with intersection observer
      });

      // Position the box
      box.id = `textbox-${id}`;
      box.style.position = "absolute";
      box.style.left = "50%";
      box.style.transform = "translateX(-50%)";
      box.style.top = `${anchorBottom + calculatedOffsetY}px`;
      box.style.zIndex = zIndex;

      document.body.appendChild(box);

      // Set up typewriter effect on viewport intersection
      if (!skipTypewriter) {
        const textSpan = box.querySelector('.trinka-text-content');
        let typewriterStarted = false;
        const observer = new window.IntersectionObserver(
          entries => {
            entries.forEach(entry => {
              if (entry.isIntersecting && !typewriterStarted) {
                typewriterStarted = true;
                typeText(textSpan, text, voice); // Pass voice to typeText
                observer.unobserve(box);
              }
            });
          },
          { threshold: 0.1 }
        );
        observer.observe(box);
      }

      console.log(`[addTextBox] Created text-box "${id}" anchored to "${anchorTo}"`);

    } catch (error) {
      console.error(`[addTextBox] Error creating text-box "${id}":`, error);
    }
  }, 500); // Wait for dioramas to load
}

// --- Load text from markdown file for easy text-box creation ---
export async function addTextBoxFromMarkdown(options = {}) {
  const {
    id,              // Required: unique ID for the text-box
    markdownPath,    // Required: path to markdown file
    speaker = "",    // Speaker name
    voice = "narrator", // Typing voice personality
    anchorTo,        // Required: ID of diorama to anchor to
    offsetY = "5vh", // Offset from anchor
    align = "left",  // Default to left alignment
    boxColor = "rgba(0, 0, 0, 0.7)", // Pure black at 0.7 opacity
    textColor = "#ACABBB",
    opacity = 1.0,   // Box opacity (transparency is in boxColor)
    font = "Noto Sans",
    skipTypewriter = false,
    zIndex = 1000
  } = options;

  if (!id || !anchorTo || !markdownPath) {
    console.error('[addTextBoxFromMarkdown] id, anchorTo, and markdownPath are required');
    return;
  }

  try {
    // Load markdown content
    const response = await fetch(markdownPath);
    const mdText = await response.text();
    
    // Use the regular addTextBox function with the loaded text
    addTextBox({
      id,
      text: mdText,
      speaker,
      voice,           // Pass voice parameter
      anchorTo,
      offsetY,
      align,
      boxColor,
      textColor,
      opacity,
      font,
      skipTypewriter,
      zIndex
    });

  } catch (error) {
    console.error(`[addTextBoxFromMarkdown] Error loading markdown from "${markdownPath}":`, error);
  }
}

// --- Independent Arena 2A positioning (no diorama dependency) ---
export function addIndependentTextBox(options = {}) {
  const {
    id,              // Required: unique ID for the text-box
    text = "",       // Text content (can be markdown)
    speaker = "",    // Speaker name
    voice = "narrator", // Typing voice personality
    top = "20vh",    // Position from top of viewport (vh, px, %)
    left = "50%",    // Position from left (%, px, vw)
    align = "left",  // Text alignment
    boxColor = "rgba(0, 0, 0, 0.7)", // Pure black at 0.7 opacity
    textColor = "#ACABBB",
    opacity = 1.0,   // Box opacity
    font = "Noto Sans",
    skipTypewriter = false,
    zIndex = 1000,
    maxWidth = "600px"
  } = options;

  if (!id) {
    console.error('[addIndependentTextBox] id is required');
    return;
  }

  try {
    // Create text-box immediately (no waiting for anchors)
    const box = createTrinkaTextbox({
      text,
      speaker,
      voice,
      align,
      boxColor,
      textColor,
      opacity,
      font,
      skipTypewriter: true // We'll handle typewriter with intersection observer
    });

    // Independent positioning
    box.id = `textbox-${id}`;
    box.style.position = "absolute";
    box.style.left = left;
    box.style.top = top;
    box.style.transform = left === "50%" ? "translateX(-50%)" : "none";
    box.style.zIndex = zIndex;
    box.style.maxWidth = maxWidth;

    document.body.appendChild(box);

    // Set up typewriter effect on viewport intersection
    if (!skipTypewriter) {
      const textSpan = box.querySelector('.trinka-text-content');
      let typewriterStarted = false;
      const observer = new window.IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting && !typewriterStarted) {
              typewriterStarted = true;
              typeText(textSpan, text, voice);
              observer.unobserve(box);
            }
          });
        },
        { threshold: 0.1 }
      );
      observer.observe(box);
    }

    console.log(`[addIndependentTextBox] Created independent text-box "${id}" at ${top}`);
    
  } catch (error) {
    console.error(`[addIndependentTextBox] Error creating text-box "${id}":`, error);
  }
}

// --- Quick positioning helpers for common layouts ---
export function addTextBoxAtTop(options = {}) {
  return addIndependentTextBox({ ...options, top: "15vh" });
}

export function addTextBoxAtCenter(options = {}) {
  return addIndependentTextBox({ ...options, top: "45vh" });
}

export function addTextBoxAtBottom(options = {}) {
  return addIndependentTextBox({ ...options, top: "75vh" });
}
