// header container
var bar = document.getElementById('header');

var logoBoxLink = document.createElement('a');
logoBoxLink.href = '/';
logoBoxLink.className = 'headerLogoBox';

var logoLeft = document.createElement('img');
logoLeft.src = '/src/img/logo/logo_left.png';
logoLeft.className = 'headerLogoLeft';
logoBoxLink.appendChild(logoLeft);

var logoRight = document.createElement('img');
logoRight.src = '/src/img/logo/logo_right.png';
logoRight.className = 'headerLogoRight';
logoBoxLink.appendChild(logoRight);

bar.appendChild(logoBoxLink);

var hamburger = document.createElement('div');
hamburger.className = 'hamburger';

for (let i = 0; i < 3; i++) {
    var line = document.createElement('span');
    hamburger.appendChild(line);
}

bar.appendChild(hamburger);

var headerMenu = null;

function openMenu() {
    headerMenu.classList.add('active');
    hamburger.classList.add('active');
}

function closeMenu() {
    headerMenu.classList.remove('active');
    hamburger.classList.remove('active');
}

function toggleMenu() {
    headerMenu.classList.contains('active') ? closeMenu() : openMenu();
}

fetch('/src/js/navbar/navbar.json')
    .then(res => res.json())
    .then(jsonData => {
        headerMenu = document.createElement('div');
        headerMenu.className = 'headerMenuBar';

        jsonData.items.forEach(item => {
            var link = document.createElement('a');
            link.textContent = item.title;
            link.href = item.link;
            link.className = 'headerMenuBarItem';
            headerMenu.appendChild(link);
        });

        var ask = document.createElement('a');
        ask.textContent = '문의하기';
        ask.href = '/contact/';
        ask.className = 'headerAsk';
        headerMenu.appendChild(ask);

        bar.appendChild(headerMenu);

        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        headerMenu.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });

document.addEventListener('click', () => {
    if (!headerMenu) return;
    closeMenu();
});
