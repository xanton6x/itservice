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

        try {
            const userDoc = await getDoc(doc(db, "users", user.email)); // שים לב: בדרך כלל משתמשים ב-email כ-ID אם כך שמרת, או user.uid
            if (userDoc.exists()) {
                role = userDoc.data().role;
                if (role === 'admin') isAdmin = true;
            }
        } catch (e) { console.warn("Error fetching role"); }

        // בניית הלינקים
        let links = `
            <a href="index.html" class="block md:inline-block hover:text-blue-300 py-2 md:py-0 md:ml-5 font-medium">בית</a>
            <a href="incidents.html" class="block md:inline-block hover:text-blue-300 py-2 md:py-0 md:ml-5 font-medium">קריאות</a>
        `;
        if (isAdmin) {
            links += `
                <a href="admin_users.html" class="block md:inline-block text-orange-400 font-bold py-2 md:py-0 md:ml-5">ניהול משתמשים</a>
                <a href="eset_licenses.html" class="block md:inline-block hover:text-blue-300 py-2 md:py-0 md:ml-5 font-medium">רישיונות</a>
            `;
        }
        if (isAdmin || role === 'tech') {
            links += `<a href="report.html" class="block md:inline-block hover:text-blue-300 py-2 md:py-0 md:ml-5 font-medium">דוחות</a>`;
        }

        // יצירת ה-HTML של ה-Navbar
        const navContainer = document.createElement('div');
        navContainer.innerHTML = `
        <nav class="bg-slate-900 text-white shadow-xl sticky top-0 z-[100]" dir="rtl">
            <div class="max-w-7xl mx-auto px-4 md:px-8">
                <div class="flex justify-between items-center h-16">
                    <div class="flex items-center">
                        <div class="font-black text-xl text-blue-400 ml-6 md:ml-8 border-l border-slate-700 pl-4 uppercase tracking-wider">IT Mgmt</div>
                        <div class="hidden md:flex items-center">${links}</div>
                    </div>

                    <div class="flex items-center gap-4">
                        <span class="text-xs text-slate-400 hidden lg:block">${user.email}</span>
                        <button onclick="window.handleLogout()" class="hidden md:block bg-red-600/80 px-4 py-1.5 rounded-lg text-sm hover:bg-red-700 transition font-bold">ניתוק</button>
                        
                        <button onclick="window.toggleMobileMenu()" class="md:hidden p-2 rounded-lg hover:bg-slate-800 transition">
                            <i class="fas fa-bars text-xl" id="menu-icon"></i>
                        </button>
                    </div>
                </div>
            </div>

            <div id="mobile-menu" class="hidden md:hidden bg-slate-800 border-t border-slate-700 p-4 space-y-2 animate-fade-in">
                ${links}
                <hr class="border-slate-700 my-2">
                <div class="flex justify-between items-center pt-2">
                    <span class="text-xs text-slate-400">${user.email}</span>
                    <button onclick="window.handleLogout()" class="bg-red-600 px-4 py-2 rounded text-sm font-bold">ניתוק מהמערכת</button>
                </div>
            </div>
        </nav>
        <style>
            @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
            .animate-fade-in { animation: fadeIn 0.2s ease-out; }
        </style>
        `;

        const existingNav = document.querySelector('nav');
        if (existingNav) existingNav.remove();
        document.body.prepend(navContainer.firstElementChild);
    });
}

// פונקציות גלובליות לשליטה מה-HTML
window.toggleMobileMenu = () => {
    const menu = document.getElementById('mobile-menu');
    const icon = document.getElementById('menu-icon');
    const isHidden = menu.classList.toggle('hidden');
    icon.classList.toggle('fa-bars', isHidden);
    icon.classList.toggle('fa-times', !isHidden);
};

window.handleLogout = () => {
    if(confirm("בטוח שברצונך להתנתק?")) {
        signOut(auth).then(() => window.location.href = 'login.html');
    }
};
