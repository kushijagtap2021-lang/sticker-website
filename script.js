/* ==========================================================================
   STICKERVERSE - SCRIPT.JS
   Magical Scrapbook Core Logic, 3D Page Flipping, DIY Editor & Synth Sound
   ========================================================================== */

// === 1. STICKERS DATABASE ===
const stickers = [
    // Animals
    { id: 'cat', name: 'Calico Cat', emoji: '🐱', category: 'animals', desc: 'A cozy calico kitty that loves to snuggle in your scrapbooks.', path: 'images/stickers/cat.svg' },
    { id: 'bunny', name: 'Pastel Bunny', emoji: '🐰', category: 'animals', desc: 'A happy, bouncing rabbit wearing a sweet yellow flower.', path: 'images/stickers/bunny.svg' },
    { id: 'panda', name: 'Bamboo Panda', emoji: '🐼', category: 'animals', desc: 'A soft panda bear cub munching on fresh green leaves.', path: 'images/stickers/panda.svg' },
    { id: 'shiba', name: 'Happy Shiba', emoji: '🐕', category: 'animals', desc: 'A cheerful shiba dog with round white eyebrows and a sunny smile.', path: 'images/stickers/shiba.svg' },
    
    // Food
    { id: 'strawberry', name: 'Smiley Strawberry', emoji: '🍓', category: 'food', desc: 'A ripe, red berry sprinkled with cute yellow seeds.', path: 'images/stickers/strawberry.svg' },
    { id: 'cupcake', name: 'Sprinkle Cupcake', emoji: '🧁', category: 'food', desc: 'A delicious cupcake topped with pink frosting, confetti, and a cherry.', path: 'images/stickers/cupcake.svg' },
    { id: 'boba', name: 'Boba Milk Tea', emoji: '🧋', category: 'food', desc: 'Sweet brown sugar milk tea packed with chewy tapioca pearls.', path: 'images/stickers/boba.svg' },
    { id: 'donut', name: 'Strawberry Donut', emoji: '🍩', category: 'food', desc: 'A golden baked donut glazed in strawberry frosting and sprinkles.', path: 'images/stickers/donut.svg' },

    // Flowers
    { id: 'sakura', name: 'Cherry Blossom', emoji: '🌸', category: 'flowers', desc: 'A delicate pink sakura flower, herald of spring and sweet dreams.', path: 'images/stickers/sakura.svg' },
    { id: 'sunflower', name: 'Sunny Sunflower', emoji: '🌻', category: 'flowers', desc: 'A tall, happy sunflower that always faces the bright warm sun.', path: 'images/stickers/sunflower.svg' },
    { id: 'tulip', name: 'Pink Tulip', emoji: '🌷', category: 'flowers', desc: 'An elegant springtime tulip, glowing with soft pink gradients.', path: 'images/stickers/tulip.svg' },
    { id: 'daisy', name: 'Chubby Daisy', emoji: '🌼', category: 'flowers', desc: 'A friendly white daisy flower with a bright yellow center smile.', path: 'images/stickers/daisy.svg' },

    // Emojis
    { id: 'heart_eyes', name: 'Loving Face', emoji: '😍', category: 'emojis', desc: 'A warm blushing face with big red hearts for eyes.', path: 'images/stickers/heart_eyes.svg' },
    { id: 'star_struck', name: 'Starry Eyed', emoji: '🤩', category: 'emojis', desc: 'A grinning face with glowing orange stars, full of excitement!', path: 'images/stickers/star_struck.svg' },
    { id: 'pleading', name: 'Pleading Eyes', emoji: '🥺', category: 'emojis', desc: 'Big, glossy pleading puppy dog eyes that are impossible to resist.', path: 'images/stickers/pleading.svg' },
    { id: 'party', name: 'Party Popper Face', emoji: '🥳', category: 'emojis', desc: 'A celebrating emoji blowing a horn, wearing a birthday party hat.', path: 'images/stickers/party.svg' },

    // Celebrations
    { id: 'cake', name: 'Celebration Cake', emoji: '🎂', category: 'celebrations', desc: 'A double-decker birthday cake with layers of frosting and lit candles.', path: 'images/stickers/cake.svg' },
    { id: 'balloon', name: 'Dreamy Balloons', emoji: '🎈', category: 'celebrations', desc: 'Three pastel-colored balloons tied together floating high.', path: 'images/stickers/balloon.svg' },
    { id: 'gift', name: 'Secret Gift Box', emoji: '🎁', category: 'celebrations', desc: 'A beautifully wrapped teal gift box topped with a huge red bow.', path: 'images/stickers/gift.svg' },
    { id: 'party_popper', name: 'Glitter Popper', emoji: '🎉', category: 'celebrations', desc: 'A golden party popper shooting out stars and colorful streamers.', path: 'images/stickers/party_popper.svg' },

    // Cute Objects
    { id: 'teddy', name: 'Cuddle Teddy', emoji: '🧸', category: 'cute', desc: 'A soft, fluffy brown teddy bear that loves warm scrapbook hugs.', path: 'images/stickers/teddy.svg' },
    { id: 'cloud', name: 'Happy Cloud', emoji: '☁️', category: 'cute', desc: 'A smiling pastel cloud dripping tiny colorful raindrops.', path: 'images/stickers/cloud.svg' },
    { id: 'star', name: 'Sparkling Star', emoji: '⭐', category: 'cute', desc: 'A cute little yellow star blinking happily with golden sparkles.', path: 'images/stickers/star.svg' },
    { id: 'ribbon', name: 'Sakura Bow Ribbon', emoji: '🎀', category: 'cute', desc: 'A beautifully folded pink satin bow ribbon.', path: 'images/stickers/ribbon.svg' }
];

// === 2. STATE VARIABLES ===
let currentPage = 0; // 0 to 9 pages
const totalSheets = 5;
let collectedStickers = new Set();
let favoriteStickers = new Set();
let activeTheme = 'pink';
let diyLayout = [];

// DIY Canvas Active Transform states
let activeDiySticker = null;
let isDragging = false;
let isRotating = false;
let isScaling = false;

let dragStartX, dragStartY;
let stickerStartX, stickerStartY;
let stickerStartRotate, stickerStartScale;
let stickerStartAngle, stickerStartDist;

// Ambient Music
let bgMusicPlaying = false;
let musicInterval = null;
let musicChordIndex = 0;

// === 3. WEB AUDIO API SYNTHESIZER ===
let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

// Chime player helper
function playChime(freqs, duration) {
    try {
        initAudio();
        const now = audioCtx.currentTime;
        freqs.forEach((freq, idx) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.07);
            
            // Soft envelope
            gain.gain.setValueAtTime(0.12, now + idx * 0.07);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + duration);
            
            osc.start(now + idx * 0.07);
            osc.stop(now + idx * 0.07 + duration);
        });
    } catch(e) {
        console.log("Audio not supported or blocked: ", e);
    }
}

// Interactive sound presets
const sounds = {
    click: () => playChime([523.25], 0.12), // C5
    flip: () => playChime([329.63, 392.00, 523.25, 659.25], 0.35), // E5, G5, C6, E6
    collect: () => playChime([523.25, 659.25, 783.99, 1046.50, 1318.51], 0.6), // Ascending C Major Chime
    fav: () => playChime([523.25, 587.33, 659.25, 880.00], 0.4), // Warm C D E A chord
    achievement: () => playChime([523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98, 2093.00], 0.8), // Long grand arpeggio
    delete: () => playChime([392.00, 311.13, 261.63], 0.3) // Descending
};

// Soothing background bells chord loop generator
const chords = [
    [261.63, 329.63, 392.00, 493.88], // Cmaj7 (C4, E4, G4, B4)
    [349.23, 440.00, 523.25, 659.25], // Fmaj7 (F4, A4, C5, E5)
    [220.00, 329.63, 392.00, 523.25], // Am7 (A3, E4, G4, C5)
    [293.66, 392.00, 493.88, 587.33]  // G6 (D4, G4, B4, D5)
];

function playAmbientChord() {
    if (!bgMusicPlaying) return;
    try {
        initAudio();
        const now = audioCtx.currentTime;
        const chord = chords[musicChordIndex];
        
        chord.forEach((freq, idx) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.type = 'sine';
            // Slow attack and fade for dreamy bell effect
            osc.frequency.setValueAtTime(freq, now + idx * 0.3);
            
            gain.gain.setValueAtTime(0, now + idx * 0.3);
            gain.gain.linearRampToValueAtTime(0.04, now + idx * 0.3 + 1.0);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.3 + 3.8);
            
            osc.start(now + idx * 0.3);
            osc.stop(now + idx * 0.3 + 4.0);
        });
        
        musicChordIndex = (musicChordIndex + 1) % chords.length;
    } catch(e) {
        console.log(e);
    }
}

function toggleMusic() {
    initAudio();
    const btn = document.getElementById('musicToggle');
    const audioEl = document.getElementById('bgMusic');
    
    if (!bgMusicPlaying) {
        bgMusicPlaying = true;
        btn.classList.add('playing');
        btn.textContent = '🎶';
        
        // Try playing native MP3 first
        audioEl.play().catch(err => {
            console.log("MP3 autoplay blocked or missing, using Synth Chime Fallback instead.");
            // Start procedural synthesis bells loop
            playAmbientChord();
            musicInterval = setInterval(playAmbientChord, 5000);
        });
    } else {
        bgMusicPlaying = false;
        btn.classList.remove('playing');
        btn.textContent = '🎵';
        
        audioEl.pause();
        if (musicInterval) {
            clearInterval(musicInterval);
            musicInterval = null;
        }
    }
    sounds.click();
}

// === 4. AMBIENT ANIMATIONS & PARTICLES ===
function initAmbientDecor() {
    const cloudsContainer = document.getElementById('clouds-layer');
    const butterfliesContainer = document.getElementById('butterflies-layer');
    const sparklesContainer = document.getElementById('sparkles-layer');
    const petalsContainer = document.getElementById('petals-layer');
    
    // Spawn static stars that twinkle
    for (let i = 0; i < 15; i++) {
        const star = document.createElement('div');
        star.className = 'ambient-decor star-decor';
        star.textContent = ['✨', '⭐', '*'][Math.floor(Math.random() * 3)];
        star.style.left = Math.random() * 100 + 'vw';
        star.style.top = Math.random() * 80 + 'vh';
        star.style.animationDelay = Math.random() * 5 + 's';
        star.style.fontSize = (0.5 + Math.random() * 1) + 'rem';
        sparklesContainer.appendChild(star);
    }

    // Spawn falling flower petals periodically
    setInterval(() => {
        const petal = document.createElement('div');
        petal.className = 'petal-decor';
        petal.textContent = ['🌸', '💮', '🌼', '🍃'][Math.floor(Math.random() * 4)];
        petal.style.left = Math.random() * 90 + 'vw';
        petal.style.animationDuration = (8 + Math.random() * 6) + 's';
        petal.style.fontSize = (0.8 + Math.random() * 0.8) + 'rem';
        petalsContainer.appendChild(petal);
        
        setTimeout(() => petal.remove(), 14000);
    }, 2500);

    // Spawn butterflies drifting
    setInterval(() => {
        const butterfly = document.createElement('div');
        butterfly.className = 'butterfly-decor';
        butterfly.textContent = '🦋';
        butterfly.style.top = (20 + Math.random() * 60) + 'vh';
        butterfly.style.animationDuration = (12 + Math.random() * 8) + 's';
        butterfliesContainer.appendChild(butterfly);
        
        setTimeout(() => butterfly.remove(), 20000);
    }, 8000);

    // Spawn drifting clouds
    for(let i=0; i<3; i++) {
        spawnCloud(cloudsContainer, i * 8);
    }
}

function spawnCloud(container, delay = 0) {
    const cloud = document.createElement('div');
    cloud.className = 'cloud-decor';
    cloud.textContent = '☁️';
    cloud.style.top = (5 + Math.random() * 15) + 'vh';
    cloud.style.animationDelay = delay + 's';
    cloud.style.fontSize = (2.5 + Math.random() * 2) + 'rem';
    container.appendChild(cloud);
}

// Particle Burst on events
function triggerParticleBurst(clientX, clientY, type = 'heart') {
    const container = document.getElementById('particle-layer');
    const symbols = type === 'heart' ? ['❤️', '💖', '💗', '💕', '🎀'] : ['✨', '⭐', '🌟', '💫', '☀️'];
    
    for (let i = 0; i < 15; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        
        // Random trajectory angle and distance
        const angle = Math.random() * Math.PI * 2;
        const distance = 40 + Math.random() * 100;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance - 30; // Float upwards slightly
        const rot = 90 + Math.random() * 360;
        
        p.style.left = clientX + 'px';
        p.style.top = clientY + 'px';
        p.style.setProperty('--dx', `${dx}px`);
        p.style.setProperty('--dy', `${dy}px`);
        p.style.setProperty('--rot', `${rot}deg`);
        
        container.appendChild(p);
        setTimeout(() => p.remove(), 800);
    }
}

// === 5. THEME SWITCHER ===
function initThemes() {
    const select = document.getElementById('themeSelect');
    
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('stickerverse-theme');
    if (savedTheme) {
        activeTheme = savedTheme;
        select.value = activeTheme;
        document.body.className = `theme-${activeTheme}`;
    }
    
    select.addEventListener('change', (e) => {
        activeTheme = e.target.value;
        document.body.className = `theme-${activeTheme}`;
        localStorage.setItem('stickerverse-theme', activeTheme);
        sounds.click();
        
        // Sparkle burst around the select menu
        const rect = select.getBoundingClientRect();
        triggerParticleBurst(rect.left + rect.width/2, rect.top + rect.height/2, 'star');
    });
}

// === 6. NAVIGATION & 3D PAGE-FLIP ENGINE ===
function updateBookUI() {
    const book = document.getElementById('book');
    const sheets = document.querySelectorAll('.sheet');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const drawer = document.getElementById('diy-drawer');
    
    // Calculate current sheet index (1 to 5)
    // Page index map: Cover=0, Animals=1, Food=2, Flowers=3, Emojis=4, Celebrations=5, Cute=6, Favorites=7, DIY=8, EndCover=9.
    const activeSheetIndex = Math.floor((currentPage - 1) / 2) + 1;
    
    // Open/Close cover classes
    if (currentPage === 0) {
        book.className = 'book closed';
    } else {
        book.className = 'book open';
    }

    // Set Flipped and Passed sheets
    sheets.forEach((sheet, idx) => {
        const sheetNum = idx + 1;
        
        // Flipped state
        const isFlipped = currentPage >= 2 * sheetNum - 1;
        if (isFlipped) {
            sheet.classList.add('flipped');
        } else {
            sheet.classList.remove('flipped');
        }

        // Passed state (slides out left on mobile)
        const isPassed = currentPage >= 2 * sheetNum;
        if (isPassed) {
            sheet.classList.add('passed');
        } else {
            sheet.classList.remove('passed');
        }

        // 3D Z-Indexing sorting
        if (isFlipped) {
            sheet.style.zIndex = sheetNum;
        } else {
            sheet.style.zIndex = totalSheets - sheetNum + 1;
        }
        
        // Active page-face highlighter for mobile opacity layers
        const pageFaceFront = sheet.querySelector('.page-face.front');
        const pageFaceBack = sheet.querySelector('.page-face.back');
        
        pageFaceFront.classList.remove('active-page');
        pageFaceBack.classList.remove('active-page');
        
        const frontPageNum = 2 * sheetNum - 2; // e.g. Sheet 2 Front is Page 2
        const backPageNum = 2 * sheetNum - 1;  // e.g. Sheet 2 Back is Page 3
        
        if (currentPage === frontPageNum) {
            pageFaceFront.classList.add('active-page');
        } else if (currentPage === backPageNum) {
            pageFaceBack.classList.add('active-page');
        }
    });

    // Arrow buttons state
    prevBtn.disabled = currentPage === 0;
    nextBtn.disabled = currentPage === 9;
    
    // Bookmark Tabs highlights
    const tabs = document.querySelectorAll('.bookmark-tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
        const sheetNum = parseInt(tab.dataset.sheet);
        const side = tab.dataset.side;
        
        if (currentPage === 0 && tab.classList.contains('tab-cover')) {
            tab.classList.add('active');
        } else if (currentPage === 1 && tab.classList.contains('tab-animals')) {
            tab.classList.add('active');
        } else if (currentPage === 2 && tab.classList.contains('tab-food')) {
            tab.classList.add('active');
        } else if (currentPage === 3 && tab.classList.contains('tab-flowers')) {
            tab.classList.add('active');
        } else if (currentPage === 4 && tab.classList.contains('tab-emojis')) {
            tab.classList.add('active');
        } else if (currentPage === 5 && tab.classList.contains('tab-celebrations')) {
            tab.classList.add('active');
        } else if (currentPage === 6 && tab.classList.contains('tab-cute')) {
            tab.classList.add('active');
        } else if (currentPage === 7 && tab.classList.contains('tab-favorites')) {
            tab.classList.add('active');
        } else if ((currentPage === 8 || currentPage === 9) && tab.classList.contains('tab-diy')) {
            tab.classList.add('active');
        }
    });

    // Toggle DIY Sticker drawer based on DIY page active state
    if (currentPage === 8) {
        drawer.classList.remove('hidden');
    } else {
        drawer.classList.add('hidden');
    }
}

function flipNext() {
    if (currentPage < 9) {
        currentPage = (currentPage === 0) ? 1 : currentPage + 2;
        if (currentPage > 9) currentPage = 9;
        sounds.flip();
        updateBookUI();
    }
}

function flipPrev() {
    if (currentPage > 0) {
        currentPage = (currentPage === 9) ? 8 : currentPage - 2;
        if (currentPage < 0) currentPage = 0;
        sounds.flip();
        updateBookUI();
    }
}

function flipToSheet(sheetNum, side = 'front') {
    // Determine target page index based on sheet and side
    if (sheetNum === 1 && side === 'front') {
        currentPage = 0; // Cover
    } else {
        currentPage = 2 * sheetNum - (side === 'front' ? 2 : 1);
    }
    sounds.flip();
    updateBookUI();
}

// === 7. STICKERS ALBUM RENDER & DYNAMIC LOADER ===
function renderStickerGrids() {
    // Categorized grids
    const categories = ['animals', 'food', 'flowers', 'emojis', 'celebrations', 'cute'];
    
    categories.forEach(cat => {
        const grid = document.getElementById(`grid-${cat}`);
        if (!grid) return;
        
        grid.innerHTML = '';
        const catStickers = stickers.filter(s => s.category === cat);
        
        catStickers.forEach(sticker => {
            const isCollected = collectedStickers.has(sticker.id);
            const isFav = favoriteStickers.has(sticker.id);
            
            const card = document.createElement('div');
            card.className = `sticker-card ${isCollected ? 'unlocked' : 'locked'}`;
            card.dataset.id = sticker.id;
            
            // Add favorite badge if favorited
            let favBadge = '';
            if (isFav && isCollected) {
                favBadge = `<span class="badge-fav">❤️</span>`;
            }
            
            // Lock badge overlay
            const lockOverlay = !isCollected ? `<div class="lock-badge">🔒</div>` : '';
            
            card.innerHTML = `
                ${favBadge}
                <img src="${sticker.path}" alt="${sticker.name}">
                <h4>${sticker.name}</h4>
                ${lockOverlay}
            `;
            
            card.addEventListener('click', (e) => {
                showStickerDetails(sticker.id, e.clientX, e.clientY);
            });
            
            grid.appendChild(card);
        });
    });

    renderFavoritesGrid();
    renderDiyDrawer();
}

// Render Favorites Grid
function renderFavoritesGrid() {
    const grid = document.getElementById('grid-favorites');
    const emptyMsg = document.getElementById('no-favorites-msg');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    const favs = stickers.filter(s => favoriteStickers.has(s.id) && collectedStickers.has(s.id));
    
    if (favs.length === 0) {
        emptyMsg.classList.remove('hidden');
        grid.classList.add('hidden');
    } else {
        emptyMsg.classList.add('hidden');
        grid.classList.remove('hidden');
        
        favs.forEach(sticker => {
            const card = document.createElement('div');
            card.className = 'sticker-card unlocked';
            card.dataset.id = sticker.id;
            
            card.innerHTML = `
                <span class="badge-fav">❤️</span>
                <img src="${sticker.path}" alt="${sticker.name}">
                <h4>${sticker.name}</h4>
            `;
            
            card.addEventListener('click', (e) => {
                showStickerDetails(sticker.id, e.clientX, e.clientY);
            });
            
            grid.appendChild(card);
        });
    }
}

// === 8. POPUP MODAL & COLLECTION LOGIC ===
function showStickerDetails(stickerId, clickX = window.innerWidth/2, clickY = window.innerHeight/2) {
    const sticker = stickers.find(s => s.id === stickerId);
    if (!sticker) return;
    
    const popup = document.getElementById('popup');
    const pImg = document.getElementById('popupImage');
    const pTitle = document.getElementById('popupTitle');
    const pCat = document.getElementById('popupCategory');
    const pDesc = document.getElementById('popupDesc');
    const collectBtn = document.getElementById('collectBtn');
    const favBtn = document.getElementById('favButton');
    
    pImg.src = sticker.path;
    pTitle.textContent = `${sticker.emoji} ${sticker.name}`;
    pCat.textContent = sticker.category.toUpperCase();
    pDesc.textContent = sticker.desc;
    
    const isCollected = collectedStickers.has(stickerId);
    const isFav = favoriteStickers.has(stickerId);
    
    // Setup collect button state
    if (isCollected) {
        collectBtn.textContent = '✨ Collected!';
        collectBtn.classList.add('collected-state');
    } else {
        collectBtn.textContent = '✨ Collect Sticker';
        collectBtn.classList.remove('collected-state');
    }
    
    // Setup favorite button state
    if (isFav) {
        favBtn.textContent = '❤️ Favorited';
        favBtn.classList.add('fav-active');
    } else {
        favBtn.textContent = '❤️ Add to Favorites';
        favBtn.classList.remove('fav-active');
    }
    
    // Bind click events (clean unbind first)
    collectBtn.onclick = (e) => {
        collectSticker(stickerId, e.clientX, e.clientY);
    };
    
    favBtn.onclick = (e) => {
        toggleFavorite(stickerId, e.clientX, e.clientY);
    };
    
    popup.classList.add('active');
    sounds.click();
}

function closePopup() {
    const popup = document.getElementById('popup');
    popup.classList.remove('active');
    sounds.click();
}

function collectSticker(id, clientX, clientY) {
    if (collectedStickers.has(id)) return;
    
    collectedStickers.add(id);
    localStorage.setItem('collected-stickers', JSON.stringify([...collectedStickers]));
    
    // Celebration effects
    sounds.collect();
    triggerParticleBurst(clientX, clientY, 'star');
    triggerParticleBurst(clientX, clientY, 'heart');
    
    // Refresh elements
    updateProgress();
    renderStickerGrids();
    
    // Update collect button inside popup immediately
    const collectBtn = document.getElementById('collectBtn');
    collectBtn.textContent = '✨ Collected!';
    collectBtn.classList.add('collected-state');
}

function toggleFavorite(id, clientX, clientY) {
    // Collecting first is required
    if (!collectedStickers.has(id)) {
        collectSticker(id, clientX, clientY);
    }
    
    const favBtn = document.getElementById('favButton');
    if (favoriteStickers.has(id)) {
        favoriteStickers.delete(id);
        favBtn.textContent = '❤️ Add to Favorites';
        favBtn.classList.remove('fav-active');
        sounds.delete();
    } else {
        favoriteStickers.add(id);
        favBtn.textContent = '❤️ Favorited';
        favBtn.classList.add('fav-active');
        sounds.fav();
        triggerParticleBurst(clientX, clientY, 'heart');
    }
    
    localStorage.setItem('favorite-stickers', JSON.stringify([...favoriteStickers]));
    renderStickerGrids();
}

// === 9. SEARCH ENGINE (Dynamic highlighting) ===
function initSearch() {
    const searchInput = document.getElementById('search');
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const cards = document.querySelectorAll('.sticker-card');
        const tabs = document.querySelectorAll('.bookmark-tab');
        
        // Remove search highlights from tabs
        tabs.forEach(tab => tab.classList.remove('search-matched'));
        
        let matchCountByCategory = {};
        
        cards.forEach(card => {
            const id = card.dataset.id;
            const sticker = stickers.find(s => s.id === id);
            if (!sticker) return;
            
            const matchName = sticker.name.toLowerCase().includes(query);
            const matchEmoji = sticker.emoji.includes(query);
            const matchCat = sticker.category.toLowerCase().includes(query);
            const matchDesc = sticker.desc.toLowerCase().includes(query);
            
            if (query === '' || matchName || matchEmoji || matchCat || matchDesc) {
                card.classList.remove('hidden');
                
                // Track category matches
                if (query !== '') {
                    matchCountByCategory[sticker.category] = (matchCountByCategory[sticker.category] || 0) + 1;
                }
            } else {
                card.classList.add('hidden');
            }
        });
        
        // Visual indicator on navigation bookmarks for categories with matches
        if (query !== '') {
            Object.keys(matchCountByCategory).forEach(cat => {
                const tab = document.querySelector(`.tab-${cat}`);
                if (tab) {
                    tab.classList.add('search-matched');
                }
            });
        }
    });
}

// Add CSS rules dynamically for search matched tabs pulsing
const styleSheet = document.createElement("style");
styleSheet.innerText = `
    .bookmark-tab.search-matched {
        animation: searchPulse 1.2s infinite alternate;
        box-shadow: 0 0 15px white, 4px 4px 0 var(--text) !important;
        border-color: var(--primary) !important;
    }
    @keyframes searchPulse {
        0% { transform: scale(1); }
        100% { transform: scale(1.15) translateX(5px); }
    }
`;
document.head.appendChild(styleSheet);

// === 10. COLLECTION PROGRESS & ACHIEVEMENTS ===
function updateProgress() {
    const collectedCountEl = document.getElementById('collectedCount');
    const progressBar = document.getElementById('progress');
    const achievementEl = document.getElementById('achievement');
    
    const total = stickers.length;
    const collected = collectedStickers.size;
    const percent = Math.round((collected / total) * 100);
    
    progressBar.style.width = `${percent}%`;
    collectedCountEl.textContent = `${collected} / ${total} Collected`;
    
    // Achievements unlocks
    let badgeText = '🌱 Beginner Collector';
    let badgeClass = 'achievement-badge theme-pink';
    
    if (collected === total) {
        badgeText = '👑 Sticker Master';
    } else if (collected >= 12) {
        badgeText = '🌸 Sticker Lover';
    }
    
    // Trigger sound on progress milestones
    const previousBadge = achievementEl.textContent;
    achievementEl.textContent = badgeText;
    
    if (previousBadge !== badgeText && collected > 0) {
        sounds.achievement();
        // Burst stars all over
        triggerParticleBurst(window.innerWidth / 2, window.innerHeight / 2, 'star');
    }
}

// === 11. SURPRISE ME (Random Sticker Picker) ===
function initSurpriseMe() {
    const btn = document.getElementById('surpriseBtn');
    btn.addEventListener('click', () => {
        // Collect sound or click
        sounds.click();
        
        // Filter uncollected stickers first
        let pool = stickers.filter(s => !collectedStickers.has(s.id));
        
        // If all collected, pick from any
        if (pool.length === 0) {
            pool = stickers;
        }
        
        const randomSticker = pool[Math.floor(Math.random() * pool.length)];
        
        // Flip to its corresponding page
        const sheetIdx = Math.floor(stickers.indexOf(randomSticker) / 4); // 4 stickers per sheet face
        let targetPage = 0;
        
        if (randomSticker.category === 'animals') targetPage = 1;
        else if (randomSticker.category === 'food') targetPage = 2;
        else if (randomSticker.category === 'flowers') targetPage = 3;
        else if (randomSticker.category === 'emojis') targetPage = 4;
        else if (randomSticker.category === 'celebrations') targetPage = 5;
        else if (randomSticker.category === 'cute') targetPage = 6;
        
        currentPage = targetPage;
        updateBookUI();
        
        // Short delay to let page flip complete, then show details popup
        setTimeout(() => {
            const cards = document.querySelectorAll(`.sticker-card[data-id="${randomSticker.id}"]`);
            if (cards.length > 0) {
                const rect = cards[0].getBoundingClientRect();
                showStickerDetails(randomSticker.id, rect.left + rect.width/2, rect.top + rect.height/2);
            } else {
                showStickerDetails(randomSticker.id);
            }
        }, 600);
    });
}

// Toggle open button cover jump
function initOpenBook() {
    const btn = document.getElementById('openBookBtn');
    btn.addEventListener('click', () => {
        if (currentPage === 0) {
            currentPage = 1;
        } else {
            currentPage = 0;
        }
        sounds.flip();
        updateBookUI();
    });
}

// === 12. DIY CANVAS SCRAPBOOK DRAWING & EDITING ===
function renderDiyDrawer() {
    const grid = document.getElementById('drawer-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    stickers.forEach(sticker => {
        const isCollected = collectedStickers.has(sticker.id);
        
        const div = document.createElement('div');
        div.className = `drawer-item ${isCollected ? '' : 'disabled'}`;
        div.dataset.id = sticker.id;
        
        const lockIcon = !isCollected ? `<div class="lock-badge">🔒</div>` : '';
        
        div.innerHTML = `
            <img src="${sticker.path}" alt="${sticker.name}">
            ${lockIcon}
        `;
        
        div.addEventListener('click', () => {
            if (isCollected) {
                addStickerToCanvas(sticker.id);
            } else {
                sounds.click();
                alert(`Collect this sticker first to use it in your DIY layout!`);
            }
        });
        
        grid.appendChild(div);
    });
}

// Add sticker to Canvas
function addStickerToCanvas(stickerId, initialX = 100, initialY = 100, initialScale = 1.0, initialRotate = 0, initialTaped = false) {
    const sticker = stickers.find(s => s.id === stickerId);
    if (!sticker) return;
    
    const canvas = document.getElementById('diy-canvas');
    const instanceId = 'sticker-' + Date.now() + Math.random().toString(36).substr(2, 4);
    
    const container = document.createElement('div');
    container.className = `placed-sticker ${initialTaped ? 'taped' : ''}`;
    container.id = instanceId;
    container.dataset.stickerId = stickerId;
    container.dataset.scale = initialScale;
    container.dataset.rotate = initialRotate;
    
    // Position
    container.style.left = initialX + 'px';
    container.style.top = initialY + 'px';
    container.style.transform = `rotate(${initialRotate}deg) scale(${initialScale})`;
    
    container.innerHTML = `
        <img src="${sticker.path}" alt="${sticker.name}">
        <div class="sticker-control btn-delete" title="Delete">✖</div>
        <div class="sticker-control btn-rotate" title="Rotate">🔄</div>
        <div class="sticker-control btn-scale" title="Resize">📐</div>
        <div class="sticker-control btn-tape-toggle" title="Toggle Washi Tape">🩹</div>
    `;
    
    // Bind Controls
    container.querySelector('.btn-delete').addEventListener('click', (e) => {
        e.stopPropagation();
        container.remove();
        sounds.delete();
        saveDiyCanvas();
    });
    
    container.querySelector('.btn-tape-toggle').addEventListener('click', (e) => {
        e.stopPropagation();
        container.classList.toggle('taped');
        sounds.click();
        saveDiyCanvas();
    });
    
    // Pointer down handler for selection and drag
    container.addEventListener('pointerdown', (e) => {
        if (e.target.classList.contains('sticker-control')) return;
        selectDiySticker(container, e);
    });
    
    // Rotate control pointerdown
    container.querySelector('.btn-rotate').addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        initDiyRotate(container, e);
    });
    
    // Scale control pointerdown
    container.querySelector('.btn-scale').addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        initDiyScale(container, e);
    });
    
    canvas.appendChild(container);
    selectDiySticker(container);
    sounds.click();
    saveDiyCanvas();
}

// Select a sticker on canvas
function selectDiySticker(el) {
    // Deselect all
    const all = document.querySelectorAll('.placed-sticker');
    all.forEach(item => item.classList.remove('selected'));
    
    activeDiySticker = el;
    if (el) {
        el.classList.add('selected');
        // Bring to front
        const canvas = document.getElementById('diy-canvas');
        canvas.appendChild(el);
    }
}

// Click canvas to deselect
document.getElementById('diy-canvas').addEventListener('pointerdown', (e) => {
    if (e.target.id === 'diy-canvas' || e.target.classList.contains('canvas-grid-lines') || e.target.classList.contains('canvas-watermark')) {
        selectDiySticker(null);
    }
});

// Move Dragging Logic
function selectDiySticker(el, e = null) {
    const all = document.querySelectorAll('.placed-sticker');
    all.forEach(item => item.classList.remove('selected'));
    
    activeDiySticker = el;
    if (!el) return;
    
    el.classList.add('selected');
    // Bring to front
    const canvas = document.getElementById('diy-canvas');
    canvas.appendChild(el);
    
    if (e) {
        el.setPointerCapture(e.pointerId);
        isDragging = true;
        
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        
        stickerStartX = parseFloat(el.style.left) || 0;
        stickerStartY = parseFloat(el.style.top) || 0;
    }
}

// Window pointermove listener for Drag/Scale/Rotate action
window.addEventListener('pointermove', (e) => {
    if (!activeDiySticker) return;
    
    const canvas = document.getElementById('diy-canvas');
    const canvasRect = canvas.getBoundingClientRect();
    const rect = activeDiySticker.getBoundingClientRect();
    
    // Center point of sticker
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    if (isDragging) {
        const dx = e.clientX - dragStartX;
        const dy = e.clientY - dragStartY;
        
        let newX = stickerStartX + dx;
        let newY = stickerStartY + dy;
        
        // Keep within canvas boundaries loosely
        newX = Math.max(-30, Math.min(canvasRect.width - 50, newX));
        newY = Math.max(-30, Math.min(canvasRect.height - 50, newY));
        
        activeDiySticker.style.left = newX + 'px';
        activeDiySticker.style.top = newY + 'px';
    } 
    else if (isRotating) {
        const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        const angleDiff = currentAngle - stickerStartAngle;
        let newRotate = stickerStartRotate + angleDiff * (180 / Math.PI);
        
        activeDiySticker.dataset.rotate = newRotate;
        activeDiySticker.style.transform = `rotate(${newRotate}deg) scale(${activeDiySticker.dataset.scale || 1})`;
    } 
    else if (isScaling) {
        const currentDist = Math.hypot(e.clientX - centerX, e.clientY - centerY);
        const ratio = currentDist / stickerStartDist;
        let newScale = Math.max(0.5, Math.min(2.5, stickerStartScale * ratio));
        
        activeDiySticker.dataset.scale = newScale;
        activeDiySticker.style.transform = `rotate(${activeDiySticker.dataset.rotate || 0}deg) scale(${newScale})`;
    }
});

window.addEventListener('pointerup', (e) => {
    if (activeDiySticker) {
        try {
            activeDiySticker.releasePointerCapture(e.pointerId);
        } catch(err) {}
    }
    if (isDragging || isRotating || isScaling) {
        isDragging = false;
        isRotating = false;
        isScaling = false;
        saveDiyCanvas();
    }
});

// Rotate initiator
function initDiyRotate(el, e) {
    isRotating = true;
    selectDiySticker(el);
    el.setPointerCapture(e.pointerId);
    
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    stickerStartAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    stickerStartRotate = parseFloat(el.dataset.rotate) || 0;
}

// Scale initiator
function initDiyScale(el, e) {
    isScaling = true;
    selectDiySticker(el);
    el.setPointerCapture(e.pointerId);
    
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    stickerStartDist = Math.hypot(e.clientX - centerX, e.clientY - centerY);
    stickerStartScale = parseFloat(el.dataset.scale) || 1.0;
}

// Save DIY Layout
function saveDiyCanvas() {
    const items = [];
    const elements = document.querySelectorAll('.placed-sticker');
    
    elements.forEach(el => {
        items.push({
            stickerId: el.dataset.stickerId,
            x: parseInt(el.style.left) || 0,
            y: parseInt(el.style.top) || 0,
            scale: parseFloat(el.dataset.scale) || 1.0,
            rotate: parseFloat(el.dataset.rotate) || 0,
            taped: el.classList.contains('taped')
        });
    });
    
    localStorage.setItem('stickerverse-diy-layout', JSON.stringify(items));
}

// Load DIY Layout
function loadDiyCanvas() {
    const canvas = document.getElementById('diy-canvas');
    // Clear dynamic children
    const placed = canvas.querySelectorAll('.placed-sticker');
    placed.forEach(el => el.remove());
    
    const data = localStorage.getItem('stickerverse-diy-layout');
    if (data) {
        try {
            const items = JSON.parse(data);
            items.forEach(item => {
                addStickerToCanvas(item.stickerId, item.x, item.y, item.scale, item.rotate, item.taped);
            });
        } catch(err) {
            console.log(err);
        }
    }
}

// Clear DIY canvas button
function initDiyButtons() {
    document.getElementById('clearCanvasBtn').addEventListener('click', () => {
        if (confirm("Are you sure you want to clear your scrapbook page decorations?")) {
            const placed = document.querySelectorAll('.placed-sticker');
            placed.forEach(el => el.remove());
            sounds.delete();
            saveDiyCanvas();
        }
    });

    document.getElementById('saveCanvasBtn').addEventListener('click', (e) => {
        saveDiyCanvas();
        sounds.fav();
        triggerParticleBurst(e.clientX, e.clientY, 'star');
        alert("✨ Layout saved successfully! Your custom scrapbook will persist even if you reload the page.");
    });
}

// === 13. LOCAL STORAGE INITIALIZER ===
function initLocalStorage() {
    // Uncollected / Collected set
    const collectedData = localStorage.getItem('collected-stickers');
    if (collectedData) {
        try {
            collectedStickers = new Set(JSON.parse(collectedData));
        } catch(e) {}
    } else {
        // Collect first 3 stickers by default as a friendly tutorial setup!
        collectedStickers = new Set(['cat', 'strawberry', 'sakura']);
        localStorage.setItem('collected-stickers', JSON.stringify([...collectedStickers]));
    }
    
    // Favorites set
    const favData = localStorage.getItem('favorite-stickers');
    if (favData) {
        try {
            favoriteStickers = new Set(JSON.parse(favData));
        } catch(e) {}
    }
}

// Keyboard shortcuts for page turning
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        flipPrev();
    } else if (e.key === 'ArrowRight') {
        flipNext();
    }
});

// === 14. APPLICATION BOOTSTRAP ===
window.addEventListener('DOMContentLoaded', () => {
    // 1. Initial State
    initLocalStorage();
    
    // 2. Decor Ambient Loops
    initAmbientDecor();
    
    // 3. Setup Navigation Bindings
    document.getElementById('prevBtn').addEventListener('click', flipPrev);
    document.getElementById('nextBtn').addEventListener('click', flipNext);
    
    // 4. Setup Theme list
    initThemes();
    
    // 5. Setup Music handler
    document.getElementById('musicToggle').addEventListener('click', toggleMusic);
    
    // 6. Setup Search system
    initSearch();
    
    // 7. Setup Progress counters
    updateProgress();
    
    // 8. Setup Surprise generator
    initSurpriseMe();
    
    // 9. Setup Book open button
    initOpenBook();
    
    // 10. Load Canvas layouts & Drawer buttons
    loadDiyCanvas();
    initDiyButtons();

    // 11. Render Stickers Grid
    renderStickerGrids();
    
    // 12. Book orientation rendering
    updateBookUI();
});
