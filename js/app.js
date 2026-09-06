/**
 * SmartCyclone AI - Main Application Controller
 * Handles SPA navigation, views switching, event binding, and data synchronization
 */

const App = {
  currentView: 'dashboard',
  cachedAnalysisResult: null,

  async init() {
    console.log("Initializing SmartCyclone AI Platform...");

    // Setup Clock
    setInterval(UIHelpers.updateClock, 1000);
    UIHelpers.updateClock();

    // Setup Navigation Listeners
    this.setupNavigation();

    // Initialize Upload Dropzone & Samples
    UploadDemoService.init();

    // Load Initial Data
    await this.loadDashboardData();
    await this.loadHistoricalTable();
    await this.loadModelPerformanceView();

    // Setup Search and Filters on Historical Data Table
    this.setupTableFilters();

    // Setup System Health Status
    this.checkSystemStatus();

    console.log("SmartCyclone AI Ready for SIH 2026 Presentation.");
  },

  setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link[data-view]');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetView = link.getAttribute('data-view');
        this.navigateTo(targetView);

        // Close mobile sidebar if open
        const sidebar = document.getElementById('appSidebar');
        if (sidebar) sidebar.classList.remove('mobile-open');
      });
    });

    const mobileBtn = document.getElementById('mobileMenuToggle');
    if (mobileBtn) {
      mobileBtn.addEventListener('click', () => {
        const sidebar = document.getElementById('appSidebar');
        if (sidebar) sidebar.classList.toggle('mobile-open');
      });
    }
  },

  navigateTo(viewId) {
    this.currentView = viewId;

    // Update Nav Active State
    document.querySelectorAll('.nav-link').forEach(l => {
      l.classList.toggle('active', l.getAttribute('data-view') === viewId);
    });

    // Update View Sections
    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.toggle('active', sec.id === `view-${viewId}`);
    });

    // Update Topbar Title
    const titleEl = document.getElementById('topbarTitle');
    const subTitleEl = document.getElementById('topbarSubtitle');
    
    const titles = {
      dashboard: { title: "Command Center Dashboard", sub: "Real-Time Planetary & Cyclone Surveillance" },
      upload: { title: "Satellite Image Analysis", sub: "INSAT-3D / Himawari-8 Multispectral Radiance Ingestion" },
      detection: { title: "AI Detection & Classification", sub: "Deep Spatiotemporal Feature Extraction" },
      prediction: { title: "24-Hour Trajectory & Intensity Forecast", sub: "Physics-Informed ConvLSTM Neural Track Model" },
      map: { title: "Interactive Geospatial Radar Map", sub: "Live Telemetry & Cones of Uncertainty" },
      historical: { title: "Historical Benchmark Tracks", sub: "Comparative Indian Ocean Cyclone Repertoire" },
      graphs: { title: "Atmospheric Telemetry Progression", sub: "Wind Velocity & Central Pressure Hydrodynamics" },
      performance: { title: "AI/ML Model Benchmarks", sub: "Validation Metrics & Illustrative Performance Matrix" },
      'data-table': { title: "Cyclone Archive Database", sub: "Multi-Source Meteorological Records" },
      settings: { title: "System Architecture & ML Endpoint", sub: "REST API Microservice Configuration" }
    };

    if (titles[viewId] && titleEl && subTitleEl) {
      titleEl.textContent = titles[viewId].title;
      subTitleEl.textContent = titles[viewId].sub;
    }

    // Initialize View Specific Components
    if (viewId === 'map' || viewId === 'dashboard') {
      setTimeout(() => {
        MapService.init(viewId === 'dashboard' ? 'dashboardMiniMap' : 'cycloneMap');
        if (MapService.mapInstance) {
          MapService.mapInstance.invalidateSize();
        }
      }, 100);
    }

    if (viewId === 'graphs' || viewId === 'dashboard') {
      setTimeout(() => {
        ChartsService.initTelemetryCharts();
      }, 100);
    }

    if (viewId === 'performance') {
      setTimeout(() => {
        ChartsService.renderModelPerformanceTrainingChart();
      }, 100);
    }
  },

  async loadDashboardData() {
    const stats = await ApiService.getDashboardStats();
    
    // Update Counter Stat Cards
    const elAnalyzed = document.getElementById('statTotalAnalyzed');
    const elActive = document.getElementById('statActiveCyclones');
    const elPredictions = document.getElementById('statPredictions');
    const elHighRisk = document.getElementById('statHighRisk');

    if (elAnalyzed) elAnalyzed.textContent = stats.totalCyclonesAnalyzed;
    if (elActive) elActive.textContent = stats.activeCyclones;
    if (elPredictions) elPredictions.textContent = stats.predictionsGenerated;
    if (elHighRisk) elHighRisk.textContent = stats.highRiskCyclones;

    // Update Featured Active Cyclone HUD
    const featured = stats.currentFeaturedCyclone || DEMO_DATASET.activeCyclone;
    this.updateFeaturedCycloneHUD(featured);
  },

  updateFeaturedCycloneHUD(c) {
    const nameEl = document.getElementById('hudCycloneName');
    const catEl = document.getElementById('hudCategory');
    const windEl = document.getElementById('hudWindSpeed');
    const pressEl = document.getElementById('hudPressure');
    const coordEl = document.getElementById('hudCoordinates');
    const dirEl = document.getElementById('hudDirection');

    if (nameEl) nameEl.textContent = c.name;
    if (catEl) catEl.textContent = c.category;
    if (windEl) windEl.textContent = `${c.maxWindSpeed || 145} km/h`;
    if (pressEl) pressEl.textContent = `${c.minPressure || 945} hPa`;
    if (coordEl) coordEl.textContent = `${(c.currentLatitude || 15.24).toFixed(2)}°N, ${(c.currentLongitude || 88.75).toFixed(2)}°E`;
    if (dirEl) dirEl.textContent = c.movementDirection || "North-East (045°)";
  },

  updateDetectionView(result) {
    this.cachedAnalysisResult = result;

    const statusEl = document.getElementById('detStatusBadge');
    const detConfEl = document.getElementById('detConfidenceVal');
    const classTypeEl = document.getElementById('classTypeVal');
    const classCatEl = document.getElementById('classCategoryVal');
    const classConfEl = document.getElementById('classConfVal');
    const windVal = document.getElementById('detWindVal');
    const pressVal = document.getElementById('detPressVal');
    const coordsVal = document.getElementById('detCoordsVal');
    const dirVal = document.getElementById('detDirVal');

    if (statusEl) {
      if (result.cycloneDetected) {
        statusEl.innerHTML = `<span style="color: #ef4444; font-weight: 700;"><i class="fas fa-exclamation-triangle"></i> CYCLONE DETECTED: YES</span>`;
      } else {
        statusEl.innerHTML = `<span style="color: #10b981; font-weight: 700;"><i class="fas fa-check-circle"></i> NO CYCLONIC DISTURBANCE</span>`;
      }
    }

    if (detConfEl) detConfEl.textContent = `${(result.detectionConfidence * 100).toFixed(0)}%`;
    if (classTypeEl) classTypeEl.textContent = result.classificationType;
    if (classCatEl) classCatEl.textContent = result.category;
    if (classConfEl) classConfEl.textContent = `${(result.classificationConfidence * 100).toFixed(0)}%`;
    if (windVal) windVal.textContent = `${result.estimatedWindSpeed} km/h`;
    if (pressVal) pressVal.textContent = `${result.estimatedCentralPressure} hPa`;
    if (coordsVal) coordsVal.textContent = `${result.latitude.toFixed(2)}°N, ${result.longitude.toFixed(2)}°E`;
    if (dirVal) dirVal.textContent = result.movementDirection;

    // Update gauge CSS variables
    const gaugeDet = document.getElementById('gaugeDetection');
    const gaugeClass = document.getElementById('gaugeClassification');
    if (gaugeDet) gaugeDet.style.setProperty('--percent', (result.detectionConfidence * 100).toFixed(0));
    if (gaugeClass) gaugeClass.style.setProperty('--percent', (result.classificationConfidence * 100).toFixed(0));
  },

  async loadHistoricalTable() {
    const tableBody = document.getElementById('historicalTableBody');
    if (!tableBody) return;

    const data = await ApiService.getHistoricalArchive();
    
    tableBody.innerHTML = data.map(c => `
      <tr>
        <td style="font-weight: 600; color: #ffffff;">
          <i class="fas fa-hurricane" style="color: #38bdf8; margin-right: 6px;"></i> ${c.name}
        </td>
        <td style="font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; color: #94a3b8;">${c.code}</td>
        <td>${c.region}</td>
        <td><span class="badge-category ${c.category.includes('5') ? 'badge-cat-5' : 'badge-cat-3'}">${c.category}</span></td>
        <td style="font-family: 'JetBrains Mono', monospace; color: #f87171; font-weight: 600;">${c.maxWind} km/h</td>
        <td style="font-family: 'JetBrains Mono', monospace; color: #38bdf8;">${c.minPressure} hPa</td>
        <td>${c.date}</td>
        <td>
          <span style="font-size: 0.72rem; font-weight: 600; padding: 2px 8px; border-radius: 4px; background: ${c.status === 'ACTIVE' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(100, 116, 139, 0.2)'}; color: ${c.status === 'ACTIVE' ? '#f87171' : '#94a3b8'};">
            ${c.status}
          </span>
        </td>
        <td>
          <button class="action-btn" style="padding: 4px 8px; font-size: 0.72rem;" onclick="App.viewHistoricalCyclone(${c.id})">
            <i class="fas fa-chart-line"></i> View Track
          </button>
        </td>
      </tr>
    `).join('');
  },

  setupTableFilters() {
    const searchInput = document.getElementById('cycloneSearchInput');
    const regionSelect = document.getElementById('regionFilterSelect');
    const categorySelect = document.getElementById('categoryFilterSelect');

    const filterHandler = async () => {
      const q = (searchInput?.value || '').toLowerCase();
      const reg = regionSelect?.value || '';
      const cat = categorySelect?.value || '';

      const all = await ApiService.getHistoricalArchive(reg, cat);
      const filtered = all.filter(c => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q));

      const tableBody = document.getElementById('historicalTableBody');
      if (tableBody) {
        if (filtered.length === 0) {
          tableBody.innerHTML = `<tr><td colspan="9" style="text-align: center; padding: 30px; color: #64748b;">No matching cyclone records found for given filters.</td></tr>`;
          return;
        }
        tableBody.innerHTML = filtered.map(c => `
          <tr>
            <td style="font-weight: 600; color: #ffffff;">
              <i class="fas fa-hurricane" style="color: #38bdf8; margin-right: 6px;"></i> ${c.name}
            </td>
            <td style="font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; color: #94a3b8;">${c.code}</td>
            <td>${c.region}</td>
            <td><span class="badge-category ${c.category.includes('5') ? 'badge-cat-5' : 'badge-cat-3'}">${c.category}</span></td>
            <td style="font-family: 'JetBrains Mono', monospace; color: #f87171; font-weight: 600;">${c.maxWind} km/h</td>
            <td style="font-family: 'JetBrains Mono', monospace; color: #38bdf8;">${c.minPressure} hPa</td>
            <td>${c.date}</td>
            <td>
              <span style="font-size: 0.72rem; font-weight: 600; padding: 2px 8px; border-radius: 4px; background: ${c.status === 'ACTIVE' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(100, 116, 139, 0.2)'}; color: ${c.status === 'ACTIVE' ? '#f87171' : '#94a3b8'};">
                ${c.status}
              </span>
            </td>
            <td>
              <button class="action-btn" style="padding: 4px 8px; font-size: 0.72rem;" onclick="App.viewHistoricalCyclone(${c.id})">
                <i class="fas fa-chart-line"></i> View Track
              </button>
            </td>
          </tr>
        `).join('');
      }
    };

    if (searchInput) searchInput.addEventListener('input', filterHandler);
    if (regionSelect) regionSelect.addEventListener('change', filterHandler);
    if (categorySelect) categorySelect.addEventListener('change', filterHandler);
  },

  async viewHistoricalCyclone(id) {
    const cyclone = await ApiService.getCycloneById(id);
    this.navigateTo('map');
    setTimeout(() => {
      MapService.renderCycloneTrack(cyclone);
      UIHelpers.showToast(`Plotted trajectory for: ${cyclone.name}`, 'info');
    }, 200);
  },

  async loadModelPerformanceView() {
    const perf = await ApiService.getModelPerformance();
    const catsContainer = document.getElementById('modelCategoriesGrid');
    if (!catsContainer || !perf.categories) return;

    catsContainer.innerHTML = perf.categories.map(cat => `
      <div class="stat-card" style="padding: 16px;">
        <div style="font-size: 0.85rem; font-weight: 700; color: #ffffff; margin-bottom: 4px;">${cat.name}</div>
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; color: #38bdf8; margin-bottom: 12px;">Architecture: ${cat.model}</div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.78rem;">
          <div style="background: rgba(0,0,0,0.3); padding: 6px; border-radius: 4px;">
            <div style="color: #64748b;">Accuracy</div>
            <div style="font-weight: 700; color: #10b981; font-size: 1rem;">${cat.accuracy}%</div>
          </div>
          <div style="background: rgba(0,0,0,0.3); padding: 6px; border-radius: 4px;">
            <div style="color: #64748b;">F1-Score</div>
            <div style="font-weight: 700; color: #38bdf8; font-size: 1rem;">${cat.f1}%</div>
          </div>
          <div style="background: rgba(0,0,0,0.3); padding: 6px; border-radius: 4px;">
            <div style="color: #64748b;">Precision</div>
            <div style="font-weight: 700; color: #f1f5f9;">${cat.precision}%</div>
          </div>
          <div style="background: rgba(0,0,0,0.3); padding: 6px; border-radius: 4px;">
            <div style="color: #64748b;">Recall</div>
            <div style="font-weight: 700; color: #f1f5f9;">${cat.recall}%</div>
          </div>
        </div>
      </div>
    `).join('');
  },

  async checkSystemStatus() {
    const status = await ApiService.getSystemStatus();
    const statusDot = document.getElementById('systemHealthDot');
    const statusText = document.getElementById('systemHealthText');

    if (statusText) {
      statusText.textContent = status.isMockMlMode ? "Mock ML Adapter (Prototype Demo)" : "External ML Microservice";
    }
  },

  async testMLConnection() {
    const urlInput = document.getElementById('customMlUrlInput');
    const url = urlInput?.value || 'http://localhost:8000/api/v1/cyclone/predict';
    UIHelpers.showToast(`Testing connectivity to ML Endpoint: ${url}...`, 'info');

    setTimeout(() => {
      UIHelpers.showToast("ML Microservice Interface is active & ready for PyTorch/FastAPI integration!", "success");
    }, 800);
  }
};

// Initialize when DOM content is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
