/**
 * SmartCyclone AI - Satellite Image Upload & AI Pipeline Service
 * Handles user file upload, pre-loaded satellite samples, and simulated neural network scanning
 */

const UploadDemoService = {
  currentFile: null,
  currentSample: DEMO_DATASET.sampleImages[0],

  init() {
    this.setupDropzone();
    this.renderSampleList();
    this.selectSample(DEMO_DATASET.sampleImages[0]);
  },

  setupDropzone() {
    const dropzone = document.getElementById('uploadDropzone');
    const fileInput = document.getElementById('satelliteFileInput');

    if (!dropzone || !fileInput) return;

    ['dragenter', 'dragover'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add('drag-over');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove('drag-over');
      });
    });

    dropzone.addEventListener('drop', (e) => {
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        this.handleFileSelection(files[0]);
      }
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        this.handleFileSelection(e.target.files[0]);
      }
    });
  },

  renderSampleList() {
    const container = document.getElementById('sampleImagesGrid');
    if (!container) return;

    container.innerHTML = DEMO_DATASET.sampleImages.map((s, idx) => `
      <div class="sample-item ${idx === 0 ? 'selected' : ''}" onclick="UploadDemoService.selectSampleById('${s.id}')">
        <div class="sample-thumb-preview" style="height: 60px; background: linear-gradient(135deg, #0b1528, #1e293b); border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #38bdf8; font-size: 20px;">
          <i class="fas ${s.detected ? 'fa-hurricane' : 'fa-sun'}"></i>
        </div>
        <div class="sample-label" style="margin-top: 6px;">${s.label}</div>
        <div class="sample-sub">${s.satellite}</div>
      </div>
    `).join('');
  },

  selectSampleById(id) {
    const sample = DEMO_DATASET.sampleImages.find(s => s.id === id);
    if (sample) {
      this.selectSample(sample);
    }
  },

  selectSample(sample) {
    this.currentSample = sample;
    this.currentFile = null;

    // Highlight selected sample in grid
    document.querySelectorAll('.sample-item').forEach(el => el.classList.remove('selected'));
    const matchedEl = Array.from(document.querySelectorAll('.sample-item')).find(el => el.textContent.includes(sample.label));
    if (matchedEl) matchedEl.classList.add('selected');

    // Update Preview Panel
    const previewContainer = document.getElementById('imagePreviewHUD');
    if (previewContainer) {
      previewContainer.innerHTML = `
        <div style="position: relative; width: 100%; height: 260px; background: radial-gradient(circle, #172554 0%, #060a12 80%); border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; overflow: hidden; border: 1px solid rgba(56, 189, 248, 0.25);">
          <div style="position: absolute; top: 12px; left: 12px; font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; color: #38bdf8; background: rgba(0,0,0,0.6); padding: 2px 8px; border-radius: 4px; border: 1px solid rgba(56, 189, 248, 0.3);">
            RAW MULTISPECTRAL: ${sample.satellite}
          </div>
          <i class="fas ${sample.detected ? 'fa-meteor' : 'fa-cloud-sun'}" style="font-size: 72px; color: ${sample.detected ? '#38bdf8' : '#10b981'}; filter: drop-shadow(0 0 20px rgba(56, 189, 248, 0.6));"></i>
          <div style="margin-top: 14px; font-weight: 600; font-size: 0.95rem; color: #ffffff;">${sample.name}</div>
          <div style="font-size: 0.75rem; color: #94a3b8; font-family: 'JetBrains Mono', monospace;">Payload Size: ${sample.size} | Lat: ${sample.coords.lat}°N, Lon: ${sample.coords.lng}°E</div>
        </div>
      `;
    }

    // Update metadata badge
    const metaWrap = document.getElementById('selectedImageMetadata');
    if (metaWrap) {
      metaWrap.innerHTML = `
        <div style="display: flex; justify-content: space-between; font-size: 0.82rem; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.06);">
          <span style="color: #64748b;">Source Sensor:</span>
          <span style="color: #f1f5f9; font-weight: 500;">${sample.satellite}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.82rem; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.06);">
          <span style="color: #64748b;">Description:</span>
          <span style="color: #94a3b8; font-size: 0.75rem; max-width: 60%; text-align: right;">${sample.desc}</span>
        </div>
      `;
    }
  },

  handleFileSelection(file) {
    this.currentFile = file;
    this.currentSample = null;

    document.querySelectorAll('.sample-item').forEach(el => el.classList.remove('selected'));

    const previewContainer = document.getElementById('imagePreviewHUD');
    if (previewContainer) {
      const reader = new FileReader();
      reader.onload = (e) => {
        previewContainer.innerHTML = `
          <div style="position: relative; width: 100%; height: 260px; background: #060a12; border-radius: 8px; overflow: hidden; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(56, 189, 248, 0.3);">
            <div style="position: absolute; top: 12px; left: 12px; font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; color: #38bdf8; background: rgba(0,0,0,0.6); padding: 2px 8px; border-radius: 4px;">
              USER UPLOADED: ${(file.size / (1024*1024)).toFixed(2)} MB
            </div>
            <img src="${e.target.result}" alt="Uploaded satellite preview" style="max-height: 100%; max-width: 100%; object-fit: contain;">
          </div>
        `;
      };
      reader.readAsDataURL(file);
    }

    const metaWrap = document.getElementById('selectedImageMetadata');
    if (metaWrap) {
      metaWrap.innerHTML = `
        <div style="display: flex; justify-content: space-between; font-size: 0.82rem; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.06);">
          <span style="color: #64748b;">Uploaded File:</span>
          <span style="color: #38bdf8; font-weight: 600;">${file.name}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.82rem; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.06);">
          <span style="color: #64748b;">File Size:</span>
          <span style="color: #f1f5f9;">${(file.size / (1024*1024)).toFixed(2)} MB</span>
        </div>
      `;
    }

    UIHelpers.showToast(`Selected file: ${file.name}`, 'info');
  },

  clearSelectedImage() {
    this.currentFile = null;
    this.selectSample(DEMO_DATASET.sampleImages[0]);
    UIHelpers.showToast("Reset to default demonstration sample", "info");
  },

  async runAIPipeline() {
    const scannerOverlay = document.getElementById('scannerOverlay');
    const analyzeBtn = document.getElementById('analyzeActionBtn');

    if (scannerOverlay) scannerOverlay.classList.add('active');
    if (analyzeBtn) {
      analyzeBtn.disabled = true;
      analyzeBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Processing Neural Net...`;
    }

    try {
      let result;
      if (this.currentFile) {
        const fd = new FormData();
        fd.append('file', this.currentFile);
        fd.append('satelliteSource', 'INSAT-3D Multi-Spectral');
        result = await ApiService.analyzeImageUpload(fd);
      } else {
        result = await ApiService.analyzeSampleImage(this.currentSample || DEMO_DATASET.sampleImages[0]);
      }

      // Simulated realistic neural network scanning delay (1.2 seconds for presentation effect)
      await new Promise(resolve => setTimeout(resolve, 1200));

      if (scannerOverlay) scannerOverlay.classList.remove('active');
      if (analyzeBtn) {
        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = `<i class="fas fa-brain"></i> Execute AI Inference Pipeline`;
      }

      UIHelpers.showToast("Neural Network Inference Completed Successfully!", "success");

      // Update Results and switch to Detection View
      App.updateDetectionView(result);
      App.navigateTo('detection');

    } catch (err) {
      if (scannerOverlay) scannerOverlay.classList.remove('active');
      if (analyzeBtn) {
        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = `<i class="fas fa-brain"></i> Execute AI Inference Pipeline`;
      }
      UIHelpers.showToast(`Analysis error: ${err.message}`, 'error');
    }
  }
};
