function img_one(){
    document.querySelector('.container').style.transform = 'translate(0vw)'
    document.getElementById('btn1').style='background-color:white;width:70px;height:10px;'
    document.getElementById('btn2').style='height:7px; width:50px; background-color: rgb(159, 159, 159);'
    document.getElementById('btn3').style='height:7px; width:50px; background-color: rgb(159, 159, 159);'
}
function img_two(){
    document.querySelector('.container').style.transform = 'translate(-100vw)';
    document.getElementById('btn2').style='background-color:white;width:70px;height:10px;'
    document.getElementById('btn1').style='height:7px; width:50px; background-color: rgb(159, 159, 159);'
    document.getElementById('btn3').style='height:7px; width:50px; background-color: rgb(159, 159, 159);'
}
function img_three(){
    document.querySelector('.container').style.transform = 'translate(-200vw)'
    document.getElementById('btn3').style='background-color:white;width:70px;height:10px;'
    document.getElementById('btn1').style='height:7px; width:50px; background-color: rgb(159, 159, 159);'
    document.getElementById('btn2').style='height:7px; width:50px; background-color: rgb(159, 159, 159);'
}
document.getElementById('btn2').addEventListener("click", function(){
    img_two()
});
document.getElementById('btn3').addEventListener("click", function(){
    img_three()
});
document.getElementById('btn1').addEventListener("click", function(){
    img_one()
});

let currentFunction = 1; // 현재 실행할 함수를 나타내는 변수

// 5초마다 함수를 번갈아가며 실행
const interval = setInterval(() => {
    switch (currentFunction) {
        case 1:
            img_two();
            currentFunction = 2;
            break;
        case 2:
            img_three();
            currentFunction = 3;
            break;
        case 3:
            img_one();
            currentFunction = 1;
            break;
        default:
            break;
    }
}, 5000); // 5초(5000 밀리초) 간격으로 실행
