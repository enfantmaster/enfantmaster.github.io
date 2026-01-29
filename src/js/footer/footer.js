var footer = document.getElementById('footer');

var footerImgBox = document.createElement('div');
footerImgBox.className = 'footerImgBox';
var logoImg = document.createElement('img')
logoImg.src = '/src/img/logo/text_logo.png';
footerImgBox.appendChild(logoImg);
footer.appendChild(footerImgBox);

var footerLinkBox = document.createElement('div');
footerLinkBox.className = 'footerLinkBox';

fetch('/src/js/footer/footer.json')
    .then(res => res.json())
    .then(jsonData => {
        jsonData.items.forEach(element => {
            var itemDiv = document.createElement('div');
            itemDiv.className = 'footerLinkItems';
            var itemsTitle = document.createElement('h4');
            itemsTitle.className = 'footerLinkItemsTitle';
            itemsTitle.textContent  = element.title;
            itemDiv.appendChild(itemsTitle);

            var itemBox = document.createElement('div');
            itemBox.className = 'footerLinkItemsBox';
            if(element.href == true){
                element.item.forEach(item => {
                    var text = document.createElement('a');
                    text.textContent = item.text;
                    if(item.type == 'tel'){
                        text.href = `tel:${item.link}`
                    }else if(item.type == 'email'){
                        text.href = `mailto:${item.link}`
                    }else{
                        text.href = item.link;
                        if(item.target) text.target = '_blank'
                    }

                    itemBox.appendChild(text)
                })
            }else{
                element.item.forEach(item => {

                    var text = document.createElement('p');
                    text.textContent = item.text;

                    itemBox.appendChild(text)
                })
            }
            itemDiv.appendChild(itemBox)

            footerLinkBox.appendChild(itemDiv)
        });
    })

footer.appendChild(footerLinkBox)

infoBox = document.createElement('div');
infoBox.className = 'footerInfoBox';

var texts = ['앙팡리뵈어학원', '원장: 정지윤', '사업자등록번호: 428-96-01724', '학원설립·운영등록번호: 6903 앙팡리뵈어 학원', '신고기관명: 서울특별시남부교육지원청']

texts.forEach(element => {
    var text = document.createElement('p');
    text.textContent = element;
    infoBox.appendChild(text)
});

footer.appendChild(infoBox)

footerBottom = document.createElement('p');
footerBottom.classList.add("footerBottom", "center");
footerBottom.textContent = 'Copyright 2024-2026. enfant rêveur all right reserved.'

footer.appendChild(footerBottom)
