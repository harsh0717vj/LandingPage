/**
 * SmartCyclone AI - REST API Service Client
 * Handles communication with Spring Boot backend with automatic graceful fallback
 */

const ApiService = {
  async getDashboardStats() {
    try {
      const response = await fetch(`${APP_CONFIG.apiBaseUrl}${APP_CONFIG.endpoints.dashboardStats}`, {
        headers: { 'Accept': 'application/json' }
      });
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      return await response.json();
    } catch (err) {
      console.warn('Backend API offline, serving local demonstration telemetry dataset:', err.message);
      return {
        totalCyclonesAnalyzed: 27,
        activeCyclones: 3,
        predictionsGenerated: 18,
        highRiskCyclones: 2,
        currentFeaturedCyclone: DEMO_DATASET.activeCyclone,
        recentCyclones: DEMO_DATASET.historicalCatalog.slice(0, 5),
        notice: "Demonstration & Prototype Telemetry Data"
      };
    }
  },

  async getAllCyclones() {
    try {
      const response = await fetch(`${APP_CONFIG.apiBaseUrl}${APP_CONFIG.endpoints.cyclones}`);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      return await response.json();
    } catch (err) {
      return DEMO_DATASET.historicalCatalog;
    }
  },

  async getCycloneById(id) {
    try {
      const response = await fetch(`${APP_CONFIG.apiBaseUrl}${APP_CONFIG.endpoints.cycloneById(id)}`);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      return await response.json();
    } catch (err) {
      if (id === 1 || id === '1') return DEMO_DATASET.activeCyclone;
      const found = DEMO_DATASET.historicalCatalog.find(c => c.id == id);
      return found || DEMO_DATASET.activeCyclone;
    }
  },

  async analyzeImageUpload(formData) {
    try {
      const response = await fetch(`${APP_CONFIG.apiBaseUrl}${APP_CONFIG.endpoints.uploadAnalysis}`, {
        method: 'POST',
        body: formData
      });
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      return await response.json();
    } catch (err) {
      console.warn('Backend upload API offline, returning simulated AI inference:', err.message);
      // Fallback simulated inference
      return {
        id: Date.now(),
        imageName: formData.get('file')?.name || 'satellite_scan.png',
        satelliteSource: formData.get('satelliteSource') || 'INSAT-3D',
        analyzedAt: new Date().toISOString(),
        cycloneDetected: true,
        detectionConfidence: 0.94,
        classificationType: "Tropical Cyclone",
        category: "Category 3 (Very Severe Cyclonic Storm)",
        classificationConfidence: 0.92,
        estimatedWindSpeed: 145.0,
        estimatedCentralPressure: 945.0,
        movementDirection: "North-East (045°)",
        latitude: 15.24,
        longitude: 88.75,
        isMockMlResponse: true,
        notes: "Real-time multi-spectral radiance pattern analysis (Client Fallback)"
      };
    }
  },

  async analyzeSampleImage(sample) {
    try {
      const response = await fetch(`${APP_CONFIG.apiBaseUrl}${APP_CONFIG.endpoints.sampleAnalysis}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageName: sample.name,
          satelliteSource: sample.satellite,
          notes: sample.desc
        })
      });
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      return await response.json();
    } catch (err) {
      return {
        id: Date.now(),
        imageName: sample.name,
        satelliteSource: sample.satellite,
        analyzedAt: new Date().toISOString(),
        cycloneDetected: sample.detected,
        detectionConfidence: sample.detectionConf,
        classificationType: sample.classification,
        category: sample.category,
        classificationConfidence: sample.classConf,
        estimatedWindSpeed: sample.wind,
        estimatedCentralPressure: sample.pressure,
        movementDirection: sample.direction,
        latitude: sample.coords.lat,
        longitude: sample.coords.lng,
        isMockMlResponse: true,
        notes: sample.desc
      };
    }
  },

  async getModelPerformance() {
    try {
      const response = await fetch(`${APP_CONFIG.apiBaseUrl}${APP_CONFIG.endpoints.modelPerformance}`);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      return await response.json();
    } catch (err) {
      return DEMO_DATASET.modelMetrics;
    }
  },

  async getHistoricalArchive(region, category) {
    try {
      let url = `${APP_CONFIG.apiBaseUrl}${APP_CONFIG.endpoints.historicalArchive}`;
      const params = new URLSearchParams();
      if (region) params.append('region', region);
      if (category) params.append('category', category);
      if (params.toString()) url += `?${params.toString()}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      return await response.json();
    } catch (err) {
      let list = [...DEMO_DATASET.historicalCatalog];
      if (region) list = list.filter(c => c.region.toLowerCase().includes(region.toLowerCase()));
      if (category) list = list.filter(c => c.category.toLowerCase().includes(category.toLowerCase()));
      return list;
    }
  },

  async getSystemStatus() {
    try {
      const response = await fetch(`${APP_CONFIG.apiBaseUrl}${APP_CONFIG.endpoints.systemStatus}`);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      return await response.json();
    } catch (err) {
      return {
        appName: APP_CONFIG.appName,
        sihProblemStatement: APP_CONFIG.sihProblemStatement,
        status: "STANDALONE_CLIENT_READY",
        mlServiceStatus: "Built-in Client Simulation (Ready for Spring Boot / Python ML Microservice)",
        isMockMlMode: true,
        databaseStatus: "In-Memory / Local Cache"
      };
    }
  }
};
