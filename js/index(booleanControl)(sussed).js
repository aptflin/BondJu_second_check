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
const gameRef = doc(db, "game", "session1");

async function changeRedStatu(){
    try {
        const docSnap = await getDoc(gameRef);
        if (docSnap.exists()) {
            let currentCount = docSnap.data().players["小紅"] || false;
            await updateDoc(gameRef, { "players.小紅": !currentCount });
            console.log("小紅的狀態已更新！");
        }
    } catch (error) {
        console.error("更新狀態時出錯:", error);
    }
} 

// 🎯 監聽 Firestore，隨時更新畫面
onSnapshot(gameRef,doc => {
    const players = doc.data().players;
    if (doc.exists) {
        console.log("目前狀態：", players);
        // ✅ 顯示小紅的準備狀態
        document.getElementById("status").innerText = 
        `小紅：${players["小紅"] ? "✅ 已準備" : "❌ 未準備"}`+
        `\n小藍：${players["小藍"] ? "✅ 已準備" : "❌ 未準備"}`+
        `\n小綠：${players["小綠"] ? "✅ 已準備" : "❌ 未準備"}`;
    }

    if (players["小紅"] && players["小藍"] && players["小綠"]) {
        setTimeout(() => {
            gameRef.update({
                "players.小紅": false,
                "players.小藍": false,
                "players.小綠": false
            }).then(() => {
                window.location.href = "play.html";
            });
        }, 2000);
    }
    
});

window.addEventListener("DOMContentLoaded", () => {
    document.getElementById("readyButton").addEventListener("click", changeRedStatu);
});