/**
 * FusionLabs3D — Owner Portal & Visual In-Place Editor
 * Handles Firebase Authentication, interactive text editing, image replacements, and cloud publishing.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Session State
  let unsavedCount = 0;
  let stagedTexts = {};
  let stagedImages = {};
  let materialsData = [];
  let currentEditingImgId = null;

  // DOM Elements
  const adminGate = document.getElementById('adminGate');
  const adminEditorApp = document.getElementById('adminEditorApp');
  const gateEmail = document.getElementById('gateEmail');
  const gatePassword = document.getElementById('gatePassword');
  const gateError = document.getElementById('gateError');
  const editorChangeCount = document.getElementById('editorChangeCount');
  const publishBtn = document.getElementById('publishBtn');

  // Image Modal
  const imageModalOverlay = document.getElementById('imageModalOverlay');
  const imgModalPreview = document.getElementById('imgModalPreview');
  const imgModalFileInput = document.getElementById('imgModalFileInput');
  const imgModalUrlInput = document.getElementById('imgModalUrlInput');

  // Material Modal
  const materialModalOverlay = document.getElementById('materialModalOverlay');
  const materialForm = document.getElementById('materialForm');
  const modalTitle = document.getElementById('modalTitle');
  const modalMatId = document.getElementById('modalMatId');
  const modalMatName = document.getElementById('modalMatName');
  const modalMatClass = document.getElementById('modalMatClass');
  const modalMatCode = document.getElementById('modalMatCode');
  const modalMatCategory = document.getElementById('modalMatCategory');
  const modalMatSummary = document.getElementById('modalMatSummary');
  const modalMatChar = document.getElementById('modalMatChar');
  const modalMatThermal = document.getElementById('modalMatThermal');
  const modalMatUse = document.getElementById('modalMatUse');
  const modalMatTags = document.getElementById('modalMatTags');
  const modalMatReqs = document.getElementById('modalMatReqs');
  const modalMatFeatured = document.getElementById('modalMatFeatured');

  // 1. Toast Notification
  function showToast(msg, isSuccess = true) {
    let toast = document.querySelector('.editor-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'editor-toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span>${isSuccess ? '✅' : '⚠️'}</span> <span>${msg}</span>`;
    toast.style.borderLeftColor = isSuccess ? '#10B981' : '#EF4444';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
  }

  function markChange() {
    unsavedCount++;
    if (editorChangeCount) {
      editorChangeCount.textContent = `${unsavedCount} Unsaved Change${unsavedCount > 1 ? 's' : ''}`;
      editorChangeCount.style.color = '#F59E0B';
    }
  }

  function resetChanges() {
    unsavedCount = 0;
    stagedTexts = {};
    stagedImages = {};
    if (editorChangeCount) {
      editorChangeCount.textContent = 'All changes saved';
      editorChangeCount.style.color = '#10B981';
    }
  }

  // 2. Real Firebase Authentication (No hardcoded passwords)
  const ADMIN_EMAIL = 'solutions.fusionlabs3d@gmail.com';

  window.handleGateUnlock = async function(e) {
    if (e) e.preventDefault();
    const email = gateEmail ? gateEmail.value.trim() : ADMIN_EMAIL;
    const pass = gatePassword ? gatePassword.value : '';
    const btn = document.getElementById('gateUnlockBtn');

    if (!pass) {
      if (gateError) {
        gateError.textContent = 'Please enter your administrator password.';
        gateError.style.display = 'block';
      }
      return;
    }

    if (typeof firebaseAuth === 'undefined' || !firebaseAuth) {
      if (gateError) {
        gateError.textContent = 'Firebase Authentication is not initialized. Please verify firebase-config.js.';
        gateError.style.display = 'block';
      }
      return;
    }

    try {
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span>AUTHENTICATING...</span>';
      }
      if (gateError) gateError.style.display = 'none';

      const cred = await firebaseAuth.signInWithEmailAndPassword(email, pass);
      if (cred.user.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        await firebaseAuth.signOut();
        throw new Error('Access denied: Account is not authorized as site administrator.');
      }
      // Auth observer will automatically call unlockEditorUI()
    } catch (err) {
      console.error('Firebase Auth error:', err);
      if (gateError) {
        let msg = 'Authentication failed. Please check credentials.';
        if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
          msg = 'Incorrect password for administrator account.';
        } else if (err.code === 'auth/user-not-found') {
          msg = 'Administrator account not found in Firebase.';
        } else if (err.message) {
          msg = err.message;
        }
        gateError.textContent = msg;
        gateError.style.display = 'block';
      }
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<span>UNLOCK DASHBOARD &rarr;</span>';
      }
      if (gatePassword) {
        gatePassword.select();
      }
    }
  };

  window.lockAdminGate = async function() {
    if (typeof firebaseAuth !== 'undefined' && firebaseAuth) {
      try {
        await firebaseAuth.signOut();
      } catch (err) {}
    }
    if (adminGate) adminGate.style.display = 'flex';
    if (adminEditorApp) adminEditorApp.style.display = 'none';
    if (gatePassword) {
      gatePassword.value = '';
    }
    showToast('Signed out of administrative session.', false);
  };

  window.handlePasswordReset = async function() {
    if (typeof firebaseAuth === 'undefined' || !firebaseAuth) {
      alert('Firebase Auth is not initialized.');
      return;
    }
    const email = gateEmail ? gateEmail.value.trim() : ADMIN_EMAIL;
    try {
      await firebaseAuth.sendPasswordResetEmail(email);
      alert(`Password reset instructions sent to ${email}. Please check your inbox.`);
    } catch (err) {
      alert('Password reset notice: ' + (err.message || err.code));
    }
  };

  function unlockEditorUI() {
    if (adminGate) adminGate.style.display = 'none';
    if (adminEditorApp) adminEditorApp.style.display = 'block';
    initInPlaceEditing();
    loadExistingConfig();
    showToast('Authenticated as ' + ADMIN_EMAIL + '. Edit mode active.');
  }

  // Listen to Firebase Auth state
  if (typeof firebaseAuth !== 'undefined' && firebaseAuth) {
    firebaseAuth.onAuthStateChanged((user) => {
      if (user && user.email && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        unlockEditorUI();
      } else {
        if (adminGate) adminGate.style.display = 'flex';
        if (adminEditorApp) adminEditorApp.style.display = 'none';
      }
    });
  }

  // 3. Make Page Text Editable
  function initInPlaceEditing() {
    const editableSelectors = [
      '.hero-cinematic-title',
      '.hero-cinematic-desc',
      '.highlight-lead-title',
      '.highlight-lead-sub',
      '.siemens-section-title',
      '.siemens-section-sub',
      '.story-title',
      '.story-desc',
      '.stacked-navy-title',
      '.stacked-navy-desc',
      '.stacked-light-title',
      '.stacked-light-desc',
      '.autodesk-card-name',
      '.autodesk-card-desc',
      '.proto-title',
      '.proto-desc',
      '.matrix-heading',
      '.matrix-lead',
      '.hero-title',
      '.hero-description',
      '.trust-section .section-title',
      '.trust-section .section-subtitle',
      '.about-lead',
      '.about-text',
      '.quote-cta-title',
      '.quote-cta-desc'
    ];

    editableSelectors.forEach(selector => {
      const els = document.querySelectorAll(selector);
      els.forEach((el, index) => {
        el.setAttribute('contenteditable', 'true');
        el.classList.add('editable-active');
        el.setAttribute('title', 'Click to edit text directly on webpage');

        el.addEventListener('input', () => {
          const key = `${selector}_${index}`;
          stagedTexts[key] = el.innerHTML;
          markChange();
        });
      });
    });
  }

  // 4. Image Replacement System
  window.openImageReplacer = function(imgId) {
    currentEditingImgId = imgId;
    const targetImg = document.querySelector(`[data-img-id="${imgId}"]`);
    if (targetImg && imgModalPreview) {
      imgModalPreview.src = targetImg.src;
    }
    if (imgModalUrlInput) {
      imgModalUrlInput.value = targetImg ? targetImg.getAttribute('src') : '';
    }
    if (imgModalFileInput) {
      imgModalFileInput.value = '';
    }
    if (imageModalOverlay) {
      imageModalOverlay.style.display = 'flex';
    }
  };

  window.closeImageModal = function() {
    if (imageModalOverlay) imageModalOverlay.style.display = 'none';
    currentEditingImgId = null;
  };

  window.previewManualUrl = function(url) {
    if (imgModalPreview && url.trim()) {
      imgModalPreview.src = url.trim();
    }
  };

  window.choosePresetImg = function(path) {
    if (imgModalPreview) imgModalPreview.src = path;
    if (imgModalUrlInput) imgModalUrlInput.value = path;
  };

  window.handleImageFileUpload = function(e) {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2.5 * 1024 * 1024) {
        alert('Image size exceeds 2.5MB. Please choose an optimized web image.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        if (imgModalPreview) imgModalPreview.src = dataUrl;
        if (imgModalUrlInput) imgModalUrlInput.value = dataUrl;
      };
      reader.readAsDataURL(file);
    }
  };

  window.applyImageChange = function() {
    if (!currentEditingImgId) return;
    const newSrc = imgModalPreview.src;
    const targetImg = document.querySelector(`[data-img-id="${currentEditingImgId}"]`);
    if (targetImg && newSrc) {
      targetImg.src = newSrc;
      stagedImages[currentEditingImgId] = newSrc;
      markChange();
      showToast('Image updated on page!');
    }
    closeImageModal();
  };

  // 5. Material Specifications Modal
  window.openMaterialModal = function(matId) {
    if (!materialModalOverlay || !materialForm) return;
    materialForm.reset();

    if (matId) {
      modalTitle.textContent = 'Edit Material Specifications';
      modalMatId.value = matId;

      const card = document.querySelector(`.material-card[data-id="${matId}"]`);
      if (card) {
        modalMatName.value = card.querySelector('.material-name') ? card.querySelector('.material-name').textContent.trim() : '';
        modalMatClass.value = card.querySelector('.mat-class') ? card.querySelector('.mat-class').textContent.trim() : '';
        modalMatCode.value = card.querySelector('.mat-code') ? card.querySelector('.mat-code').textContent.trim() : '';
        modalMatCategory.value = card.querySelector('.material-category') ? card.querySelector('.material-category').textContent.trim() : '';
        modalMatSummary.value = card.querySelector('.material-summary') ? card.querySelector('.material-summary').textContent.trim() : '';
        
        const specVals = card.querySelectorAll('.spec-val');
        if (specVals[0]) modalMatChar.value = specVals[0].textContent.trim();
        if (specVals[1]) modalMatThermal.value = specVals[1].textContent.trim();
        if (specVals[2]) modalMatUse.value = specVals[2].textContent.trim();

        modalMatReqs.value = card.getAttribute('data-reqs') || '';
        if (modalMatFeatured) modalMatFeatured.checked = card.classList.contains('material-card-featured');
      }
    } else {
      modalTitle.textContent = 'Add New Engineering Material';
      modalMatId.value = '';
    }

    materialModalOverlay.style.display = 'flex';
  };

  window.closeMaterialModal = function() {
    if (materialModalOverlay) materialModalOverlay.style.display = 'none';
  };

  window.handleSaveMaterial = function(e) {
    e.preventDefault();
    const id = modalMatId.value || modalMatName.value.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const name = modalMatName.value.trim();
    const cls = modalMatClass.value.trim();
    const code = modalMatCode.value.trim();
    const cat = modalMatCategory.value.trim();
    const summary = modalMatSummary.value.trim();
    const char = modalMatChar.value.trim();
    const thermal = modalMatThermal.value.trim();
    const use = modalMatUse.value.trim();
    const reqs = modalMatReqs.value.trim();
    const isFeatured = modalMatFeatured ? modalMatFeatured.checked : false;

    let card = document.querySelector(`.material-card[data-id="${id}"]`);
    if (card) {
      // Update existing card
      if (card.querySelector('.mat-class')) card.querySelector('.mat-class').textContent = cls;
      if (card.querySelector('.mat-code')) card.querySelector('.mat-code').textContent = code;
      if (card.querySelector('.material-name')) card.querySelector('.material-name').textContent = name;
      if (card.querySelector('.material-category')) card.querySelector('.material-category').textContent = cat;
      if (card.querySelector('.material-summary')) card.querySelector('.material-summary').textContent = summary;
      
      const specVals = card.querySelectorAll('.spec-val');
      if (specVals[0]) specVals[0].textContent = char;
      if (specVals[1]) specVals[1].textContent = thermal;
      if (specVals[2]) specVals[2].textContent = use;
      card.setAttribute('data-reqs', reqs);
      showToast(`Updated ${name}!`);
    }

    markChange();
    closeMaterialModal();
  };

  // 6. Publish Changes to Live Site & Cloud
  window.publishLiveChanges = async function() {
    if (!publishBtn) return;
    publishBtn.disabled = true;
    publishBtn.textContent = 'Publishing to Cloud...';

    // Collect all material cards data (support both .autodesk-card and .material-card)
    const cards = document.querySelectorAll('.autodesk-card, .material-card');
    const materialsList = [];
    cards.forEach(card => {
      const id = card.getAttribute('data-id') || 'custom';
      const name = card.querySelector('.autodesk-card-name, .material-name') ? card.querySelector('.autodesk-card-name, .material-name').textContent.trim() : '';
      const cls = card.querySelector('.mat-class') ? card.querySelector('.mat-class').textContent.trim() : '';
      const code = card.querySelector('.mat-code') ? card.querySelector('.mat-code').textContent.trim() : '';
      const cat = card.getAttribute('data-category') || (card.querySelector('.material-category') ? card.querySelector('.material-category').textContent.trim() : '');
      const summary = card.querySelector('.autodesk-card-desc, .material-summary') ? card.querySelector('.autodesk-card-desc, .material-summary').textContent.trim() : '';
      const specVals = card.querySelectorAll('.spec-val');
      const img = card.querySelector('.autodesk-card-thumb, .mat-thumb-img') ? card.querySelector('.autodesk-card-thumb, .mat-thumb-img').getAttribute('src') : '';

      materialsList.push({
        id: id,
        name: name,
        classification: cls,
        code: code,
        category: cat,
        summary: summary,
        image: img,
        characteristics: specVals[0] ? specVals[0].textContent.trim() : '',
        thermal: specVals[1] ? specVals[1].textContent.trim() : '',
        use_cases: specVals[2] ? specVals[2].textContent.trim() : '',
        requirements: (card.getAttribute('data-reqs') || '').split(' ').filter(Boolean)
      });
    });

    const payload = {
      texts: stagedTexts,
      images: stagedImages,
      materials: materialsList,
      publishedAt: new Date().toISOString()
    };

    // Save locally
    localStorage.setItem('fusionlabs3d_published_config', JSON.stringify(payload));

    // Save to Firebase Cloud Firestore if initialized and authenticated
    if (typeof firebaseDb !== 'undefined' && firebaseDb) {
      try {
        await firebaseDb.collection('site_config').doc('main').set(payload);
        console.log('Published to Firebase Cloud successfully!');
      } catch (err) {
        console.warn('Firebase publish note:', err);
      }
    }

    resetChanges();
    publishBtn.disabled = false;
    publishBtn.textContent = '🚀 Publish to Live Site';
    showToast('Published successfully! Changes are live.');
  };

  window.resetAllChanges = function() {
    if (confirm('Discard all unsaved edits?')) {
      window.location.reload();
    }
  };

  async function loadExistingConfig() {
    let config = null;

    // Check Firebase Cloud first
    if (typeof firebaseDb !== 'undefined' && firebaseDb) {
      try {
        const doc = await firebaseDb.collection('site_config').doc('main').get();
        if (doc.exists) {
          config = doc.data();
        }
      } catch (err) {
        console.warn('Firebase config fetch note:', err);
      }
    }

    // Fallback to localStorage
    if (!config) {
      const local = localStorage.getItem('fusionlabs3d_published_config');
      if (local) {
        try { config = JSON.parse(local); } catch (e) {}
      }
    }

    if (config) {
      if (config.texts) {
        Object.keys(config.texts).forEach(key => {
          const parts = key.split('_');
          const idx = parseInt(parts.pop(), 10);
          const sel = parts.join('_');
          const els = document.querySelectorAll(sel);
          if (els[idx]) els[idx].innerHTML = config.texts[key];
        });
      }
      if (config.images) {
        Object.keys(config.images).forEach(imgId => {
          const img = document.querySelector(`[data-img-id="${imgId}"]`);
          if (img) img.src = config.images[imgId];
        });
      }
    }
  }
});
