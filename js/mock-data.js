/**
 * SmartCyclone AI - Centralized Demonstration Dataset
 * Realistic meteorological data for Bay of Bengal and Arabian Sea
 * Clear label: Demonstration Data for SIH 2026 Prototype
 */

const DEMO_DATASET = {
  activeCyclone: {
    id: 1,
    name: "Cyclone Remal",
    code: "BOB-01/2026",
    region: "Bay of Bengal",
    category: "Category 3 (Very Severe Cyclonic Storm)",
    status: "ACTIVE",
    maxWindSpeed: 145.0, // km/h
    minPressure: 945.0,   // hPa
    currentLatitude: 15.24,
    currentLongitude: 88.75,
    movementDirection: "North-East (045°)",
    riskLevel: "HIGH",
    formationDate: "2026-05-24T06:00:00",
    isDemoData: true,
    historicalTrack: [
      { id: 101, latitude: 11.20, longitude: 86.80, windSpeed: 55, pressure: 1002, timeStr: "48h ago", pointType: "HISTORICAL" },
      { id: 102, latitude: 12.15, longitude: 87.10, windSpeed: 75, pressure: 994,  timeStr: "36h ago", pointType: "HISTORICAL" },
      { id: 103, latitude: 13.40, longitude: 87.65, windSpeed: 95, pressure: 982,  timeStr: "24h ago", pointType: "HISTORICAL" },
      { id: 104, latitude: 14.30, longitude: 88.20, windSpeed: 120, pressure: 965, timeStr: "12h ago", pointType: "HISTORICAL" },
      { id: 105, latitude: 15.24, longitude: 88.75, windSpeed: 145, pressure: 945, timeStr: "NOW",     pointType: "CURRENT", confidence: 0.94 }
    ],
    predictedTrack: [
      { id: 105, latitude: 15.24, longitude: 88.75, windSpeed: 145, pressure: 945, timeStr: "NOW",  pointType: "CURRENT", confidence: 0.94, radius: 15 },
      { id: 106, latitude: 16.10, longitude: 89.30, windSpeed: 155, pressure: 940, timeStr: "+6H",  pointType: "PREDICTED_6H", confidence: 0.91, radius: 35 },
      { id: 107, latitude: 17.05, longitude: 89.95, windSpeed: 165, pressure: 934, timeStr: "+12H", pointType: "PREDICTED_12H", confidence: 0.87, radius: 55 },
      { id: 108, latitude: 18.90, longitude: 90.80, windSpeed: 175, pressure: 928, timeStr: "+24H", pointType: "PREDICTED_24H", confidence: 0.82, radius: 90 }
    ]
  },

  historicalCatalog: [
    {
      id: 1,
      name: "Cyclone Remal",
      code: "BOB-01/2026",
      region: "Bay of Bengal",
      category: "Category 3",
      maxWind: 145,
      minPressure: 945,
      duration: "4 Days",
      date: "May 2026",
      status: "ACTIVE",
      riskLevel: "HIGH"
    },
    {
      id: 2,
      name: "Cyclone Biparjoy",
      code: "ARB-02/2023",
      region: "Arabian Sea",
      category: "Category 3",
      maxWind: 165,
      minPressure: 954,
      duration: "11 Days",
      date: "Jun 2023",
      status: "HISTORICAL",
      riskLevel: "HIGH"
    },
    {
      id: 3,
      name: "Cyclone Mocha",
      code: "BOB-02/2023",
      region: "Bay of Bengal",
      category: "Category 5",
      maxWind: 215,
      minPressure: 918,
      duration: "6 Days",
      date: "May 2023",
      status: "HISTORICAL",
      riskLevel: "EXTREME"
    },
    {
      id: 4,
      name: "Cyclone Michaung",
      code: "BOB-04/2023",
      region: "Bay of Bengal",
      category: "Category 2",
      maxWind: 110,
      minPressure: 984,
      duration: "5 Days",
      date: "Dec 2023",
      status: "HISTORICAL",
      riskLevel: "MODERATE"
    },
    {
      id: 5,
      name: "Super Cyclone Amphan",
      code: "BOB-01/2020",
      region: "Bay of Bengal",
      category: "Category 5",
      maxWind: 260,
      minPressure: 907,
      duration: "6 Days",
      date: "May 2020",
      status: "HISTORICAL",
      riskLevel: "EXTREME"
    },
    {
      id: 6,
      name: "Cyclone Fani",
      code: "BOB-02/2019",
      region: "Bay of Bengal",
      category: "Category 5",
      maxWind: 215,
      minPressure: 932,
      duration: "8 Days",
      date: "Apr 2019",
      status: "HISTORICAL",
      riskLevel: "EXTREME"
    },
    {
      id: 7,
      name: "Cyclone Yaas",
      code: "BOB-02/2021",
      region: "Bay of Bengal",
      category: "Category 2",
      maxWind: 140,
      minPressure: 970,
      duration: "5 Days",
      date: "May 2021",
      status: "HISTORICAL",
      riskLevel: "HIGH"
    }
  ],

  sampleImages: [
    {
      id: "sample-1",
      name: "INSAT-3D_Thermal_Remal.png",
      satellite: "INSAT-3D TIR-1 Channel",
      label: "Cyclone Remal (Category 3)",
      size: "2.4 MB",
      desc: "Multi-spectral infrared radiance band showing defined spiral feeder bands & cloud top temperatures (-78°C).",
      detected: true,
      detectionConf: 0.94,
      classification: "Tropical Cyclone",
      category: "Category 3 (Very Severe)",
      classConf: 0.92,
      wind: 145,
      pressure: 945,
      direction: "North-East",
      coords: { lat: 15.24, lng: 88.75 }
    },
    {
      id: "sample-2",
      name: "Himawari8_Multispectral_Mocha.png",
      satellite: "Himawari-8 Multispectral",
      label: "Cyclone Mocha (Category 5 Super)",
      size: "3.1 MB",
      desc: "Clear symmetrical central eye formation with extreme deep convection cloud bands.",
      detected: true,
      detectionConf: 0.98,
      classification: "Super Tropical Cyclone",
      category: "Category 5 (Super Cyclone)",
      classConf: 0.96,
      wind: 215,
      pressure: 918,
      direction: "North-NorthEast",
      coords: { lat: 20.15, lng: 92.80 }
    },
    {
      id: "sample-3",
      name: "INSAT-3DR_WaterVapor_Arabian.png",
      satellite: "INSAT-3DR Water Vapor",
      label: "Cyclone Biparjoy (Arabian Sea)",
      size: "1.9 MB",
      desc: "Mid-tropospheric water vapor imagery demonstrating cyclonic vortex over East Central Arabian Sea.",
      detected: true,
      detectionConf: 0.92,
      classification: "Very Severe Cyclonic Storm",
      category: "Category 3",
      classConf: 0.89,
      wind: 130,
      pressure: 958,
      direction: "North",
      coords: { lat: 18.60, lng: 67.40 }
    },
    {
      id: "sample-4",
      name: "Sentinel3_OLCI_ClearMarine.png",
      satellite: "Sentinel-3 OLCI",
      label: "Clear Marine Weather (Non-Cyclone)",
      size: "1.7 MB",
      desc: "Routine sea surface cloud cover with absence of closed isobaric circulation.",
      detected: false,
      detectionConf: 0.96,
      classification: "No Tropical Disturbance",
      category: "Normal Marine Condition",
      classConf: 0.95,
      wind: 20,
      pressure: 1012,
      direction: "Calm / Variable",
      coords: { lat: 14.50, lng: 86.20 }
    }
  ],

  modelMetrics: {
    notice: "Illustrative Prototype Metrics - To be connected with actual ML pipeline benchmark",
    overallAccuracy: 94.6,
    overallPrecision: 93.8,
    overallRecall: 95.2,
    overallF1Score: 94.5,
    trackMaeKm: 42.5,
    intensityRmseKmh: 8.4,
    categories: [
      { name: "Cyclone Detection (Binary)", model: "Deep-SpatioTemporal-CNN", accuracy: 96.2, precision: 95.4, recall: 97.0, f1: 96.2, dataset: "18,500 Imagery Frames" },
      { name: "Intensity Classification", model: "Vision-Transformer (ViT-H/14)", accuracy: 93.1, precision: 92.3, recall: 93.8, f1: 93.0, dataset: "18,500 Imagery Frames" },
      { name: "24-Hour Track Prediction", model: "Bi-ConvLSTM + Physics Guided Net", accuracy: 89.4, precision: 88.5, recall: 90.2, f1: 89.3, dataset: "14,200 Trajectory Points" },
      { name: "Radiance Wind/Pressure Regression", model: "Multi-Radiance CNN-GRU Regressor", accuracy: 94.5, precision: 94.0, recall: 95.1, f1: 94.5, dataset: "16,800 Samples" }
    ]
  }
};
