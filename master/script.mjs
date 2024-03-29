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
import { collection, getDocs, getFirestore, setDoc,getDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";
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
function show_new_post(){
    document.getElementById('new_post_box').style = 'display: block;';
}
function hide_new_post(){
    document.getElementById('new_post_box').style = 'display: none;';
}
function show_cor_post(){
    document.getElementById('cor_post_box').style ='display: block;';
}
function hide_cor_post(){
    document.getElementById('cor_post_box').style = 'display: none;';
}
function show_del_post(){
    document.getElementById('del_post_box').style = 'display: block;';
}
function hide_del_post(){
    document.getElementById('del_post_box').style = 'display: none;';
}

document.getElementById('new_post').addEventListener('click', function(){
    show_new_post()
    hide_cor_post()
    hide_del_post()
})
document.getElementById('cor_post').addEventListener('click', function(){
    hide_new_post()
    show_cor_post()
    hide_del_post()
})
document.getElementById('del_post').addEventListener('click', function(){
    hide_new_post()
    hide_cor_post()
    show_del_post()
})

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
var last_id;
const images = []; // 업로드된 이미지 키(파일명) 목록
function uploadFilesSequentially(files, index = 0, text = '') {
    if (index < files.length) {
        const file = files[index];
        const storage = getStorage();
        const key = generateRandomKey(7);
        const storageRef = ref(storage, key);
        images.push(key);

        uploadBytes(storageRef, file)
            .then((snapshot) => {
                // console.log(`Uploaded file ${index + 1}: ${key}`);
                text += `${index + 1}번째 파일(${file.name})의 업로드가 완료됨.\n`;
                document.getElementById('stat').textContent = text;

                uploadFilesSequentially(files, index + 1, text);
            })
            .catch((error) => {
                console.error(`파일 업로드 오류 (${index + 1}): ${error.message}`);
            });
    }
}

function startUpload() {
    const fileInput = document.getElementById('fileInput');
    const files = fileInput.files; // 여러 파일 선택

    uploadFilesSequentially(files);
}

var user_key
var author_name
function login() {
    var email = document.getElementById('email_value').value;
    var password = document.getElementById('password_value').value;
    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            // Signed in 
            const user = userCredential.user;
            // console.log(user)
            // ...
            user_key = userCredential.user.uid;
            // console.log(user_key);
            document.getElementById('afterpage').style = 'display:block;'
            document.getElementById('login').style = 'display:none;'
            if (user_key == 'buZxGSOfSWZklk1p4HfPqVWZO5B3') {
                author_name = '앙팡리뵈어';
            }
            // console.log(author_name)
            document.getElementById('author').textContent = `작성자: ${author_name}`;
        })
        .catch((error) => {
            var errorCode = error.code;
            const errorMessage = error.message;
            alert(errorCode, errorMessage)
        });
}
document.getElementById('go_login').addEventListener("click", async function () {
    login()
})
document.getElementById('password_value').addEventListener('keypress', function (event) {
    const isPasswordInputFocused = (document.activeElement === document.getElementById('password_value'));
    if (isPasswordInputFocused && event.keyCode === 13) {
        login()
    }
})
document.getElementById('upload').addEventListener('click', async function () {
    const querySnapshot = await getDocs(collection(db, "announcement"));
    const data_list = []
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        var data = doc.data();
        data_list.push(data)
    });
    data_list.sort(function (a, b) {
        return a.id - b.id;
    })
    if (data_list.length == 0) {
        last_id = 0;
    } else {
        for (var i = 0; i < data_list.length; i++) {
            last_id = data_list[i].id
        }
    }
    // console.log(last_id)
    last_id = parseInt(last_id)
    console.log(typeof(last_id))
    last_id += 1;
    // console.log(last_id)
    var text = document.getElementById('content').value;

    // console.log(text);
    var selectedValue = document.querySelector('input[name="important"]:checked').value;
    var importance
    if (selectedValue == 'true') {
        importance = true;
    } else {
        importance = false;
    }
    const lines = text.split('\n');
    // console.log(lines); // 줄바꿈을 기준으로 분할된 문자열 배열
    if (user_key) {
        console.log('인증됨')
        setDoc(doc(db, "announcement", last_id.toString()), {
            id: last_id,
            pressTime: new Date(),
            author: author_name,
            title: document.getElementById('title_value').value,
            content: lines,
            images: images,
            view: 0,
            display: true,
            important: importance
        });
        setTimeout(function () {
            alert('등록되었습니다.')
        }, 2000)
    } else {
        alert('로그인 필요')
    }
})
document.getElementById('img_up').addEventListener("click", function () {
    startUpload()
})
document.getElementById('go_delete').addEventListener("click", async function () {
    var del = confirm(`정말 삭제하시겠습니까?`)
    if (del) {
        if (user_key) {
            var del_id = document.getElementById('delete_val').value;
            try {
                const view_data = doc(db, 'announcement', del_id);
                updateDoc(view_data, { display: false });
            } catch (error) {
                alert('삭제에 실패했습니다. ID를 다시한번 확인해주세요')
                console.log(error)
            }
        } else {
            alert('로그인 필요')
        }
    }
})
document.getElementById('cor_btn').addEventListener('click', async function(){
    var cor_id = document.getElementById('cor_val').value;
    // console.log(cor_id)
    const docRef = doc(db, "announcement", cor_id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        // console.log(docSnap.data())
        var data = docSnap.data();
        // console.log(data)

        document.getElementById('cor_title_value').value = data.title;
        const fieldset = document.getElementById('fieldset');
        const radios = fieldset.querySelectorAll('input[name="cor_important"]');
        if(data.important == true){
            radios[1].checked = true
        }else{
            radios[0].checked = true
        }
        const combinedString = (data.content).join('\n');
        document.getElementById('cor_content').value = combinedString;
        document.getElementById('cor_author').textContent = '작성자: '+data.author
        document.getElementById('cor_post_box_box').style= 'display:block;';

        document.getElementById('go_cor').addEventListener('click', function(){
            
            var cor_text = document.getElementById('cor_content').value;
            var cor_lines = cor_text.split('\n');
            var cor_selectedValue = document.querySelector('input[name="cor_important"]:checked').value;
            var cor_importance
            if (cor_selectedValue == 'true') {
                cor_importance = true;
            } else {
                cor_importance = false;
            }
            if (user_key) {
                console.log('인증됨')
                setDoc(doc(db, "announcement", cor_id), {
                    id: parseInt(cor_id),
                    pressTime: data.pressTime,
                    author: data.author,
                    title: document.getElementById('cor_title_value').value,
                    content: cor_lines,
                    images: data.images,
                    view: data.view,
                    display: true,
                    important: cor_importance
                });
                setTimeout(function () {
                    alert('등록되었습니다.')
                }, 2000)
            } else {
                alert('로그인 필요')
            }
        })
    }
})