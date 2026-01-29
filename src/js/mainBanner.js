const images = [
    './src/img/banner/banner1.jpg',
    './src/img/banner/banner2.jpg',
    './src/img/banner/banner3.jpg'
];

const intervalTime = 4000;

const bannerTrack = document.getElementById('bannerTrack');
const indicatorBox = document.getElementById('bannerIndicators');

let currentIndex = 0;
let timer = null;
const indicators = [];

images.forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    bannerTrack.appendChild(img);
});

images.forEach((_, index) => {
    const dot = document.createElement('span');

    if (index === 0) dot.classList.add('active');

    dot.addEventListener('click', () => {
        moveTo(index);
        resetTimer();
    });

    indicatorBox.appendChild(dot);
    indicators.push(dot);
});

function moveTo(index) {
    currentIndex = index;
    bannerTrack.style.transform = `translateX(-${index * 100}%)`;
    updateIndicators();
}

function nextImage() {
    moveTo((currentIndex + 1) % images.length);
}

function updateIndicators() {
    indicators.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
    });
}

function startTimer() {
    timer = setInterval(nextImage, intervalTime);
}

function resetTimer() {
    clearInterval(timer);
    startTimer();
}

startTimer();
