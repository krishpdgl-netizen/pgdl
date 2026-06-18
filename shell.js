/* ============================================================
   PANACHE WMS — Shell Components
   Renders sidebar + topbar via JS into any page
   ============================================================ */

function renderShell({ role = 'admin', page = '', title = 'Dashboard' } = {}) {
  const navAdmin = [
    { icon: '🏠', label: 'Overview',          href: 'admin-dashboard.html',   section: 'main' },
    { icon: '📋', label: 'Workflow Board',     href: 'workflow-board.html',    section: 'main' },
    { icon: '✅', label: 'Create Task',        href: 'create-task.html',       section: 'main' },
    { icon: '👥', label: 'Employees',          href: 'employee-management.html', section: 'team' },
    { icon: '📊', label: 'Reports',            href: 'reports.html',           section: 'analytics' },
    { icon: '🤖', label: 'AI Assistant',       href: 'ai-assistant.html',      section: 'analytics' },
    { icon: '⚙️', label: 'Settings',           href: 'settings.html',          section: 'system' },
  ];
  const navManager = [
    { icon: '🏠', label: 'My Dashboard',       href: 'manager-dashboard.html', section: 'main' },
    { icon: '📋', label: 'Workflow Board',      href: 'workflow-board.html',    section: 'main' },
    { icon: '✅', label: 'Create Task',         href: 'create-task.html',       section: 'main' },
    { icon: '👥', label: 'My Team',             href: 'employee-management.html', section: 'team' },
    { icon: '📊', label: 'Reports',             href: 'reports.html',           section: 'analytics' },
    { icon: '🤖', label: 'AI Assistant',        href: 'ai-assistant.html',      section: 'analytics' },
    { icon: '⚙️', label: 'Settings',            href: 'settings.html',          section: 'system' },
  ];
  const navEmployee = [
    { icon: '🏠', label: 'My Dashboard',        href: 'employee-dashboard.html', section: 'main' },
    { icon: '📋', label: 'Task Board',           href: 'workflow-board.html',    section: 'main' },
    { icon: '📊', label: 'My Reports',           href: 'reports.html',           section: 'analytics' },
    { icon: '🤖', label: 'AI Assistant',         href: 'ai-assistant.html',      section: 'analytics' },
    { icon: '⚙️', label: 'Settings',             href: 'settings.html',          section: 'system' },
  ];

  const navMap = { admin: navAdmin, manager: navManager, employee: navEmployee };
  const nav = navMap[role] || navAdmin;
  const user = Auth.getUser() || { name: 'Demo User', email: 'demo@company.com' };
  const initials = getInitials(user.name);
  const roleLabels = { admin: 'System Admin', manager: 'Team Manager', employee: 'Employee' };

  const sections = {};
  nav.forEach(item => {
    if (!sections[item.section]) sections[item.section] = [];
    sections[item.section].push(item);
  });
  const sectionLabels = { main: 'Main', team: 'Team', analytics: 'Analytics', system: 'System' };

  const navHTML = Object.entries(sections).map(([sec, items]) => `
    <div class="sidebar-section">
      <div class="sidebar-section-label">${sectionLabels[sec] || sec}</div>
      ${items.map(item => `
        <a href="${item.href}" class="nav-item${page === item.href ? ' active' : ''}">
          <span class="nav-icon">${item.icon}</span>
          <span>${item.label}</span>
          ${item.badge ? `<span class="nav-badge ${item.badgeClass || ''}">${item.badge}</span>` : ''}
        </a>
      `).join('')}
    </div>
  `).join('');

  // Build sidebar
  const sidebar = document.querySelector('.sidebar');
  if (sidebar) {
    sidebar.innerHTML = `
      <div class="sidebar-logo">
        <div class="sidebar-logo-icon">P</div>
        <div>
          <div class="sidebar-logo-text">Panache WMS</div>
          <div class="sidebar-logo-sub">Workforce Platform</div>
        </div>
      </div>
      ${navHTML}
      <div style="flex:1;"></div>
      <div class="sidebar-footer">
        <div style="display:flex;align-items:center;gap:8px;padding:4px 8px;margin-bottom:8px;">
          <div style="width:8px;height:8px;border-radius:50%;background:var(--success-500);flex-shrink:0;"></div>
          <span style="font-size:11px;color:var(--gray-500);">All systems operational</span>
        </div>
        <div class="sidebar-user" onclick="window.location.href='settings.html'">
          <div class="sidebar-avatar" style="background:${getAvatarColor(user.name)}">${initials}</div>
          <div class="sidebar-user-info">
            <div class="sidebar-user-name">${user.name}</div>
            <div class="sidebar-user-role">${roleLabels[role]}</div>
          </div>
          <span style="color:var(--gray-600);font-size:12px;margin-left:auto;">⚙</span>
        </div>
        <a href="login.html" onclick="Auth.clearSession()" style="display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:6px;color:var(--gray-500);font-size:12px;margin-top:4px;transition:all .15s;"
          onmouseover="this.style.background='rgba(255,255,255,.06)';this.style.color='#fff'"
          onmouseout="this.style.background='';this.style.color='var(--gray-500)'">
          <span>🚪</span> Sign out
        </a>
      </div>
    `;
  }

  // Build topbar
  const topbar = document.querySelector('.topbar');
  if (topbar) {
    topbar.innerHTML = `
      <button class="topbar-hamburger" id="hamburger">☰</button>
      <div class="topbar-title">${title}</div>
      <div class="topbar-search">
        <span class="topbar-search-icon">🔍</span>
        <input type="text" placeholder="Search tasks, people, projects…" id="global-search">
      </div>
      <div class="topbar-actions">
        <button class="topbar-btn" data-tooltip="Quick add" onclick="window.location.href='create-task.html'">＋</button>
        <button class="topbar-btn" data-tooltip="Notifications" onclick="toggleNotifPanel()">
          🔔
          <span class="topbar-notif-dot"></span>
        </button>
        <button class="topbar-btn" data-tooltip="Help">?</button>
        <div class="topbar-avatar" style="background:${getAvatarColor(user.name)}" onclick="window.location.href='settings.html'">${initials}</div>
      </div>
      <!-- Notif dropdown -->
      <div id="notif-panel" style="display:none;position:absolute;top:calc(100% + 8px);right:16px;width:360px;background:#fff;border:1px solid var(--gray-200);border-radius:var(--radius-lg);box-shadow:var(--shadow-xl);z-index:500;overflow:hidden;">
        <div style="padding:14px 18px;border-bottom:1px solid var(--gray-100);display:flex;align-items:center;justify-content:space-between;">
          <span style="font-size:14px;font-weight:700;">Notifications</span>
          <button onclick="markAllRead()" style="font-size:11px;color:var(--brand-600);background:none;border:none;cursor:pointer;font-weight:600;">Mark all read</button>
        </div>
        <div style="max-height:360px;overflow-y:auto;" class="notif-list">
          ${[
            { icon: '✅', iconBg: 'var(--success-50)', iconColor: 'var(--success-700)', title: 'Task completed', desc: 'Sarah Chen marked "API Integration" as done', time: '2m ago', unread: true },
            { icon: '⚠️', iconBg: 'var(--warning-50)', iconColor: 'var(--warning-700)', title: 'Deadline approaching', desc: 'Q4 Report due in 24 hours', time: '1h ago', unread: true },
            { icon: '👤', iconBg: 'var(--brand-50)', iconColor: 'var(--brand-700)', title: 'New employee added', desc: 'James Liu joined the Engineering team', time: '3h ago', unread: false },
            { icon: '📋', iconBg: 'var(--purple-50)', iconColor: 'var(--purple-700)', title: 'Task assigned to you', desc: 'You have been assigned "Design Review"', time: '5h ago', unread: false },
            { icon: '💬', iconBg: 'var(--gray-100)', iconColor: 'var(--gray-600)', title: 'Comment on task', desc: 'Mike Ross commented on "Sprint Planning"', time: '1d ago', unread: false },
          ].map(n => `
            <div class="notif-item${n.unread ? ' unread' : ''}">
              <div class="notif-icon" style="background:${n.iconBg};color:${n.iconColor};">${n.icon}</div>
              <div class="notif-body">
                <div class="notif-title">${n.title}</div>
                <div class="notif-desc">${n.desc}</div>
                <div class="notif-time">${n.time}</div>
              </div>
            </div>
          `).join('')}
        </div>
        <div style="padding:12px 18px;border-top:1px solid var(--gray-100);text-align:center;">
          <a href="#" style="font-size:12px;color:var(--brand-600);font-weight:600;">View all notifications</a>
        </div>
      </div>
    `;
  }

  // Overlay
  const overlay = document.getElementById('sidebar-overlay');
  if (!overlay) {
    const ov = document.createElement('div');
    ov.className = 'sidebar-overlay'; ov.id = 'sidebar-overlay';
    document.body.appendChild(ov);
  }

  initSidebar();
  initTooltips();
}

function toggleNotifPanel() {
  const panel = document.getElementById('notif-panel');
  if (!panel) return;
  panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}

function markAllRead() {
  document.querySelectorAll('.notif-item.unread').forEach(el => el.classList.remove('unread'));
  document.querySelector('.topbar-notif-dot')?.remove();
  Toast.success('All notifications marked as read.');
}

// Close notif panel on outside click
document.addEventListener('click', (e) => {
  const panel = document.getElementById('notif-panel');
  const btn = e.target.closest('[onclick="toggleNotifPanel()"]');
  if (!btn && panel && !panel.contains(e.target)) panel.style.display = 'none';
});
