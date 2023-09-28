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
    console.log(doc.id, " => ", doc.data());
    var data = doc.data();
    data_list.push(data)
});
var revdata = data_list.slice().reverse();
for(var i=0; i < revdata.length; i++){
    const info_container = document.getElementById('tables');
    const mobile_container = document.getElementById('moblie_tables');
    if(revdata[i].display == true){
        const divElement = document.createElement('div');
        divElement.className = 'table_garo'
    
        const id = document.createElement('p');
        id.textContent = revdata[i].id;
        id.className = 'id';
        divElement.appendChild(id);
    
        const title = document.createElement('a');
        title.textContent = revdata[i].title;
        title.className = 'title';
        title.href = `./view.html?id=${revdata[i].id}`
        divElement.appendChild(title);
    
        const author = document.createElement('p');
        author.textContent = revdata[i].author;
        author.className = 'author';
        divElement.appendChild(author);
    
        const pressTime = document.createElement('p');
        pressTime.textContent = timestampToDateTime((revdata[i].pressTime).seconds)
        pressTime.className = 'pressTime';
        divElement.appendChild(pressTime);
        
        const view = document.createElement('p');
        view.textContent = revdata[i].view;
        view.className = 'view';
        divElement.appendChild(view);
    
        info_container.append(divElement);

        //모바일
        const mobileElement = document.createElement('div');
        mobileElement.className = 'mobile_garo';
        const moblink = document.createElement('a')
        moblink.href='./view.html?id=' + revdata[i].id

        const mob_title = document.createElement('h4');
        mob_title.textContent = revdata[i].title;
        mob_title.className = 'mob_title';
        moblink.appendChild(mob_title);

        const mob_info = document.createElement('div');
        const mob_author = document.createElement('p');
        mob_author.textContent = revdata[i].author;
        mob_author.className = 'mob_author';
        mob_info.appendChild(mob_author);

        const mob_pressTime = document.createElement('p');
        mob_pressTime.textContent = timestampToDateTime((revdata[i].pressTime).seconds);
        mob_pressTime.className = 'mob_pressTime';
        mob_info.appendChild(mob_pressTime);

        const mob_view = document.createElement('p');
        mob_view.textContent = revdata[i].view;
        mob_view.className = 'mob_view';
        mob_info.appendChild(mob_view);

        moblink.appendChild(mob_info);
        mobileElement.appendChild(moblink)
        mobile_container.append(mobileElement)
    }else{
        
    }
}
console.log(window.location.href)