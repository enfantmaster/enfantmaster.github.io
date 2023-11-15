import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
const firebaseConfig = {
    apiKey: "AIzaSyCIo5cgljinIJaY-RuohTB-sle-V3HtxWU",
    authDomain: "enfantreveur-dbb7b.firebaseapp.com",
    projectId: "enfantreveur-dbb7b",
    storageBucket: "enfantreveur-dbb7b.appspot.com",
    messagingSenderId: "242913873573",
    appId: "1:242913873573:web:7270b070fb462b2cf5074c",
    measurementId: "G-R8JVLC43SZ"
};
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { collection, getDocs, getFirestore, setDoc,doc,updateDoc } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, uploadBytesResumable } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-storage.js";
function generateRandomKey(length) {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomKey = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        randomKey += charset[randomIndex];
    }
    return randomKey;
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
var last_id;
const images = []; // 업로드된 이미지 키(파일명) 목록
function uploadFiles() {
    const fileInput = document.getElementById('fileInput');
    const files = fileInput.files; // 여러 파일 선택

    const storage = getStorage();

    // 여러 파일에 대한 업로드 프로세스
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const key = generateRandomKey(7);
        const storageRef = ref(storage, key);
        images.push(key);

        // 파일 업로드
        uploadBytes(storageRef, file)
            .then((snapshot) => {
                console.log(`Uploaded file ${i + 1}: ${key}`);
                if (images.length === files.length) {
                    // 모든 파일이 업로드되면 추가 작업 수행
                    document.getElementById('stat').textContent = `${i+1}번째 파일의 업로드가 완료됨.`
                }
            })
            .catch((error) => {
                console.error(`파일 업로드 오류 (${i + 1}): ${error.message}`);
            }); 
    }
}

var user_key
document.getElementById('go_login').addEventListener("click", async function () {
    var email = document.getElementById('email_value').value;
    var password = document.getElementById('password_value').value;
    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log(user)
            // ...
            user_key = userCredential.user.uid;
            console.log(user_key);
            document.getElementById('afterpage').style = 'display:block;'
            document.getElementById('login').style='display:none;'
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorCode, errorMessage)
        });


})
document.getElementById('upload').addEventListener('click', async function () {
    const querySnapshot = await getDocs(collection(db, "announcement"));
    const data_list = []
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        var data = doc.data();
        data_list.push(data)
    });
    data_list.sort(function(a,b){
        return a.id - b.id;
    })
    for(var i = 0; i<data_list.length; i++){
        last_id = data_list[i].id
    }
    console.log(last_id)
    last_id += 1;
    console.log(last_id)
    var text = document.getElementById('content').value;

    console.log(text);
    var selectedValue = document.querySelector('input[name="important"]:checked').value;
    var importance
    if(selectedValue == 'true'){
        importance = true;
    }else{
        importance = false;
    }
    const lines = text.split('\n');
    console.log(lines); // 줄바꿈을 기준으로 분할된 문자열 배열
    if(user_key){
        console.log('인증됨')
        setDoc(doc(db, "announcement", last_id.toString()), {
            id: last_id,
            pressTime: new Date(),
            author: document.getElementById('author_value').value,
            title: document.getElementById('title_value').value,
            content: lines,
            images: images,
            view: 0,
            display: true,
            important: importance
        });
        setTimeout(function(){
            alert('등록되었습니다.')
        },2000)
    }else{
        alert('로그인 필요')
    }
})
document.getElementById('img_up').addEventListener("click", function () {
    uploadFiles()
})
document.getElementById('go_delete').addEventListener("click", async function(){
    var del = confirm(`정말 삭제하시겠습니까?`)
    if(del){
        if(user_key){
            var del_id = document.getElementById('delete_val').value;
            try{
                const view_data = doc(db, 'announcement', del_id);
                updateDoc(view_data, { display:false });
            }catch(error){
                alert('삭제에 실패했습니다. ID를 다시한번 확인해주세요')
                console.log(error)
            }
        }else{
            alert('로그인 필요')
        }
    }
})