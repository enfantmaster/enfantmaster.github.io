const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
        navbar.classList.add('scroll'); // 스크롤이 발생하면 scroll 클래스 추가
    } else {
        navbar.classList.remove('scroll'); // 스크롤이 상단으로 이동하면 scroll 클래스 제거
    }
});

document.getElementById('menu_open_btn').addEventListener("click", function(){
    document.getElementById('menu').style='right:0px;'
})
document.getElementById('menu_close_btn').addEventListener("click", function(){
    document.getElementById('menu').style='right:-100vw;'
})