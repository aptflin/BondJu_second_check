import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDt1jIxjPb-WRdGnGEBhA_HIiID_9IWFQU",
    authDomain: "bondju-73a92.firebaseapp.com",
    projectId: "bondju-73a92",
    storageBucket: "bondju-73a92.appspot.com",
    messagingSenderId: "995176908883",
    appId: "1:995176908883:web:6e4095bdff9cfa55e1dea6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const roomRef = doc(db, "game", "session1");

// 📌 更新 readyCount
async function increaseReadyCount() {
    try {
        const docSnap = await getDoc(roomRef);
        if (docSnap.exists()) {
            let currentCount = docSnap.data().readycount || 0;
            if (currentCount < 3) {
                await updateDoc(roomRef, { readycount: currentCount + 1 });

                // 🔒 禁用按鈕，防止重複點擊
                document.getElementById("readyButton").disabled = true;
                document.getElementById("readyButton").innerText = "已準備";
                document.getElementById("readyButton").style.backgroundColor = "gray";
                document.getElementById("status").innerText = "已準備，等待其他人...";
            }else{

            }
        }
    } catch (error) {
        console.error("更新 readycount 時出錯:", error);
    }
}

// 🔄 監聽 Firestore 變化
onSnapshot(roomRef, async (docSnap) => {
    if (docSnap.exists()) {
        const readyCount = docSnap.data().readycount || 0;
        document.getElementById("countDisplay").innerText = `目前準備人數: ${readyCount}/3`;

        // 🎯 當人數達到 3，跳轉到 play.html 並歸零
        if (readyCount >= 3) {
            setTimeout(async () => {
                window.location.href = "play.html"; // 🚀 跳轉                
            }, 100);
            await updateDoc(roomRef, { readycount: 0 });
        }
    }
});

// 🔘 綁定按鈕點擊事件
window.addEventListener("DOMContentLoaded", () => {
    document.getElementById("readyButton").addEventListener("click", increaseReadyCount);
});