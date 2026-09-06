/**
 * SmartCyclone AI - Frontend Configuration
 * SIH Problem Statement SIH26070
 */

const APP_CONFIG = {
  appName: 'SmartCyclone AI',
  version: '1.0.0-PROTOTYPE',
  sihProblemStatement: 'SIH26070',
  
  // Base REST API URL (Default relative to current host)
  apiBaseUrl: window.location.origin.includes('http') ? window.location.origin : 'http://localhost:8080',
  
  // Endpoints mapping
  endpoints: {
    dashboardStats: '/api/dashboard/stats',
    cyclones: '/api/cyclones',
    activeCyclones: '/api/cyclones/active',
    cycloneById: (id) => `/api/cyclones/${id}`,
    historicalTrack: (id) => `/api/cyclones/${id}/historical-track`,
    predictedTrack: (id) => `/api/cyclones/${id}/predicted-track`,
    predictions: '/api/predictions',
    predictionsByCyclone: (id) => `/api/predictions/cyclone/${id}`,
    historicalArchive: '/api/historical',
    modelPerformance: '/api/model/performance',
    uploadAnalysis: '/api/analysis/upload',
    sampleAnalysis: '/api/analysis/sample',
    systemStatus: '/api/system/status'
  },
  
  // Fallback to client-side realistic mock engine if backend server is unreachable
  enableClientFallback: true,
  
  // Map center defaults (Bay of Bengal / North Indian Ocean focus)
  mapDefaults: {
    lat: 16.50,
    lng: 88.50,
    zoom: 5.5
  }
};
