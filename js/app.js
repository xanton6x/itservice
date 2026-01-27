// פונקציה להזרקת התפריט לכל דף באופן אוטומטי
export function injectNavbar() {
    const user = auth.currentUser;
    // הגדרת המנהל הראשי (נשלף מהזיכרון שלנו)
    const ADMIN_PRIMARY = 'anton@rcc.co.il'; 
    const isAdmin = user && user.email === ADMIN_PRIMARY;

    const navHtml = `
    <nav class="bg-slate-900 text-white shadow-xl mb-6 sticky top-0 z-[100]">
        <div class="max-w-6xl mx-auto px-4">
            <div class="flex justify-between items-center h-16">
                
                <div class="flex items-center gap-3">
                    <div class="bg-blue-600 p-2 rounded-lg shadow-inner">
                        <i class="fas fa-tools text-white text-xl"></i>
                    </div>
                    <div class="flex flex-col">
                        <span class="font-black text-lg leading-none tracking-tight">RCC <span class="text-blue-400">IT</span></span>
                        <span class="text-[10px] text-slate-400 font-medium">${user ? user.email : 'אורח'}</span>
                    </div>
                </div>

                <div class="hidden md:flex items-center gap-8 font-bold text-sm">
                    <a href="dashboard.html" class="flex items-center gap-2 hover:text-blue-400 transition-colors group">
                        <i class="fas fa-list-ul text-slate-400 group-hover:text-blue-400"></i>
                        קריאות שירות
                    </a>
                    
                    ${isAdmin ? `
                    <a href="users.html" class="flex items-center gap-2 hover:text-blue-400 transition-colors group">
                        <i class="fas fa-users-cog text-slate-400 group-hover:text-blue-400"></i>
                        ניהול משתמשים
                    </a>
                    ` : ''}

                    <div class="h-6 w-[1px] bg-slate-700 mx-2"></div>

                    <button onclick="handleLogout()" class="text-slate-400 hover:text-red-400 transition-colors flex items-center gap-2">
                        <span>יציאה</span>
                        <i class="fas fa-power-off"></i>
                    </button>
                </div>

                <div class="md:hidden flex items-center">
                    <button id="mobile-menu-button" class="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors">
                        <i class="fas fa-bars text-xl" id="menu-icon"></i>
                    </button>
                </div>
            </div>
        </div>

        <div id="mobile-menu" class="hidden md:hidden bg-slate-800 border-t border-slate-700 animate-fade-in-down">
            <div class="px-4 py-6 space-y-4 shadow-2xl">
                <a href="dashboard.html" class="flex items-center gap-4 py-3 px-4 bg-slate-700/50 rounded-xl hover:bg-slate-700">
                    <i class="fas fa-list-ul text-blue-400 w-5"></i>
                    <span class="font-bold">קריאות שירות</span>
                </a>

                ${isAdmin ? `
                <a href="users.html" class="flex items-center gap-4 py-3 px-4 bg-slate-700/50 rounded-xl hover:bg-slate-700">
                    <i class="fas fa-users-cog text-purple-400 w-5"></i>
                    <span class="font-bold">ניהול משתמשים</span>
                </a>
                ` : ''}

                <button onclick="handleLogout()" class="w-full flex items-center gap-4 py-4 px-4 text-red-400 font-bold border-t border-slate-700 mt-4">
                    <i class="fas fa-power-off w-5"></i>
                    <span>התנתקות מהמערכת</span>
                </button>
            </div>
        </div>
    </nav>
    <style>
        @keyframes fade-in-down {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down { animation: fade-in-down 0.2s ease-out; }
    </style>
    `;

    // הזרקה לתחילת ה-body
    document.body.insertAdjacentHTML('afterbegin', navHtml);

    // לוגיקה לפתיחה וסגירה של ההמבורגר
    const menuBtn = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.contains('hidden');
            if (isHidden) {
                mobileMenu.classList.remove('hidden');
                menuIcon.classList.replace('fa-bars', 'fa-times');
            } else {
                mobileMenu.classList.add('hidden');
                menuIcon.classList.replace('fa-times', 'fa-bars');
            }
        });
    }
}

// פונקציית יציאה מסודרת
window.handleLogout = async () => {
    if(confirm("בטוח שברצונך לצאת?")) {
        try {
            await auth.signOut();
            window.location.href = 'login.html';
        } catch (e) {
            console.error("Logout error", e);
        }
    }
};
