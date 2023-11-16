// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-analytics.js";
import { collection, getDocs, getFirestore } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCIo5cgljinIJaY-RuohTB-sle-V3HtxWU",
    authDomain: "enfantreveur-dbb7b.firebaseapp.com",
    projectId: "enfantreveur-dbb7b",
    storageBucket: "enfantreveur-dbb7b.appspot.com",
    messagingSenderId: "242913873573",
    appId: "1:242913873573:web:7270b070fb462b2cf5074c",
    measurementId: "G-R8JVLC43SZ"
};
function timestampToDateTime(timestamp) {
    const dateObj = new Date(timestamp * 1000); // 초 단위 타임스탬프를 밀리초 단위로 변환

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1 해줍니다.
    const day = String(dateObj.getDate()).padStart(2, '0');
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    const seconds = String(dateObj.getSeconds()).padStart(2, '0');

    return `${year}.${month}.${day}.`;
}
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

const data_list = []
const querySnapshot = await getDocs(collection(db, "announcement"));
querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    // console.log(doc.id, " => ", doc.data());
    var data = doc.data();
    data_list.push(data)
});
data_list.sort(function (a, b) {
    return a.id - b.id;
})
data_list.sort(function(a,b){
    if(a.important && !b.important){
        return 1;
    }else if(!a.important && b.important){
        return -1;
    }else{
        return 0;
    }
})
var revdata = data_list.slice().reverse();
// console.log(revdata);
const filteredData = revdata.filter(item => item.display === true);

var itemsPerPage = 10;
var currentPage = 1;

function displayData() {
    const info_container = document.getElementById('tables');
    const mobile_container = document.getElementById('moblie_tables');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = filteredData.slice(startIndex, endIndex);
    console.log(currentData)

    while (info_container.firstChild) {
        info_container.removeChild(info_container.firstChild);
        mobile_container.removeChild(mobile_container.firstChild)

    }
    for (var i = 0; i < currentData.length; i++) {
        const divElement = document.createElement('div');
        divElement.className = 'table_garo';

        const id = document.createElement('p');
        id.textContent = currentData[i].id;
        id.className = 'id';
        divElement.appendChild(id);

        const title = document.createElement('a');
        if(currentData[i].important == true){
            divElement.classList.add('important')
            title.textContent = '[공지] '+currentData[i].title;
        }else{
            title.textContent = currentData[i].title;
        }
        title.className = 'title';
        title.href = `./view/?id=${currentData[i].id}`
        divElement.appendChild(title);

        const author = document.createElement('p');
        author.textContent = currentData[i].author;
        author.className = 'author';
        divElement.appendChild(author);

        const pressTime = document.createElement('p');
        pressTime.textContent = timestampToDateTime((currentData[i].pressTime).seconds)
        pressTime.className = 'pressTime';
        divElement.appendChild(pressTime);

        const view = document.createElement('p');
        view.textContent = currentData[i].view;
        view.className = 'view';
        divElement.appendChild(view);

        info_container.append(divElement);

        //모바일

        const mobileElement = document.createElement('div');
        mobileElement.className = 'mobile_garo';
        const moblink = document.createElement('a')
        moblink.href = './view.html?id=' + currentData[i].id

        const mob_title = document.createElement('h4');if(currentData[i].important == true){
            mobileElement.classList.add('important')
            mob_title.textContent = '[공지] '+currentData[i].title;
        }else{
            mob_title   .textContent = currentData[i].title;
        }
        mob_title.className = 'mob_title';
        moblink.appendChild(mob_title);

        const mob_info = document.createElement('div');
        const mob_author = document.createElement('p');
        mob_author.textContent = currentData[i].author;
        mob_author.className = 'mob_author';
        mob_info.appendChild(mob_author);

        const mob_pressTime = document.createElement('p');
        mob_pressTime.textContent = timestampToDateTime((currentData[i].pressTime).seconds);
        mob_pressTime.className = 'mob_pressTime';
        mob_info.appendChild(mob_pressTime);

        const mob_view = document.createElement('p');
        mob_view.textContent = currentData[i].view;
        mob_view.className = 'mob_view';
        mob_info.appendChild(mob_view);

        moblink.appendChild(mob_info);
        mobileElement.appendChild(moblink)
        mobile_container.append(mobileElement)
    }
}
function updatePagination() {
    const paginationContainer = document.getElementById('pagination');
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    while (paginationContainer.firstChild) {
        paginationContainer.removeChild(paginationContainer.firstChild);
    }
    const prevLink = document.createElement('a');
    prevLink.textContent = '< 이전';
    prevLink.href = '#';
    prevLink.className = 'befaf'
    prevLink.addEventListener('click', function (event) {
        event.preventDefault();
        if(currentPage >1 ){
            currentPage--;
            displayData();
            updatePagination();
        }else{
            alert('이전 페이지를 찾을 수 없습니다.')
        }
    });
    paginationContainer.appendChild(prevLink);

    for (var i = 1; i <= totalPages; i++) {
        const pageLink = document.createElement('a');
        pageLink.textContent = i;
        pageLink.href = '#';
        pageLink.addEventListener("click", (function (page) {
            return function (event) {
                event.preventDefault();
                currentPage = page;
                displayData();
                updatePagination();
            }
        })(i));

        if (i === currentPage) {
            pageLink.className = 'active';
        }

        paginationContainer.appendChild(pageLink)
    }
    const nextLink = document.createElement('a');
    nextLink.textContent = '다음 >';
    nextLink.href = '#';
    nextLink.className = 'befaf'
    nextLink.addEventListener('click', function (event) {
        event.preventDefault();
        if(currentPage < totalPages){
            currentPage++;
            displayData();
            updatePagination();
        }else{
            alert('다음 페이지를 찾을 수 없습니다.')
        }
    });
    paginationContainer.appendChild(nextLink);
}

displayData();
updatePagination();