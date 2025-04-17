const memoryBoard = document.getElementById('memoryBoard');
const movesElement = document.getElementById('moves');
const restartButton = document.getElementById('restartButton');
const winModalOverlay = document.getElementById('winModalOverlay');
const winModalMessage = document.getElementById('winModalMessage');
const winModalButton = document.getElementById('winModalButton');

const cardEmojis = ['🍎', '🍌', '🍇', '🍉', '🍓', '🍒', '🍍', '🥝', '🍕', '🍔', '🍟', '🍩'];
let cards = [], firstCard = null, secondCard = null, lockBoard = false;
let moves = 0, matchedPairs = 0, pairColors = {};

function getRandomLightHexColor() {
    let color = '#';
    for (let i = 0; i < 3; i++) {
        const component = Math.floor(Math.random() * 128 + 128).toString(16).padStart(2, '0');
        color += component;
    }
    return color;
}

function getTextColorForBackground(hexColor) {
    const rgb = parseInt(hexColor.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luminance > 140 ? '#000000' : '#ffffff';
}

function setRandomBackgroundGradient() {
    const color1 = getRandomLightHexColor();
    const color2 = getRandomLightHexColor();
    const angle = Math.floor(Math.random() * 360);
    document.body.style.background = `linear-gradient(${angle}deg, ${color1}, ${color2})`;
}

function showWinModal() {
    winModalMessage.textContent = `Badhai Ho! Aapne ${moves} koshishon mein jeet liya! 🎉`;
    winModalOverlay.classList.add('visible');
}

function hideWinModal() {
    winModalOverlay.classList.remove('visible');
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createBoard() {
    setRandomBackgroundGradient();
    memoryBoard.innerHTML = '';
    cards = [];
    pairColors = {};
    firstCard = secondCard = null;
    lockBoard = false;
    moves = matchedPairs = 0;
    movesElement.textContent = moves;
    hideWinModal();

    cardEmojis.forEach(emoji => {
        pairColors[emoji] = getRandomLightHexColor();
    });

    const gameEmojis = shuffle([...cardEmojis, ...cardEmojis]);

    gameEmojis.forEach(emoji => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.emoji = emoji;
        const frontColor = pairColors[emoji];
        const textColor = getTextColorForBackground(frontColor);

        cardElement.innerHTML = `
            <div class="card-face card-back"></div>
            <div class="card-face card-front" style="background-color: ${frontColor}; color: ${textColor};">
                ${emoji}
            </div>
        `;
        cardElement.addEventListener('click', flipCard);
        memoryBoard.appendChild(cardElement);
        cards.push(cardElement);
    });
}

function flipCard() {
    if (lockBoard || this.classList.contains('flipped') || this === firstCard) return;
    this.classList.add('flipped');
    if (!firstCard) {
        firstCard = this;
        return;
    }
    secondCard = this;
    lockBoard = true;
    moves++;
    movesElement.textContent = moves;
    checkForMatch();
}

function checkForMatch() {
    const isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    matchedPairs++;
    resetBoard();
    if (matchedPairs === cardEmojis.length) {
        setTimeout(showWinModal, 500);
    }
}

function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

function restartGame() {
    createBoard();
}

restartButton.addEventListener('click', restartGame);
winModalButton.addEventListener('click', restartGame);
winModalOverlay.addEventListener('click', e => {
    if (e.target === winModalOverlay) hideWinModal();
});

createBoard();
