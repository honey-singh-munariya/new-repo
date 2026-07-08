document.addEventListener('DOMContentLoaded', () => {

    const CONFIG = {
        animationSpeed: 2000,
        toastDuration: 3000,
    };

    const ToastSystem = {
        container: null,

        init() {
            this.container = document.createElement('div');
            this.container.id = 'toast-container';
            Object.assign(this.container.style, {
                position: 'fixed', top: '20px', right: '20px', zIndex: '9999'
            });
            document.body.appendChild(this.container);
        },

        show(message, type = 'info') {
            if (!this.container) this.init();

            const toast = document.createElement('div');

            let icon = 'fa-info-circle';
            let color = '#333';
            let border = '#333';

            if (type === 'success') { icon = 'fa-check-circle'; color = '#155724'; border = '#2e7d32'; }
            if (type === 'error') { icon = 'fa-exclamation-circle'; color = '#721c24'; border = '#c62828'; }

            Object.assign(toast.style, {
                background: 'white', color: color, padding: '15px 25px', marginTop: '10px',
                borderRadius: '8px', boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                display: 'flex', alignItems: 'center', gap: '10px',
                borderLeft: `5px solid ${border}`, minWidth: '250px',
                animation: 'slideIn 0.3s ease forwards'
            });

            toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
            this.container.appendChild(toast);

            // Auto Remove
            setTimeout(() => {
                toast.style.animation = 'fadeOut 0.5s ease forwards';
                setTimeout(() => toast.remove(), 500);
            }, CONFIG.toastDuration);
        }
    };

    ToastSystem.init();
    window.showToast = (msg, type) => ToastSystem.show(msg, type);



    const GOOGLE_CLIENT_ID = "240157715262-3hal7r89k7ivr97j5qqe32sr2difp14b.apps.googleusercontent.com";

    window.handleGoogleCredentialResponse = function (response) {
        try {
            const responsePayload = decodeJwtResponse(response.credential);

            // ✅ Save to localStorage so session persists across pages
            localStorage.setItem('lf_user', JSON.stringify({
                name: responsePayload.given_name,
                picture: responsePayload.picture,
                email: responsePayload.email
            }));

            closeModal();
            ToastSystem.show(`Welcome, ${responsePayload.given_name}!`, "success");
            updateNavWithUser(responsePayload.given_name, responsePayload.picture);
            console.log("Logged in as: " + responsePayload.email);

        } catch (error) {
            console.error("Error decoding token", error);
            ToastSystem.show("Google Login Failed", "error");
        }
    };

    function decodeJwtResponse(token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    }

    function updateNavWithUser(name, picture) {
        const navActions = document.querySelector('.nav-actions');
        if (!navActions) return;

        const loginBtn = document.querySelector('.btn-login');
        const signupBtn = document.querySelector('.btn-signup');
        if (loginBtn) loginBtn.remove();
        if (signupBtn) signupBtn.remove();

        // Remove existing profile if already present
        const existing = document.getElementById('nav-profile');
        if (existing) existing.remove();

        const profileDiv = document.createElement('div');
        profileDiv.id = 'nav-profile';
        profileDiv.style.cssText = 'display:flex;align-items:center;gap:10px;';
        profileDiv.innerHTML = `
            <span style="font-weight:600;color:#333;">${name}</span>
            <img src="${picture}" alt="Profile"
                 style="width:38px;height:38px;border-radius:50%;border:2px solid #7c3aed;object-fit:cover;">
            <button onclick="logoutUser()" title="Logout"
                style="background:none;border:1px solid #e2e8f0;border-radius:999px;
                       padding:5px 12px;font-size:0.8rem;color:#64748b;
                       cursor:pointer;font-family:Poppins,sans-serif;transition:all 0.2s;"
                onmouseover="this.style.background='#fce7f3';this.style.color='#ec4899';"
                onmouseout="this.style.background='none';this.style.color='#64748b';">
                Logout
            </button>
        `;
        navActions.appendChild(profileDiv);
    }

    // ✅ Restore session on every page load
    function restoreSession() {
        const stored = localStorage.getItem('lf_user');
        if (stored) {
            try {
                const user = JSON.parse(stored);
                updateNavWithUser(user.name, user.picture);
            } catch (e) {
                localStorage.removeItem('lf_user');
            }
        }
    }

    // ✅ Logout: clear storage and reload
    window.logoutUser = function () {
        localStorage.removeItem('lf_user');
        ToastSystem.show('Logged out successfully.', 'info');
        setTimeout(() => window.location.reload(), 800);
    };

    restoreSession();

    const checkGoogleLoad = setInterval(() => {
        if (typeof google !== 'undefined') {
            clearInterval(checkGoogleLoad);

            google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleGoogleCredentialResponse
            });

            const btnDiv = document.getElementById("googleButtonDiv");
            if (btnDiv) {
                google.accounts.id.renderButton(
                    btnDiv,
                    { theme: "outline", size: "large", width: 250 }
                );
            }
        }
    }, 500);


    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const current = Math.floor(progress * (end - start) + start);

            if (end >= 1000) {
                obj.innerHTML = Math.floor(current / 1000) + "k+";
            } else {
                obj.innerHTML = current + "+";
            }

            if (progress < 1) window.requestAnimationFrame(step);
        };
        window.requestAnimationFrame(step);
    }

    const statElements = document.querySelectorAll('.stat-card h3');
    if (statElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const finalValue = parseInt(el.innerText.replace(/[^0-9]/g, ''));
                    if (!isNaN(finalValue)) {
                        animateValue(el, 0, finalValue * (el.innerText.includes('k') ? 1000 : 1), 2000);
                    }
                    observer.unobserve(el);
                }
            });
        });
        statElements.forEach(el => observer.observe(el));
    }


    const courseGrid = document.getElementById('courseGrid');

    function renderCourses(data) {
        if (!courseGrid) return;
        courseGrid.innerHTML = '';

        if (data.length === 0) {
            courseGrid.innerHTML = '<div style="grid-column: 1/-1; text-align:center;"><h3>No courses found.</h3></div>';
            return;
        }

        data.forEach(course => {
            const card = document.createElement('div');
            card.className = `course-card ${course.category}`;
            card.style.animation = 'fadeIn 0.5s ease';

            card.onclick = function () {
                window.location.href = `enroll.html?course=${encodeURIComponent(course.title)}`;
            };

            const downloadBtn = course.pdfFile
                ? `<a href="${encodeURIComponent(course.pdfFile)}" download="${course.pdfFile}"
                      class="pdf-download-btn"
                      onclick="event.stopPropagation();"
                      title="Download free project notes PDF">
                       <i class="fa-solid fa-file-arrow-down"></i> Free Download
                   </a>`
                : '';

            card.innerHTML = `
                <div class="card-icon"><i class="${course.icon}" style="color: ${course.color};"></i></div>
                <h4>${course.title}</h4>
                <div style="margin-top:8px; font-size:0.8rem; color:#888;">
                    <i class="fa-solid fa-star" style="color:gold"></i> 4.8 | 5k+ Learners
                </div>
                ${downloadBtn}
            `;
            courseGrid.appendChild(card);
        });
    }

    if (typeof coursesData !== 'undefined') {
        renderCourses(coursesData);
    }

    const searchInput = document.getElementById('courseSearch');
    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = coursesData.filter(course =>
                course.title.toLowerCase().includes(term) ||
                course.category.toLowerCase().includes(term)
            );
            renderCourses(filtered);
        });
    }


    const tabBtns = document.querySelectorAll('.tab-btn');
    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');
                if (typeof coursesData !== 'undefined') {
                    if (filterValue === 'all') {
                        renderCourses(coursesData);
                    } else {
                        renderCourses(coursesData.filter(c => c.category === filterValue));
                    }
                }
            });
        });
    }


    const modal = document.getElementById('authModal');

    window.openModal = function (type) {
        if (!modal) return;
        modal.style.display = 'flex';
        const title = document.getElementById('modalTitle');
        if (title) title.innerText = type;

    };

    window.closeModal = function () {
        if (modal) modal.style.display = 'none';
    };

    window.onclick = function (event) {
        if (event.target == modal) closeModal();
    };

    window.handleFormSubmit = function (e) {
        e.preventDefault();
        const form = e.target;
        const email = form.querySelector('input[type="email"]').value;
        const pass = form.querySelector('input[type="password"]').value;

        if (!email.includes('@')) {
            ToastSystem.show("Invalid Email Address", "error");
            return;
        }
        if (pass.length < 6) {
            ToastSystem.show("Password too short", "error");
            return;
        }

        const btn = form.querySelector('button');
        const originalText = btn.innerText;
        btn.innerText = "Processing...";
        btn.disabled = true;

        setTimeout(() => {
            btn.innerText = originalText;
            btn.disabled = false;
            closeModal();
            ToastSystem.show("Logged in successfully!", "success");

            const name = email.split('@')[0];
            const picture = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=7c3aed&color=fff`;

            // ✅ Save to localStorage
            localStorage.setItem('lf_user', JSON.stringify({ name, picture, email }));

            updateNavWithUser(name, picture);
        }, 1500);
    };


    const displayElement = document.getElementById('courseNameDisplay');
    if (displayElement) {
        const urlParams = new URLSearchParams(window.location.search);
        const courseName = urlParams.get('course');

        if (courseName) {
            displayElement.innerText = decodeURIComponent(courseName);
        } else {
            displayElement.innerText = "No Course Selected";
        }
    }



    window.scrollToSection = function (id) {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes fadeOut { to { opacity: 0; transform: translateY(-10px); } }
    `;
    document.head.appendChild(styleSheet);

    console.log("TuteDude V3.0 Loaded Successfully");
});

