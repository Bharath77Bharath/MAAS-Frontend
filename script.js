(function () {
  "use strict";

  /* ==============================================================
     CONFIGURATION
     In production this block is never shipped to the browser as-is:
     the dashboard URL, customer id, and any embed token are resolved
     server-side after authentication and handed to the client as a
     short-lived, signed embed URL. The placeholders below stand in
     for that response during preview.
  ============================================================== */
  const DEFAULT_GRAFANA_URL =
    "https://dev.pirsch.io/?domain=pirsch.io&interval=14d&ui=hide";
  const RuntimeConfig = {
    // Populated by the backend after login (see AuthModule.mockLogin below).
    // Never place real Grafana admin URLs, API keys or service-account
    // tokens here — only a scoped, customer-specific embed URL.
    grafanaEmbedUrl: DEFAULT_GRAFANA_URL,
    customer: null
  };

  /* ==============================================================
     AUTH MODULE — swap mockLogin() for a real SAML/SSO + session
     call. Everything downstream (routing, RBAC, dashboard load)
     only depends on this module's return shape, so integration is
     a one-file change.
  ============================================================== */
  const AuthModule = (function () {
    let session = null;
    return {
      mockLogin(email, password) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            if (!email || !password || password.length < 4) {
              reject(new Error("Invalid email or password. Please try again."));
              return;
            }
            session = {
              name: deriveName(email),
              email: email,
              role: "Customer",
              customer: { id: "cust_demo", name: "Precision Infomatic — Demo Tenant" }
            };
            RuntimeConfig.customer = session.customer;
            // In production: RuntimeConfig.grafanaEmbedUrl comes from the
            // backend, scoped to session.customer.id, never chosen by the client.
            RuntimeConfig.grafanaEmbedUrl = DEFAULT_GRAFANA_URL;
            resolve(session);
          }, 850);
        });
      },
      logout() { session = null; },
      getSession() { return session; }
    };
    function deriveName(email) {
      const local = email.split("@")[0].replace(/[._-]+/g, " ").trim();
      if (!local) return "Customer User";
      return local.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    }
  })();

  /* ==============================================================
     THEME
     Note: this preview keeps theme state in memory only (browser
     storage APIs are unavailable in this sandbox). In a deployed
     build, persist the choice with localStorage or a user-profile
     setting so it's remembered on return.
  ============================================================== */
  const ThemeModule = (function () {
    let current = "light";
    function apply(t) {
      current = t;
      document.documentElement.setAttribute("data-theme", t);
      document.getElementById("theme-light-btn").classList.toggle("active", t === "light");
      document.getElementById("theme-dark-btn").classList.toggle("active", t === "dark");
    }
    return { apply, get() { return current; } };
  })();

  /* ==============================================================
     LOGIN SCREEN WIRING
  ============================================================== */
  const loginScreen = document.getElementById("login-screen");
  const appScreen = document.getElementById("app-screen");
  const loginForm = document.getElementById("login-form");
  const emailInput = document.getElementById("email");
  const pwInput = document.getElementById("password");
  const emailError = document.getElementById("email-error");
  const pwError = document.getElementById("password-error");
  const formAlert = document.getElementById("form-alert");
  const formAlertText = document.getElementById("form-alert-text");
  const loginBtn = document.getElementById("login-btn");
  const loginBtnText = document.getElementById("login-btn-text");

  document.getElementById("year").textContent = new Date().getFullYear();

  document.getElementById("toggle-pw").addEventListener("click", function () {
    const isPw = pwInput.type === "password";
    pwInput.type = isPw ? "text" : "password";
    this.setAttribute("aria-label", isPw ? "Hide password" : "Show password");
    document.getElementById("eye-icon").innerHTML = isPw
      ? '<path d="M3 3l18 18M10.6 10.7A3 3 0 0 0 13.3 13.4M9.4 5.3A10.9 10.9 0 0 1 12 5c7 0 11 7 11 7a13.5 13.5 0 0 1-3.3 3.9M6.6 6.6C3.4 8.5 1 12 1 12s4 7 11 7a10.6 10.6 0 0 0 4.2-.9" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>'
      : '<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.7"/>';
  });

  document.getElementById("forgot-link").addEventListener("click", function (e) {
    e.preventDefault();
    formAlertText.textContent = "Password reset isn't available in this preview. Contact your account engineer to reset access.";
    formAlert.classList.add("show");
  });

  document.getElementById("demo-fill-btn").addEventListener("click", function () {
    emailInput.value = "demo@precisionit.co.in";
    pwInput.value = "demo1234";
    attemptLogin();
  });

  [emailInput, pwInput].forEach(inp => {
    inp.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); attemptLogin(); }
    });
  });

  loginForm.addEventListener("submit", function (e) { e.preventDefault(); });
  loginBtn.addEventListener("click", function (e) { e.preventDefault(); attemptLogin(); });

  function attemptLogin() {
    try {
      let valid = true;
      formAlert.classList.remove("show");
      emailInput.classList.remove("error"); pwInput.classList.remove("error");
      emailError.classList.remove("show"); pwError.classList.remove("show");

      if (!emailInput.value.trim()) {
        emailInput.classList.add("error"); emailError.classList.add("show"); valid = false;
      }
      if (!pwInput.value || pwInput.value.length < 4) {
        pwInput.classList.add("error");
        pwError.textContent = pwInput.value ? "Password must be at least 4 characters." : "Enter your password.";
        pwError.classList.add("show"); valid = false;
      }
      if (!valid) return;

      loginBtn.disabled = true;
      loginBtnText.innerHTML = '<span class="spinner"></span>';

      AuthModule.mockLogin(emailInput.value.trim(), pwInput.value)
        .then(session => { enterApp(session); })
        .catch(err => {
          formAlertText.textContent = err.message;
          formAlert.classList.add("show");
          loginBtn.disabled = false;
          loginBtnText.textContent = "Sign in";
        });
    } catch (err) {
      formAlertText.textContent = "Something went wrong signing in: " + err.message;
      formAlert.classList.add("show");
      loginBtn.disabled = false;
      loginBtnText.textContent = "Sign in";
    }
  }

  function enterApp(session) {
    loginScreen.classList.add("hidden");
    appScreen.classList.remove("hidden");
    loginBtn.disabled = false;
    loginBtnText.textContent = "Sign in";
    loginForm.reset();

    const initials = session.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
    document.getElementById("avatar-initials").textContent = initials || "U";
    document.getElementById("profile-name").textContent = session.name;
    document.getElementById("dd-name").textContent = session.name;
    document.getElementById("dd-email").textContent = session.email;
    document.getElementById("profile-role").textContent = session.role + " · " + session.customer.name.split(" — ")[0];

    Router.go("dashboard");
  }

  function exitApp() {
    AuthModule.logout();
    appScreen.classList.add("hidden");
    loginScreen.classList.remove("hidden");
  }

  document.getElementById("logout-btn").addEventListener("click", exitApp);
  document.getElementById("sidebar-logout").addEventListener("click", exitApp);

  /* ==============================================================
     TOPBAR: theme toggle, profile dropdown, sidebar toggle
  ============================================================== */
  document.getElementById("theme-light-btn").addEventListener("click", () => ThemeModule.apply("light"));
  document.getElementById("theme-dark-btn").addEventListener("click", () => ThemeModule.apply("dark"));
  ThemeModule.apply("light");

  const profileTrigger = document.getElementById("profile-trigger");
  const profileDropdown = document.getElementById("profile-dropdown");
  profileTrigger.addEventListener("click", (e) => {
    e.stopPropagation();
    profileDropdown.classList.toggle("open");
  });
  document.addEventListener("click", () => profileDropdown.classList.remove("open"));
  profileDropdown.querySelectorAll("[data-route]").forEach(el => {
    el.addEventListener("click", (e) => { e.preventDefault(); Router.go(el.dataset.route); });
  });

  const sidebar = document.getElementById("sidebar");
  const scrim = document.getElementById("scrim");
  const sidebarToggle = document.getElementById("sidebar-toggle");
  function isMobile() { return window.innerWidth <= 880; }
  sidebarToggle.addEventListener("click", () => {
    if (isMobile()) {
      sidebar.classList.toggle("mobile-open");
      scrim.classList.toggle("show");
    } else {
      sidebar.classList.toggle("collapsed");
    }
  });
  scrim.addEventListener("click", () => { sidebar.classList.remove("mobile-open"); scrim.classList.remove("show"); });

  /* ==============================================================
     ROUTER + PAGE TEMPLATES
  ============================================================== */
  const contentInner = document.getElementById("content-inner");
  const navItems = document.querySelectorAll(".nav-item[data-route]");

  const pages = {
    dashboard() {
      const url = RuntimeConfig.grafanaEmbedUrl;
      return `
        <div class="page-head">
          <h1>MaaS Dashboard</h1>
          <p>Real-time infrastructure monitoring and insights.</p>
        </div>
        <div class="dash-frame-card">
          <div class="dash-frame-toolbar">
            <div class="left">
              <span class="status-chip"><span class="d"></span>Live</span>
            </div>
            <button class="icon-btn" title="Refresh" id="refresh-dash">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 12a9 9 0 1 1-3-6.7M21 3v6h-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
          </div>
          <div class="dash-frame-body">
            ${url ? `
            <!-- Grafana Iframe Embed Wrapper -->
            <div class="iframe-wrapper">
              <iframe id="grafana-dashboard" class="grafana-dashboard"
                src="${url}"
                title="MAAS Monitoring Dashboard" frameborder="0" loading="lazy">
              </iframe>
            </div>` : `
            <div class="dash-frame-empty">
              <div class="ic-wrap">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 13h4v8H3zM10 8h4v13h-4zM17 3h4v18h-4z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>
              </div>
              <h3>No dashboard connected yet</h3>
              <p>Once your account engineer configures <code>GRAFANA_EMBED_URL</code> for this tenant in the backend, your monitoring dashboard will load here automatically — no manual setup needed.</p>
            </div>`}
          </div>
        </div>
      `;
    },
    profile() {
      const s = AuthModule.getSession();
      return `
        <div class="page-head"><h1>My profile</h1><p>Your account details for the MaaS Dashboard portal.</p></div>
        <div class="settings-card">
          <h3>Account</h3>
          <p>Basic information associated with your sign-in.</p>
          <div class="settings-row"><div><div class="label">Name</div></div><div>${s ? s.name : "—"}</div></div>
          <div class="settings-row"><div><div class="label">Email</div></div><div>${s ? s.email : "—"}</div></div>
          <div class="settings-row"><div><div class="label">Role</div></div><div><span class="role-pill">${s ? s.role : "—"}</span></div></div>
          <div class="settings-row"><div><div class="label">Tenant</div></div><div>${s ? s.customer.name : "—"}</div></div>
        </div>
        <div class="arch-note">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
          <div>This preview uses demo authentication. In production, profile fields are populated from your SAML / SSO identity provider, and role (Admin, Engineer or Customer) drives what you can see across the portal.</div>
        </div>
      `;
    },
    settings() {
      return `
        <div class="page-head"><h1>Settings</h1><p>Preferences for your MaaS Dashboard account.</p></div>
        <div class="settings-card">
          <h3>Appearance</h3>
          <p>Choose how the portal looks. Applies immediately.</p>
          <div class="settings-row">
            <div><div class="label">Theme</div><div class="desc">Light or dark mode</div></div>
            <div class="theme-toggle" role="group" aria-label="Theme">
              <button id="theme-light-btn-2" aria-label="Light mode">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4.5" stroke="currentColor" stroke-width="1.8"/><path d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8 6 18M18 6l1.8-1.8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
              </button>
              <button id="theme-dark-btn-2" aria-label="Dark mode">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>
              </button>
            </div>
          </div>
        </div>
        <div class="settings-card">
          <h3>Notifications</h3>
          <p>How you're notified about alerts on your infrastructure.</p>
          <div class="settings-row"><div><div class="label">Email alerts</div><div class="desc">Critical and warning-level alerts</div></div><div>Enabled</div></div>
          <div class="settings-row"><div><div class="label">Weekly summary</div><div class="desc">A digest of uptime and incidents</div></div><div>Enabled</div></div>
        </div>
        <div class="arch-note">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
          <div>Role-based access control (Admin / Engineer / Customer) and per-tenant data isolation are enforced server-side, so settings and data here always reflect only what your account is authorized to see.</div>
        </div>
      `;
    }
  };


  const Router = {
    go(route) {
      if (!pages[route]) route = "dashboard";
      contentInner.innerHTML = pages[route]();
      navItems.forEach(n => n.classList.toggle("active", n.dataset.route === route));
      if (isMobile()) { sidebar.classList.remove("mobile-open"); scrim.classList.remove("show"); }
      contentInner.scrollTop = 0;
      window.scrollTo(0, 0);

      // Re-bind controls rendered inside the freshly injected page HTML.
      const refreshBtn = document.getElementById("refresh-dash");
      if (refreshBtn) refreshBtn.addEventListener("click", () => Router.go("dashboard"));
      const l2 = document.getElementById("theme-light-btn-2");
      const d2 = document.getElementById("theme-dark-btn-2");
      if (l2) l2.addEventListener("click", () => ThemeModule.apply("light"));
      if (d2) d2.addEventListener("click", () => ThemeModule.apply("dark"));
      syncSettingsToggle();
    }
  };

  function syncSettingsToggle() {
    const t = ThemeModule.get();
    const l2 = document.getElementById("theme-light-btn-2");
    const d2 = document.getElementById("theme-dark-btn-2");
    if (l2 && d2) {
      l2.classList.toggle("active", t === "light");
      d2.classList.toggle("active", t === "dark");
    }
  }

  const origApply = ThemeModule.apply;
  ThemeModule.apply = function (t) { origApply(t); syncSettingsToggle(); };

  navItems.forEach(item => {
    item.addEventListener("click", () => Router.go(item.dataset.route));
  });

})();
