document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-gallery]").forEach(initGallery);
});

function initGallery(gallery) {
    const track = gallery.querySelector(".gallery-track");
    const slides = [...gallery.querySelectorAll(".slide")];
    const prev = gallery.querySelector(".prev");
    const next = gallery.querySelector(".next");
    const dotsWrap = gallery.querySelector(".gallery-dots");

    let index = 0;
    const total = slides.length;

    // dots 생성
    slides.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.addEventListener("click", () => goTo(i));
        dotsWrap.appendChild(dot);
    });

    const dots = [...dotsWrap.children];

    function update() {
        slides.forEach((slide, i) => {
            slide.classList.toggle("active", i === index);
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === index);
        });

        const slideWidth = slides[0].offsetWidth;
        const gap = parseFloat(getComputedStyle(track).gap || 0);

        const moveX = index * (slideWidth + gap);
        track.style.transform = `translateX(-${moveX}px)`;
    }

    function goTo(i) {
        index = (i + total) % total;
        update();
    }

    prev.addEventListener("click", () => goTo(index - 1));
    next.addEventListener("click", () => goTo(index + 1));

    // 📱 모바일 스와이프
    let startX = 0;

    track.addEventListener("touchstart", e => {
        startX = e.touches[0].clientX;
    });

    track.addEventListener("touchend", e => {
        const diff = startX - e.changedTouches[0].clientX;
        if (diff > 40) goTo(index + 1);
        if (diff < -40) goTo(index - 1);
    });

    update();
}
