import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// הגדרות Firebase
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

// פונקציה להזרקת התפריט לכל דף
export function injectNavbar() {
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            if (!window.location.pathname.includes('login.html') && !window.location.pathname.includes('register.html')) {
                window.location.href = 'login.html';
            }
            return;
        }

        if (document.getElementById('main-nav')) return;

        let role = 'user';
        let isAdmin = (user.email === ADMIN_PRIMARY);

        try {
            const userDoc = await getDoc(doc(db, "users", user.email));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                role = userData.role;
                if (role === 'admin') isAdmin = true;
            }
        } catch (e) {
            console.warn("שגיאה במשיכת הרשאות, משתמש בהרשאות ברירת מחדל.");
        }

        // בניית הלינקים - הוספת logic ודאי עבור אנטון
        const generateLinks = (isMobile = false) => {
            const linkClass = isMobile 
                ? "block py-3 px-4 text-slate-200 hover:bg-slate-700 hover:text-white rounded-lg transition-all" 
                : "hover:text-blue-400 font-medium transition-colors ml-6";
            
            let html = `<a href="index.html" class="${linkClass}">בית</a>`;
            html += `<a href="incidents.html" class="${linkClass}">קריאות</a>`;
            
            // תנאי גישה למנהל: אימייל של אנטון או תפקיד אדמין ב-DB
            if (isAdmin || user.email === ADMIN_PRIMARY) {
                html += `<a href="database.html" class="${isMobile ? linkClass : 'text-indigo-400 font-bold ml-6'}"><i class="fas fa-database ml-1 text-[10px]"></i> ניהול DB</a>`;
                html += `<a href="admin_users.html" class="${isMobile ? linkClass : 'text-orange-400 font-bold ml-6'}">משתמשים</a>`;
                html += `<a href="eset_licenses.html" class="${linkClass}">רישיונות</a>`;
            }
            
            if (isAdmin || role === 'tech' || user.email === ADMIN_PRIMARY) {
                html += `<a href="report.html" class="${linkClass}">דוחות</a>`;
            }
            return html;
        };

        const navHtml = `
        <nav id="main-nav" class="bg-slate-900 text-white shadow-xl sticky top-0 z-[100]" dir="rtl">
            <div class="max-w-7xl mx-auto px-4 md:px-8">
                <div class="flex justify-between items-center h-16">
                    <div class="flex items-center">
                        <div class="font-black text-xl text-blue-400 ml-8 border-l border-slate-700 pl-4 tracking-tighter uppercase">
                            IT MGMT
                        </div>
                        <div class="hidden md:flex items-center">
                            ${generateLinks(false)}
                        </div>
                    </div>

                    <div class="flex items-center gap-4">
                        <button onclick="document.body.classList.toggle('dark')" class="p-2 text-slate-400 hover:text-yellow-400 transition-colors" title="מצב לילה/יום">
                            <i class="fas fa-moon"></i>
                        </button>

                        <div class="hidden lg:flex flex-col text-left items-end ml-4">
                            <span class="text-[10px] text-slate-400 font-mono tracking-wide">${user.email}</span>
                        </div>
                        
                        <button onclick="window.handleLogout()" class="hidden md:block bg-red-600/90 hover:bg-red-700 px-4 py-1.5 rounded-lg text-sm font-bold transition-all shadow-lg active:scale-95">
                            ניתוק
                        </button>

                        <button id="mobile-btn" class="md:hidden p-2 rounded-lg hover:bg-slate-800 transition-colors">
                            <i class="fas fa-bars text-xl" id="menu-icon"></i>
                        </button>
                    </div>
                </div>
            </div>

            <div id="mobile-menu" class="hidden md:hidden bg-slate-800 border-t border-slate-700 overflow-hidden transition-all duration-300">
                <div class="px-4 py-6 space-y-2">
                    ${generateLinks(true)}
                    <hr class="border-slate-700 my-4">
                    <div class="flex items-center justify-between px-4">
                         <span class="text-xs text-slate-500">${user.email}</span>
                         <button onclick="window.handleLogout()" class="text-red-400 font-bold text-sm">התנתקות</button>
                    </div>
                </div>
            </div>
        </nav>
        <style>
            #mobile-menu:not(.hidden) { animation: slideDown 0.3s ease-out; }
            @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
            
            /* הגדרות Dark Mode גלובליות */
            body.dark { background-color: #0f172a !important; color: #f1f5f9 !important; }
            body.dark .bg-white { background-color: #1e293b !important; color: #f1f5f9 !important; }
            body.dark .text-slate-800, body.dark .text-slate-700 { color: #f1f5f9 !important; }
            body.dark .border, body.dark .border-slate-200 { border-color: #334155 !important; }
            body.dark input, body.dark select, body.dark textarea { 
                background-color: #0f172a !important; 
                color: white !important; 
                border-color: #475569 !important; 
            }
        </style>
        `;

        document.body.insertAdjacentHTML('afterbegin', navHtml);

        // לוגיקה לתפריט מובייל
        const mobileBtn = document.getElementById('mobile-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        const menuIcon = document.getElementById('menu-icon');

        if (mobileBtn) {
            mobileBtn.addEventListener('click', () => {
                const isHidden = mobileMenu.classList.toggle('hidden');
                menuIcon.className = isHidden ? "fas fa-bars text-xl" : "fas fa-times text-xl";
            });
        }
    });
}

window.handleLogout = () => {
    if (confirm("בטוח שברצונך להתנתק?")) {
        signOut(auth).then(() => {
            window.location.href = 'login.html';
        }).catch(err => console.error("Logout error", err));
    }
};