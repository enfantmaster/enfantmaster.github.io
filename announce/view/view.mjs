function getParameterByName(name) {
  var url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  var results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
var id = getParameterByName('id')
console.log(id);
if (id == null) {
  alert('해당 문서를 찾을 수 없습니다.')
  location.replace('../')
}

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-analytics.js";
import { doc, getFirestore, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";
import { getStorage, ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-storage.js";


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

  return `${year}.${month}.${day}. ${hours}:${minutes}`;
}
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const docRef = doc(db, "announcement", id);
const docSnap = await getDoc(docRef);
var view_num
if (docSnap.exists()) {
  console.log(docSnap.data())
  var data = docSnap.data();
  if (data.display == true) {
    document.getElementById('view_box_top_title').textContent = data.title;
    document.getElementById('author_name').textContent = data.author;
    document.getElementById('pressTime').textContent = timestampToDateTime((data.pressTime).seconds);
    view_num = parseInt(data.view);
    document.getElementById('view').textContent = '조회수: ' + (view_num + 1);
    const info_container = document.getElementById('view_content_box');
    const divElement = document.createElement('div');
    for (var i = 0; i < (data.content).length; i++) {
      const content = document.createElement('p');
      const text = data.content[i];
      const linkRegex = /(https?:\/\/[^\s]+)/g; // 링크를 감지하는 정규 표현식

      // 링크를 감지하여 <a> 태그로 변환하는 함수
      function replaceTextWithLinks(text) {
        return text.replace(linkRegex, '<a href="$1" target="_blank">$1</a>');
      }

      content.innerHTML = replaceTextWithLinks(text); // 링크를 변환한 HTML을 p 태그에 추가
      divElement.appendChild(content);
    }
    info_container.append(divElement);


    const storage = getStorage();
    const imgElement = document.createElement('div')
    if ((data.images).length != 0) {
      for (var i = 0; i < (data.images).length; i++) {
        getDownloadURL(ref(storage, data.images[i]))
          .then((url) => {
            const img = document.createElement('img');
            img.src = url;
            console.log(url)
            imgElement.appendChild(img)
          })
          .catch((error) => {
            // Handle any errors
          });
        info_container.append(imgElement);
      }
    }
    const view_data = doc(db, 'announcement', id);
    updateDoc(view_data, { view: view_num + 1 });
  }
  else {
    document.getElementById('view_box_top_title').textContent = '삭제되었거나 볼 수 없는 게시글입니다.';
  }
} else {
  alert('해당 문서를 찾을 수 없습니다.')
  location.replace('../')
}