// Global Variables
let poppedBalloons = 0;
let decorationCount = 0;
let currentSongIndex = 0;
const audioPlayer = new Audio();

// Songs Configuration
const songs = [
    { title: "Jingle Bells", src: "assets/sounds/jingle-bells.mp3" },
    { title: "Silent Night", src: "assets/sounds/silent-night.mp3" },
    { title: "We Wish You", src: "assets/sounds/we-wish-you.mp3" }
];

// Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
    initializeGame();
});

function initializeGame() {
    createBalloons();
    initDragAndDrop();
    initMusicPlayer();
    setupEventListeners();
}

// Screen Navigation
function showNextScreen() {
    const currentScreen = document.querySelector('.screen.active');
    const nextScreen = currentScreen.nextElementSibling;
    
    if (nextScreen) {
        currentScreen.classList.remove('active');
        nextScreen.classList.add('active');
        
        if (nextScreen.id === 'screen3') {
            setTimeout(showFinalScreen, 500);
        }
    }
}

// Balloon Game Functions
function createBalloons() {
    const container = document.querySelector('.balloons-container');
    container.innerHTML = ''; // Clear existing balloons
    
    for (let i = 0; i < 12; i++) {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        balloon.style.left = `${10 + (Math.random() * 80)}%`;
        balloon.style.animationDuration = `${3 + Math.random() * 2}s`;
        balloon.style.animationDelay = `${Math.random() * 2}s`;
        balloon.addEventListener('click', popBalloon);
        container.appendChild(balloon);
    }
}

function popBalloon(event) {
    if (event.target.classList.contains('popped')) return;
    
    const balloon = event.target;
    balloon.classList.add('popped');
    
    // Add pop effect
    createPopEffect(balloon);
    
    // Play pop sound
    const popSound = document.getElementById('popSound');
    popSound.currentTime = 0;
    popSound.play();
    
    poppedBalloons++;
    
    if (poppedBalloons >= 8) {
        document.querySelector('.next-btn').classList.remove('hidden');
        createSparkles(event.clientX, event.clientY);
    }
}

function createPopEffect(balloon) {
    const rect = balloon.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.className = 'balloon-particle';
        particle.style.left = `${centerX}px`;
        particle.style.top = `${centerY}px`;
        particle.style.setProperty('--angle', `${i * 45}deg`);
        document.body.appendChild(particle);
        
        setTimeout(() => particle.remove(), 1000);
    }
}

// Tambahkan style untuk efek partikel
const style = document.createElement('style');
style.textContent = `
    .balloon-particle {
        position: fixed;
        width: 8px;
        height: 8px;
        background: #ff69b4;
        border-radius: 50%;
        pointer-events: none;
        animation: particleExplode 1s ease-out forwards;
    }

    @keyframes particleExplode {
        0% {
            transform: translate(0, 0);
            opacity: 1;
        }
        100% {
            transform: translate(calc(cos(var(--angle)) * 50px), 
                              calc(sin(var(--angle)) * 50px));
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
// Screen 2: Tree Decoration
function initDragAndDrop() {
    const ornaments = document.querySelectorAll('.ornament');
    const tree = document.querySelector('.christmas-tree');

    ornaments.forEach(ornament => {
        ornament.addEventListener('dragstart', handleDragStart);
        ornament.addEventListener('dragend', handleDragEnd);
    });

    tree.addEventListener('dragover', handleDragOver);
    tree.addEventListener('drop', handleDrop);
}

function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.innerHTML);
    e.target.classList.add('dragging');
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDrop(e) {
    e.preventDefault();
    const ornamentContent = e.dataTransfer.getData('text/plain');
    const treeRect = e.target.getBoundingClientRect();
    const x = e.clientX - treeRect.left;
    const y = e.clientY - treeRect.top;

    createOrnamentOnTree(ornamentContent, x, y);
    updateDecorationProgress();
}

function createOrnamentOnTree(content, x, y) {
    const ornament = document.createElement('div');
    ornament.className = 'tree-ornament';
    ornament.innerHTML = content;
    ornament.style.left = `${x}px`;
    ornament.style.top = `${y}px`;
    
    document.querySelector('.christmas-tree').appendChild(ornament);
    playSound('successSound');
}

function updateDecorationProgress() {
    decorationCount++;
    const progress = document.querySelector('.progress');
    const percentage = (decorationCount / 8) * 100;
    progress.style.width = `${percentage}%`;
    
    if (decorationCount >= 8) {
        document.getElementById('decorationComplete').classList.remove('hidden');
    }
}

// Screen 3: Gift Reveal
// Update fungsi showFinalScreen
function showFinalScreen() {
    const giftWrapper = document.querySelector('.gift-wrapper');
    const giftLid = document.querySelector('.gift-lid');
    const giftImage = document.querySelector('.gift-image img');
    const message = document.querySelector('.message');
    
    // Tambahkan event listener untuk membuka/menutup hadiah
    giftWrapper.addEventListener('click', toggleGift);
    
    // Tampilkan pesan setelah beberapa saat
    setTimeout(() => {
        giftLid.classList.add('open');
        setTimeout(() => {
            giftImage.classList.remove('hidden');
            message.classList.remove('hidden');
            typeMessage();
        }, 1000);
    }, 500);
}

// Fungsi untuk toggle hadiah
function toggleGift() {
    const giftLid = document.querySelector('.gift-lid');
    const isOpen = giftLid.classList.contains('open');
    
    if (isOpen) {
        giftLid.classList.remove('open');
    } else {
        giftLid.classList.add('open');
    }
}

function typeMessage() {
    const text = "Thank you so much for being my friend. I’m so happy that you’ve stayed friends with me until now—it truly means a lot. I’m really grateful to have met you and to have you in my life!\n\n" +
                 "I hope this Christmas brings you so much joy and happiness. Enjoy this special day with lots of laughter, love, and of course, great food! Wishing you all the best for the holidays and beyond.\n\n" +
                 "I truly hope that someday we can meet in person. For now, enjoy your Christmas and make it unforgettable!\n\n" +
                 "- Yuu";
    const typingText = document.querySelector('.typing-text');
    let i = 0;
    
    function type() {
        if (i < text.length) {
            typingText.innerHTML += text.charAt(i) === '\n' ? '<br>' : text.charAt(i);
            i++;
            setTimeout(type, 50);
        }
    }
    type();
}




// Utility Functions
function playSound(soundId) {
    const sound = document.getElementById(soundId);
    sound.currentTime = 0;
    sound.play();
}

function createSparkles(x, y) {
    for (let i = 0; i < 10; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = `${x}px`;
        sparkle.style.top = `${y}px`;
        sparkle.style.setProperty('--angle', `${Math.random() * 360}deg`);
        document.body.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 1000);
    }
}

function toggleGames() {
    document.querySelector('.games-panel').classList.toggle('hidden');
}

// Event Listeners Setup
function setupEventListeners() {
    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);
}

function handleResize() {
    // Adjust positions of elements if needed
    const tree = document.querySelector('.christmas-tree');
    if (tree) {
        const ornaments = tree.querySelectorAll('.tree-ornament');
        ornaments.forEach(ornament => {
            // Recalculate positions based on new dimensions
            const rect = tree.getBoundingClientRect();
            const x = parseFloat(ornament.style.left);
            const y = parseFloat(ornament.style.top);
            ornament.style.left = `${(x / rect.width) * 100}%`;
            ornament.style.top = `${(y / rect.height) * 100}%`;
        });
    }
}

function handleVisibilityChange() {
    if (document.hidden) {
        audioPlayer.pause();
    }
}

// Fungsi untuk memutar musik
function playChristmasMusic() {
    const music = document.getElementById('christmasMusic');
    if (music.paused) {
        music.play();
        event.target.textContent = "🔇 Stop Music";
    } else {
        music.pause();
        music.currentTime = 0;
        event.target.textContent = "🎵 Play Music";
    }
}

// Fungsi untuk efek salju
function showSnowEffect() {
    if (!document.querySelector('.snowfall-js')) {
        const snowContainer = document.createElement('div');
        snowContainer.className = 'snowfall-js';
        document.body.appendChild(snowContainer);
        
        for (let i = 0; i < 50; i++) {
            createSnowflake();
        }
    }
}

function createSnowflake() {
    const snowflake = document.createElement('div');
    snowflake.className = 'snowflake';
    snowflake.style.left = Math.random() * 100 + 'vw';
    snowflake.style.animationDuration = (Math.random() * 3 + 2) + 's';
    snowflake.style.opacity = Math.random();
    snowflake.innerHTML = '❄';
    
    document.querySelector('.snowfall-js').appendChild(snowflake);
    
    // Hapus snowflake setelah animasi selesai
    setTimeout(() => {
        snowflake.remove();
    }, 5000);
}

// Fungsi untuk efek hati
function createHearts() {
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            createHeart();
        }, i * 100);
    }
}

function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.innerHTML = '💖';
    heart.style.left = Math.random() * 100 + 'vw';
    document.body.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 2000);
}