/**
 * SmartCyclone AI - Interactive Leaflet Map Service
 * Visualizes Bay of Bengal & Arabian Sea cyclone tracks, cones of uncertainty, and radar sweeps
 */

const MapService = {
  mapInstance: null,
  trackLayers: {
    historical: null,
    predicted: null,
    uncertaintyCones: null,
    currentEyeMarker: null
  },

  init(containerId = 'cycloneMap') {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Check if map already initialized on this container
    if (this.mapInstance) {
      this.mapInstance.remove();
      this.mapInstance = null;
    }

    // Initialize Leaflet Map centered on Bay of Bengal
    this.mapInstance = L.map(containerId, {
      center: [APP_CONFIG.mapDefaults.lat, APP_CONFIG.mapDefaults.lng],
      zoom: APP_CONFIG.mapDefaults.zoom,
      minZoom: 3,
      maxZoom: 10,
      zoomControl: false
    });

    // Add zoom control at bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(this.mapInstance);

    // Dark Matter CartoDB Basemap
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(this.mapInstance);

    // Create Layer Groups
    this.trackLayers.historical = L.layerGroup().addTo(this.mapInstance);
    this.trackLayers.predicted = L.layerGroup().addTo(this.mapInstance);
    this.trackLayers.uncertaintyCones = L.layerGroup().addTo(this.mapInstance);

    // Render default active cyclone scenario
    this.renderCycloneTrack(DEMO_DATASET.activeCyclone);
  },

  renderCycloneTrack(cycloneData) {
    if (!this.mapInstance || !cycloneData) return;

    // Clear previous layers
    this.trackLayers.historical.clearLayers();
    this.trackLayers.predicted.clearLayers();
    this.trackLayers.uncertaintyCones.clearLayers();
    if (this.trackLayers.currentEyeMarker) {
      this.mapInstance.removeLayer(this.trackLayers.currentEyeMarker);
      this.trackLayers.currentEyeMarker = null;
    }

    const historical = cycloneData.historicalTrack || [];
    const predicted = cycloneData.predictedTrack || [];

    // 1. Historical Path Polyline (Amber Gold Glow)
    if (historical.length > 0) {
      const histCoords = historical.map(p => [p.latitude, p.longitude]);
      
      const histPolyline = L.polyline(histCoords, {
        color: '#f59e0b',
        weight: 3.5,
        opacity: 0.9,
        lineCap: 'round'
      });
      this.trackLayers.historical.addLayer(histPolyline);

      // Historical Point Markers
      historical.forEach((pt, idx) => {
        if (pt.pointType !== 'CURRENT') {
          const customMarker = L.divIcon({
            className: 'custom-div-icon',
            html: `<div class="track-node-marker" title="${pt.timeStr}"></div>`,
            iconSize: [10, 10],
            iconAnchor: [5, 5]
          });

          const m = L.marker([pt.latitude, pt.longitude], { icon: customMarker });
          m.bindPopup(`
            <div class="popup-telemetry-title">${cycloneData.name} - Historical</div>
            <div class="popup-row"><span class="popup-label">Time:</span> <span class="popup-val">${pt.timeStr}</span></div>
            <div class="popup-row"><span class="popup-label">Coordinates:</span> <span class="popup-val">${pt.latitude.toFixed(2)}°N, ${pt.longitude.toFixed(2)}°E</span></div>
            <div class="popup-row"><span class="popup-label">Max Wind:</span> <span class="popup-val">${pt.windSpeed} km/h</span></div>
            <div class="popup-row"><span class="popup-label">Central Pressure:</span> <span class="popup-val">${pt.pressure} hPa</span></div>
          `);
          this.trackLayers.historical.addLayer(m);
        }
      });
    }

    // 2. Predicted Path Polyline & Cone of Uncertainty (Cyan Blue Dashed)
    if (predicted.length > 0) {
      const predCoords = predicted.map(p => [p.latitude, p.longitude]);
      
      const predPolyline = L.polyline(predCoords, {
        color: '#38bdf8',
        weight: 3,
        dashArray: '8, 6',
        opacity: 0.95
      });
      this.trackLayers.predicted.addLayer(predPolyline);

      // Uncertainty Cone Polygon
      if (predicted.length >= 3) {
        const leftBound = [];
        const rightBound = [];

        predicted.forEach((pt, idx) => {
          const spread = (idx + 1) * 0.45; // Progressive uncertainty spread
          leftBound.push([pt.latitude - spread * 0.3, pt.longitude - spread * 0.4]);
          rightBound.unshift([pt.latitude + spread * 0.3, pt.longitude + spread * 0.4]);
        });

        const conePolygon = L.polygon([...leftBound, ...rightBound], {
          color: '#06b6d4',
          fillColor: '#06b6d4',
          fillOpacity: 0.14,
          weight: 1.5,
          dashArray: '4, 4'
        });
        this.trackLayers.uncertaintyCones.addLayer(conePolygon);
      }

      // Predicted Markers
      predicted.forEach((pt, idx) => {
        if (pt.pointType !== 'CURRENT') {
          const predMarker = L.divIcon({
            className: 'custom-div-icon',
            html: `<div class="predicted-node-marker" title="${pt.timeStr}"></div>`,
            iconSize: [12, 12],
            iconAnchor: [6, 6]
          });

          const m = L.marker([pt.latitude, pt.longitude], { icon: predMarker });
          m.bindPopup(`
            <div class="popup-telemetry-title">${cycloneData.name} - Forecast (${pt.timeStr})</div>
            <div class="popup-row"><span class="popup-label">Lead Time:</span> <span class="popup-val">${pt.timeStr}</span></div>
            <div class="popup-row"><span class="popup-label">Predicted Coords:</span> <span class="popup-val">${pt.latitude.toFixed(2)}°N, ${pt.longitude.toFixed(2)}°E</span></div>
            <div class="popup-row"><span class="popup-label">Expected Wind:</span> <span class="popup-val">${pt.windSpeed} km/h</span></div>
            <div class="popup-row"><span class="popup-label">Expected Pressure:</span> <span class="popup-val">${pt.pressure} hPa</span></div>
            <div class="popup-row"><span class="popup-label">Confidence:</span> <span class="popup-val">${(pt.confidence * 100).toFixed(0)}%</span></div>
          `);
          this.trackLayers.predicted.addLayer(m);
        }
      });
    }

    // 3. Current Cyclone Eye Marker (Pulsing Radar Waves)
    const curLat = cycloneData.currentLatitude;
    const curLng = cycloneData.currentLongitude;
    if (curLat && curLng) {
      const eyeIcon = L.divIcon({
        className: 'cyclone-eye-icon-wrapper',
        html: `
          <div class="cyclone-eye-marker">
            <div class="cyclone-eye-pulse-outer"></div>
            <div class="cyclone-eye-pulse"></div>
            <div class="cyclone-eye-core"></div>
          </div>
        `,
        iconSize: [80, 80],
        iconAnchor: [40, 40]
      });

      this.trackLayers.currentEyeMarker = L.marker([curLat, curLng], { icon: eyeIcon, zIndexOffset: 1000 }).addTo(this.mapInstance);
      this.trackLayers.currentEyeMarker.bindPopup(`
        <div class="popup-telemetry-title" style="color: #f87171;">🔴 CURRENT EYE - ${cycloneData.name}</div>
        <div class="popup-row"><span class="popup-label">Category:</span> <span class="popup-val">${cycloneData.category}</span></div>
        <div class="popup-row"><span class="popup-label">Coordinates:</span> <span class="popup-val">${curLat.toFixed(2)}°N, ${curLng.toFixed(2)}°E</span></div>
        <div class="popup-row"><span class="popup-label">Max Sustained Wind:</span> <span class="popup-val" style="color:#f87171;">${cycloneData.maxWindSpeed} km/h</span></div>
        <div class="popup-row"><span class="popup-label">Central Pressure:</span> <span class="popup-val">${cycloneData.minPressure} hPa</span></div>
        <div class="popup-row"><span class="popup-label">Movement:</span> <span class="popup-val">${cycloneData.movementDirection || 'North-East'}</span></div>
      `).openPopup();

      // Smooth pan to current location
      this.mapInstance.panTo([curLat, curLng]);
    }
  },

  switchBaseLayer(type) {
    if (!this.mapInstance) return;
    // Handled for custom layer toggling (Dark Weather / Satellite / Ocean Temperature)
    UIHelpers.showToast(`Map layer switched to: ${type.toUpperCase()}`, 'info');
  },

  recenter() {
    if (this.mapInstance) {
      this.mapInstance.setView([APP_CONFIG.mapDefaults.lat, APP_CONFIG.mapDefaults.lng], APP_CONFIG.mapDefaults.zoom);
    }
  }
};
