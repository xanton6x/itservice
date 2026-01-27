import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCkmi_WVVGk6PvIGoh8FEzXOyzzDN2jJqA",
  authDomain: "itservice-ef2cb.firebaseapp.com",
  projectId: "itservice-ef2cb",
  storageBucket: "itservice-ef2cb.firebasestorage.app",
  messagingSenderId: "585535831360",
  appId: "1:585535831360:web:8b84f53b6892a2fc490ea5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const ADMIN_EMAIL_PRIMARY = "anton@rcc.co.il"; // מנהל על

export function injectNavbar() {
    const nav = document.createElement('nav');
    nav.className = "bg-slate-800 text-white p-4 flex justify-between items-center mb-6 shadow-md sticky top-0 z-50 flex-row-reverse";
    nav.innerHTML = `
        <div class="font-bold text-xl text-blue-400">IT SYSTEM</div>
        <div class="space-x-4 flex space-x-reverse" id="navLinks">
            <a href="index.html" class="hover:text-blue-300 px-3">בית</a>
            <a href="user_portal.html" class="hover:text-blue-300 px-3">פתיחת קריאה</a>
            <a href="incidents.html" class="hover:text-blue-300 px-3">קריאות</a>
            <button onclick="window.handleLogout()" class="bg-red-600 px-3 py-1 rounded hover:bg-red-700 mr-4">ניתוק</button>
        </div>
    `;
    document.body.prepend(nav);

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            // בדיקה ב-Firestore מה התפקיד של המשתמש
            const userDoc = await getDoc(doc(db, "users", user.uid));
            const userData = userDoc.data();
            
            if (user.email === ADMIN_EMAIL_PRIMARY || (userData && userData.role === 'admin')) {
                const navLinks = document.getElementById('navLinks');
                // הוספת כפתורים למנהל בלבד
                navLinks.insertAdjacentHTML('afterbegin', `
                    <a href="admin_users.html" class="text-orange-400 font-bold px-3">ניהול משתמשים</a>
                    <a href="eset_licenses.html" class="hover:text-blue-300 px-3">רישיונות</a>
                    <a href="report.html" class="hover:text-blue-300 px-3">דוחות</a>
                `);
            }
        }
    });
}

window.handleLogout = () => signOut(auth).then(() => window.location.href = 'login.html');