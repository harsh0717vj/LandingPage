/**
 * SmartCyclone AI - UI Helpers & Telemetry Visualizers
 */

const UIHelpers = {
  showToast(message, type = 'info') {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-exclamation-triangle';

    toast.innerHTML = `
      <i class="fas ${icon}"></i>
      <div>${message}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  },

  updateClock() {
    const el = document.getElementById('topbarClock');
    if (el) {
      const now = new Date();
      el.textContent = now.toUTCString().replace('GMT', 'UTC') + ' | IST ' + now.toLocaleTimeString('en-IN', { hour12: false });
    }
  }
};
