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
export const ADMIN_PRIMARY = "anton@rcc.co.il";

// פונקציה להזרקת התפריט - מתוקנת ויציבה
export function injectNavbar() {
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            if (!window.location.pathname.includes('login.html') && !window.location.pathname.includes('register.html')) {
                window.location.href = 'login.html';
            }
            return;
        }

        let role = 'user';
        let isAdmin = (user.email === ADMIN_PRIMARY);

        // ניסיון למשוך תפקיד מ-Firestore בלי לתקוע את הדף
        try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                role = userDoc.data().role;
                if (role === 'admin') isAdmin = true;
            }
        } catch (e) {
            console.warn("לא הצלחתי למשוך תפקיד מ-Firestore, משתמש בהרשאות ברירת מחדל.");
        }

        // בניית התפריט - שימוש ב-flex רגיל למניעת היפוך
        const nav = document.createElement('nav');
        nav.className = "bg-slate-800 text-white p-4 flex justify-between items-center mb-6 shadow-md sticky top-0 z-50 px-8";
        nav.dir = "rtl"; // הבטחת כיוון עברית

        let links = `
            <a href="index.html" class="hover:text-blue-300 ml-5 font-medium">בית</a>
            <a href="incidents.html" class="hover:text-blue-300 ml-5 font-medium">קריאות</a>
        `;

        if (isAdmin) {
            links += `
                <a href="admin_users.html" class="text-orange-400 font-bold ml-5">ניהול משתמשים</a>
                <a href="eset_licenses.html" class="hover:text-blue-300 ml-5 font-medium">רישיונות</a>
            `;
        }

        if (isAdmin || role === 'tech') {
            links += `<a href="report.html" class="hover:text-blue-300 ml-5 font-medium">דוחות</a>`;
        }

        nav.innerHTML = `
            <div class="flex items-center">
                <div class="font-bold text-xl text-blue-400 ml-8 border-l border-slate-600 pl-4"> IT Mgmgt </div>
                <div class="flex items-center">${links}</div>
            </div>
            <div class="flex items-center gap-4">
                <span class="text-xs text-slate-400 hidden md:block">${user.email}</span>
                <button onclick="window.handleLogout()" class="bg-red-600/80 px-4 py-1 rounded text-sm hover:bg-red-700 transition">ניתוק</button>
            </div>
        `;

        // מונע כפילות של התפריט בטעינה מחדש
        const existingNav = document.querySelector('nav');
        if (existingNav) existingNav.remove();
        
        document.body.prepend(nav);
    });
}

window.handleLogout = () => signOut(auth).then(() => window.location.href = 'login.html');
