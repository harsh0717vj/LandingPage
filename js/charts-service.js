/**
 * SmartCyclone AI - Chart.js Telemetry Service
 * Renders professional meteorological line graphs and model performance charts
 */

const ChartsService = {
  windChartInstance: null,
  pressureChartInstance: null,
  trainingChartInstance: null,

  initTelemetryCharts() {
    this.renderWindSpeedChart();
    this.renderCentralPressureChart();
  },

  renderWindSpeedChart(cycloneData = DEMO_DATASET.activeCyclone) {
    const canvas = document.getElementById('windSpeedChart');
    if (!canvas) return;

    if (this.windChartInstance) {
      this.windChartInstance.destroy();
    }

    const labels = ['-48h', '-36h', '-24h', '-12h', 'NOW', '+6h', '+12h', '+24h'];
    const historicalWinds = [55, 75, 95, 120, 145, null, null, null];
    const predictedWinds = [null, null, null, null, 145, 155, 165, 175];

    const ctx = canvas.getContext('2d');
    
    // Gradient fill
    const gradHist = ctx.createLinearGradient(0, 0, 0, 250);
    gradHist.addColorStop(0, 'rgba(245, 158, 11, 0.35)');
    gradHist.addColorStop(1, 'rgba(245, 158, 11, 0.0)');

    const gradPred = ctx.createLinearGradient(0, 0, 0, 250);
    gradPred.addColorStop(0, 'rgba(56, 189, 248, 0.35)');
    gradPred.addColorStop(1, 'rgba(56, 189, 248, 0.0)');

    this.windChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Historical Wind Speed (km/h)',
            data: historicalWinds,
            borderColor: '#f59e0b',
            backgroundColor: gradHist,
            borderWidth: 2.5,
            fill: true,
            tension: 0.35,
            pointBackgroundColor: '#f59e0b',
            pointRadius: 4
          },
          {
            label: 'Predicted Wind Speed (km/h)',
            data: predictedWinds,
            borderColor: '#38bdf8',
            backgroundColor: gradPred,
            borderWidth: 2.5,
            borderDash: [5, 5],
            fill: true,
            tension: 0.35,
            pointBackgroundColor: '#38bdf8',
            pointRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: '#94a3b8', font: { family: 'Inter', size: 11 } }
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            titleColor: '#ffffff',
            bodyColor: '#38bdf8',
            borderColor: 'rgba(56, 189, 248, 0.3)',
            borderWidth: 1
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#64748b' }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#64748b' },
            title: { display: true, text: 'Wind Speed (km/h)', color: '#64748b' }
          }
        }
      }
    });
  },

  renderCentralPressureChart(cycloneData = DEMO_DATASET.activeCyclone) {
    const canvas = document.getElementById('pressureChart');
    if (!canvas) return;

    if (this.pressureChartInstance) {
      this.pressureChartInstance.destroy();
    }

    const labels = ['-48h', '-36h', '-24h', '-12h', 'NOW', '+6h', '+12h', '+24h'];
    const historicalPressure = [1002, 994, 982, 965, 945, null, null, null];
    const predictedPressure = [null, null, null, null, 945, 940, 934, 928];

    const ctx = canvas.getContext('2d');

    const gradPress = ctx.createLinearGradient(0, 0, 0, 250);
    gradPress.addColorStop(0, 'rgba(239, 68, 68, 0.0)');
    gradPress.addColorStop(1, 'rgba(239, 68, 68, 0.3)');

    this.pressureChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Historical Pressure (hPa)',
            data: historicalPressure,
            borderColor: '#f59e0b',
            borderWidth: 2.5,
            tension: 0.35,
            pointBackgroundColor: '#f59e0b',
            pointRadius: 4
          },
          {
            label: 'Predicted Central Pressure (hPa)',
            data: predictedPressure,
            borderColor: '#ef4444',
            backgroundColor: gradPress,
            borderWidth: 2.5,
            borderDash: [5, 5],
            fill: true,
            tension: 0.35,
            pointBackgroundColor: '#ef4444',
            pointRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: '#94a3b8', font: { family: 'Inter', size: 11 } }
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            titleColor: '#ffffff',
            bodyColor: '#ef4444',
            borderColor: 'rgba(239, 68, 68, 0.3)',
            borderWidth: 1
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#64748b' }
          },
          y: {
            reverse: false,
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#64748b' },
            title: { display: true, text: 'Central Pressure (hPa)', color: '#64748b' }
          }
        }
      }
    });
  },

  renderModelPerformanceTrainingChart() {
    const canvas = document.getElementById('modelTrainingChart');
    if (!canvas) return;

    if (this.trainingChartInstance) {
      this.trainingChartInstance.destroy();
    }

    const epochs = ['Epoch 5', 'Epoch 10', 'Epoch 15', 'Epoch 20', 'Epoch 25', 'Epoch 30', 'Epoch 35', 'Epoch 40', 'Epoch 45', 'Epoch 50'];
    const trainLoss = [0.68, 0.52, 0.41, 0.33, 0.26, 0.21, 0.18, 0.15, 0.13, 0.11];
    const valLoss = [0.71, 0.55, 0.44, 0.36, 0.29, 0.25, 0.22, 0.19, 0.18, 0.16];
    const valAcc = [74, 81, 86, 89, 91, 92, 93, 94, 94.2, 94.6];

    const ctx = canvas.getContext('2d');

    this.trainingChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: epochs,
        datasets: [
          {
            label: 'Validation Accuracy (%)',
            data: valAcc,
            borderColor: '#10b981',
            borderWidth: 2.5,
            tension: 0.3,
            yAxisID: 'y1'
          },
          {
            label: 'Training Loss',
            data: trainLoss,
            borderColor: '#38bdf8',
            borderWidth: 2,
            tension: 0.3,
            yAxisID: 'y'
          },
          {
            label: 'Validation Loss',
            data: valLoss,
            borderColor: '#f59e0b',
            borderWidth: 2,
            borderDash: [4, 4],
            tension: 0.3,
            yAxisID: 'y'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            labels: { color: '#94a3b8', font: { family: 'Inter', size: 11 } }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#64748b' }
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#64748b' },
            title: { display: true, text: 'Loss', color: '#64748b' }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            grid: { drawOnChartArea: false },
            ticks: { color: '#10b981' },
            title: { display: true, text: 'Accuracy (%)', color: '#10b981' }
          }
        }
      }
    });
  }
};
