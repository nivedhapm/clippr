// Get the correct base URL for the application
let API_BASE;
if (window.location.pathname.endsWith('/')) {
    API_BASE = window.location.protocol + '//' + window.location.host + window.location.pathname;
} else if (window.location.pathname.includes('/index.html')) {
    API_BASE = window.location.protocol + '//' + window.location.host + window.location.pathname.replace('/index.html', '/');
} else {
    API_BASE = window.location.protocol + '//' + window.location.host + window.location.pathname + '/';
}
let currentUser = null;

// Toast Notification Function
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');

    toastMessage.textContent = message;

    // Remove existing type classes
    toast.classList.remove('success', 'error');

    // Add the appropriate type class
    toast.classList.add(type);

    // Show the toast
    toast.classList.add('show');

    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Check if user is logged in on page load
window.onload = function() {
    checkAuth();
    setupTabSwitching();
    setupGradientToggle();
    setupFooterButtons();
    updateColorValues();
    initializeDefaultTab();
    setupQrCustomizationToggle();
    console.log('API_BASE:', API_BASE);
};

function initializeDefaultTab() {
    const shortLinkTab = document.querySelector('.tab-btn[data-tab="shortlink"]');
    const shortLinkContent = document.getElementById('shortlink');

    if (shortLinkTab && shortLinkContent) {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        shortLinkTab.classList.add('active');
        shortLinkContent.classList.add('active');
    }
}

function setupQrCustomizationToggle() {
    const qrUrlInput = document.getElementById('qrUrl');
    const qrCustomization = document.getElementById('qr-customization');
    const qrResult = document.getElementById('qr-result');
    const qrPreviewBanner = document.getElementById('qr-preview-banner');

    if (qrUrlInput && qrCustomization) {
        qrUrlInput.addEventListener('input', function() {
            if (this.value.trim().length > 0) {
                qrCustomization.style.display = 'block';
            } else {
                qrCustomization.style.display = 'none';

                if (qrResult) {
                    qrResult.style.display = 'none';
                }

                if (qrPreviewBanner) {
                    qrPreviewBanner.style.display = 'block';
                }

                window.currentQrUrl = null;
                window.currentQrText = null;
                window.currentQrCanvas = null;
            }
        });
    }
}

async function checkAuth() {
    try {
        const response = await fetch(API_BASE + 'api/get-all-urls', {
            credentials: 'include'
        });

        if (response.ok) {
            currentUser = true;
            document.getElementById('loginBtn').style.display = 'none';
            document.getElementById('profileIcon').style.display = 'block';
            // Create initials display instead of image
            const profileIcon = document.getElementById('profileIcon');
            profileIcon.style.backgroundImage = 'none';
            profileIcon.style.backgroundColor = '#C5FF41';
            profileIcon.style.color = '#151312';
            profileIcon.style.fontSize = '18px';
            profileIcon.style.fontWeight = '600';
            profileIcon.style.display = 'flex';
            profileIcon.style.alignItems = 'center';
            profileIcon.style.justifyContent = 'center';
            profileIcon.textContent = 'US'; // Default initials, will be updated when profile loads
        } else {
            currentUser = false;
            document.getElementById('loginBtn').style.display = 'block';
            document.getElementById('profileIcon').style.display = 'none';
        }
    } catch (error) {
        console.log('Not logged in');
        currentUser = false;
        document.getElementById('loginBtn').style.display = 'block';
        document.getElementById('profileIcon').style.display = 'none';
    }
}

function setupTabSwitching() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    function switchTab(tabName) {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        const activeTabButton = document.querySelector(`.tab-btn[data-tab="${tabName}"]`);
        if (activeTabButton) {
            activeTabButton.classList.add('active');
        }

        const activeContent = document.getElementById(tabName);
        if (activeContent) {
            activeContent.classList.add('active');
        }
    }

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        });
    });

    window.switchTab = switchTab;
}

function setupFooterButtons() {
    const footerButtons = document.querySelectorAll('.footer-btn');

    footerButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');

            if (window.switchTab) {
                window.switchTab(tabName);
            }

            const contentCard = document.querySelector('.content-card');
            if (contentCard) {
                contentCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    });
}

function showAuthOverlay() {
    document.getElementById('authOverlay').style.display = 'flex';
}

function closeAuthOverlay() {
    document.getElementById('authOverlay').style.display = 'none';
}

function loginWithGoogle() {
    window.location.href = API_BASE + 'auth/google';
}

function loginWithZoho() {
    window.location.href = API_BASE + 'auth/zoho';
}

function showProfileOverlay() {
    if (!currentUser) {
        showAuthOverlay();
        return;
    }

    document.getElementById('profileOverlay').style.display = 'flex';
    loadUserProfile();
    loadUserUrls();
}

function closeProfileOverlay() {
    document.getElementById('profileOverlay').style.display = 'none';
}

function showProfileTab(tabName) {
    const tabs = document.querySelectorAll('.profile-tab');
    const contents = document.querySelectorAll('.profile-tab-content');

    tabs.forEach(tab => tab.classList.remove('active'));
    contents.forEach(content => content.style.display = 'none');

    document.querySelector(`[onclick="showProfileTab('${tabName}')"]`).classList.add('active');
    document.getElementById(tabName + 'Tab').style.display = 'block';

    if (tabName === 'urls') {
        loadUserUrls();
    } else if (tabName === 'qrcodes') {
        loadUserQRCodes();
    }
}

async function loadUserProfile() {
    try {
        const response = await fetch(API_BASE + 'api/user-profile', {
            credentials: 'include'
        });

        if (response.status === 401) {
            showAuthOverlay();
            return;
        }

        if (response.ok) {
            const userData = await response.json();
            const name = userData.name || 'User';
            const email = userData.email || '';
            document.getElementById('profileName').textContent = name;
            document.getElementById('profileEmail').textContent = email;

            // Generate initials from name
            const initials = name.split(' ').map(n => n.charAt(0)).join('').substring(0, 2).toUpperCase();

            // Update profile picture in modal to show initials
            const profilePicture = document.getElementById('profilePicture');
            profilePicture.style.backgroundImage = 'none';
            profilePicture.style.backgroundColor = '#C5FF41';
            profilePicture.style.color = '#151312';
            profilePicture.style.fontSize = '24px';
            profilePicture.style.fontWeight = '700';
            profilePicture.style.display = 'flex';
            profilePicture.style.alignItems = 'center';
            profilePicture.style.justifyContent = 'center';
            profilePicture.style.border = '3px solid #1B86FF';
            profilePicture.textContent = initials;

            // Update profile icon in header to show initials
            const profileIcon = document.getElementById('profileIcon');
            profileIcon.style.backgroundImage = 'none';
            profileIcon.style.backgroundColor = '#C5FF41';
            profileIcon.style.color = '#151312';
            profileIcon.style.fontSize = '18px';
            profileIcon.style.fontWeight = '600';
            profileIcon.style.display = 'flex';
            profileIcon.style.alignItems = 'center';
            profileIcon.style.justifyContent = 'center';
            profileIcon.textContent = initials;
        } else {
            console.error('Failed to load profile:', response.status);
        }
    } catch (error) {
        console.error('Error loading user profile:', error);
    }
}

async function loadUserUrls() {
    try {
        const response = await fetch(API_BASE + 'api/get-all-urls', {
            credentials: 'include'
        });

        if (response.ok) {
            const urls = await response.json();
            displayUrls(urls);
        } else {
            document.getElementById('urlsList').innerHTML = '<p style="color: #737373; text-align: center; padding: 2rem;">No URLs found.</p>';
        }
    } catch (error) {
        document.getElementById('urlsList').innerHTML = '<p style="color: #737373; text-align: center; padding: 2rem;">Error loading URLs.</p>';
    }
}

function displayUrls(urls) {
    const urlsList = document.getElementById('urlsList');

    if (!urls || urls.length === 0) {
        urlsList.innerHTML = '<p style="color: #737373; text-align: center; padding: 2rem;">No URLs found. Create your first short URL!</p>';
        return;
    }

    let html = '';
    urls.forEach(url => {
        const shortUrl = API_BASE + 's/' + url.shorturlid;
        const createdRaw = url.createdAt || url.created_at || url.createdat || null;
        html += `
            <div class="url-card">
                <div class="url-card-header">
                    <div class="url-info">
                        <h3>${shortUrl}</h3>
                        <p>→ ${truncateUrl(url.longurl, 60)}</p>
                        <p style="font-size: 12px; margin-top: 5px;">Created: ${formatDate(createdRaw)}</p>
                    </div>
                    <div class="url-actions">
                        <button class="action-icon-btn" onclick="copyUrlToClipboard('${shortUrl}')" title="Copy">
                            <i class="fas fa-copy"></i>
                        </button>
                        <button class="action-icon-btn" onclick="editUrl('${url.id}', '${escapeHtml(url.longurl)}')" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-icon-btn" onclick="deleteUrl('${url.id}')" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="stats-row">
                    <div class="stat">
                        <span class="stat-label">Clicks</span>
                        <span class="stat-value">${url.count || 0}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Last Clicked</span>
                        <span class="stat-value">${url.lastclicked ? formatDate(url.lastclicked) : 'Never'}</span>
                    </div>
                </div>
            </div>
        `;
    });

    urlsList.innerHTML = html;
}

function truncateUrl(url, maxLength) {
    return url.length > maxLength ? url.substring(0, maxLength) + '...' : url;
}

function escapeHtml(text) {
    return text.replace(/'/g, "\\'");
}

function formatDate(dateString) {
    if (!dateString) return 'Never';

    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date';

        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        return 'Invalid Date';
    }
}

async function loadUserQRCodes() {
    document.getElementById('qrcodesList').innerHTML = '<p style="color: #737373; text-align: center; padding: 2rem;">QR code history coming soon!</p>';
}

function logout() {
    window.location.href = API_BASE + 'auth/logout';
}

// URL Shortener Functions
async function createShortUrl() {
    const longurl = document.getElementById('longUrl').value.trim();

    if (!longurl) {
        showToast('Please enter a URL', 'error');
        return;
    }

    if (!longurl.startsWith('http://') && !longurl.startsWith('https://')) {
        showToast('URL must start with http:// or https://', 'error');
        return;
    }

    if (!currentUser) {
        showToast('Please login to shorten URLs', 'error');
        showAuthOverlay();
        return;
    }

    try {
        const response = await fetch(API_BASE + 'api/create-short-url', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ longurl })
        });

        const data = await response.json();

        if (data.status === 'ok') {
            const shortUrl = API_BASE + 's/' + data.shorturlid;
            document.getElementById('short-url-link').href = shortUrl;
            document.getElementById('short-url-link').textContent = shortUrl;
            document.getElementById('short-url-result').style.display = 'block';
            document.getElementById('longUrl').value = '';
            showToast('Short URL created successfully!', 'success');
        } else {
            showToast(data.message || 'Error creating short URL', 'error');
        }
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
    }
}

function copyToClipboard() {
    const shortUrl = document.getElementById('short-url-link').textContent;
    navigator.clipboard.writeText(shortUrl).then(() => {
        showToast('URL copied to clipboard!', 'success');
    }).catch(err => {
        console.error('Failed to copy:', err);
        showToast('Failed to copy to clipboard', 'error');
    });
}

function copyUrlToClipboard(url) {
    navigator.clipboard.writeText(url).then(() => {
        showToast('URL copied to clipboard!', 'success');
    }).catch(err => {
        console.error('Failed to copy:', err);
        showToast('Failed to copy to clipboard', 'error');
    });
}

// QR Code Functions
function generateQR() {
    const text = document.getElementById('qrUrl').value.trim();

    if (!text) {
        showToast('Please enter a URL or text', 'error');
        return;
    }

    const useGradient = document.getElementById('use-gradient').checked;
    let qrUrl;

    if (useGradient) {
        qrUrl = generateGradientQR(text);
    } else {
        const fgColor = document.getElementById('qrForeground').value.replace('#', '');
        const bgColor = document.getElementById('qrBackground').value.replace('#', '');
        qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}&color=${fgColor}&bgcolor=${bgColor}`;
    }

    document.getElementById('qr-image').src = qrUrl;
    document.getElementById('qr-result').style.display = 'block';

    const previewBanner = document.getElementById('qr-preview-banner');
    if (previewBanner) {
        previewBanner.style.display = 'none';
    }

    window.currentQrUrl = qrUrl;
    window.currentQrText = text;

    showToast('QR Code generated successfully!', 'success');
}

function setupGradientToggle() {
    const gradientCheckbox = document.getElementById('use-gradient');
    const simpleColors = document.getElementById('simple-colors');
    const gradientColors = document.getElementById('gradient-colors');
    const gradientTypeSelect = document.getElementById('gradient-type');

    const regenerateQRIfExists = () => {
        if (window.currentQrText) {
            generateQR();
        }
    };

    gradientCheckbox.addEventListener('change', function() {
        if (this.checked) {
            simpleColors.style.display = 'none';
            gradientColors.style.display = 'flex';
            handleGradientTypeChange();
        } else {
            simpleColors.style.display = 'flex';
            gradientColors.style.display = 'none';
        }
        regenerateQRIfExists();
    });

    gradientTypeSelect.addEventListener('change', function() {
        handleGradientTypeChange();
        regenerateQRIfExists();
    });

    const gradientColor1 = document.getElementById('gradient-color1');
    const gradientColor2 = document.getElementById('gradient-color2');
    const qrForeground = document.getElementById('qrForeground');
    const qrBackground = document.getElementById('qrBackground');

    if (gradientColor1) {
        gradientColor1.addEventListener('change', regenerateQRIfExists);
    }
    if (gradientColor2) {
        gradientColor2.addEventListener('change', regenerateQRIfExists);
    }
    if (qrForeground) {
        qrForeground.addEventListener('change', regenerateQRIfExists);
    }
    if (qrBackground) {
        qrBackground.addEventListener('change', regenerateQRIfExists);
    }
}

function handleGradientTypeChange() {
    const color2Picker = document.getElementById('color2-picker');
    color2Picker.style.display = 'flex';
}

function generateGradientQR(text) {
    const gradientType = document.getElementById('gradient-type').value;
    const color1 = document.getElementById('gradient-color1').value;
    const color2 = document.getElementById('gradient-color2').value;

    const basicQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}&color=000000&bgcolor=ffffff`;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 300;
    canvas.height = 300;

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = function() {
        try {
            ctx.drawImage(img, 0, 0, 300, 300);

            const imageData = ctx.getImageData(0, 0, 300, 300);
            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];

                if (r < 128 && g < 128 && b < 128) {
                    const x = (i / 4) % canvas.width;
                    const y = Math.floor((i / 4) / canvas.width);

                    const color = getGradientColorAt(x, y, canvas.width, canvas.height, color1, color2, gradientType);
                    data[i] = color.r;
                    data[i + 1] = color.g;
                    data[i + 2] = color.b;
                }
            }

            ctx.putImageData(imageData, 0, 0);

            document.getElementById('qr-image').src = canvas.toDataURL();

            window.currentQrCanvas = canvas;
        } catch (error) {
            console.error('Error applying gradient:', error);
            document.getElementById('qr-image').src = basicQrUrl;
        }
    };

    img.onerror = function() {
        console.error('Error loading QR code image');
        const fallbackUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}&color=${color1.replace('#', '')}&bgcolor=ffffff`;
        document.getElementById('qr-image').src = fallbackUrl;
    };

    img.src = basicQrUrl;
    return basicQrUrl;
}

function downloadQR(format) {
    if (!window.currentQrUrl && !window.currentQrCanvas) {
        showToast('Please generate a QR code first', 'error');
        return;
    }

    const useGradient = document.getElementById('use-gradient').checked;

    if (useGradient && window.currentQrCanvas) {
        downloadCanvasQR(format);
    } else {
        downloadRegularQR(format);
    }
}

function downloadCanvasQR(format) {
    const canvas = window.currentQrCanvas;
    const link = document.createElement('a');
    link.download = `qrcode-gradient-${Date.now()}.png`;

    if (format === 'png') {
        link.href = canvas.toDataURL('image/png');
    } else if (format === 'svg') {
        link.href = canvas.toDataURL('image/png');
        link.download = `qrcode-gradient-${Date.now()}.png`;
        showToast('Gradient QR codes are downloaded as PNG', 'success');
    }

    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('QR Code downloaded successfully!', 'success');
}

function downloadRegularQR(format) {
    const fgColor = document.getElementById('qrForeground').value.replace('#', '');
    const bgColor = document.getElementById('qrBackground').value.replace('#', '');
    const downloadUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&format=${format}&data=${encodeURIComponent(window.currentQrText)}&color=${fgColor}&bgcolor=${bgColor}`;

    const link = document.createElement('a');
    link.download = `qrcode-${Date.now()}.${format}`;
    link.style.display = 'none';
    document.body.appendChild(link);

    fetch(downloadUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.blob();
        })
        .then(blob => {
            const blobUrl = window.URL.createObjectURL(blob);
            link.href = blobUrl;
            link.click();

            showToast('QR Code downloaded successfully!', 'success');

            setTimeout(() => {
                window.URL.revokeObjectURL(blobUrl);
                document.body.removeChild(link);
            }, 100);
        })
        .catch(error => {
            console.error('Download failed:', error);
            link.href = downloadUrl;
            link.target = '_blank';
            link.click();
            document.body.removeChild(link);
            showToast('Download started', 'success');
        });
}

function updateColorValues() {
    const colorInputs = document.querySelectorAll('.color-input');

    colorInputs.forEach(input => {
        const valueSpan = input.nextElementSibling;
        if (valueSpan && valueSpan.classList.contains('color-value')) {
            input.addEventListener('input', function() {
                valueSpan.textContent = this.value.toUpperCase();
            });
        }
    });
}

// URL Management Functions
function editUrl(urlId, currentUrl) {
    document.getElementById('update-url-id').value = urlId;
    document.getElementById('update-url-input').value = currentUrl;
    document.getElementById('update-modal').style.display = 'flex';
}

function closeUpdateModal() {
    document.getElementById('update-modal').style.display = 'none';
}

async function saveUrlUpdate() {
    const urlId = document.getElementById('update-url-id').value;
    const newUrl = document.getElementById('update-url-input').value.trim();

    if (!newUrl) {
        showToast('Please enter a URL', 'error');
        return;
    }

    if (!newUrl.startsWith('http://') && !newUrl.startsWith('https://')) {
        showToast('URL must start with http:// or https://', 'error');
        return;
    }

    try {
        const response = await fetch(API_BASE + 'api/update-url', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                urlid: urlId,
                newlongurl: newUrl
            })
        });

        const data = await response.json();

        if (data.status === 'success' || data.status === 'ok') {
            showToast('URL updated successfully!', 'success');
            closeUpdateModal();
            loadUserUrls();
        } else {
            showToast(data.message || 'Error updating URL', 'error');
        }
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
    }
}

function deleteUrl(urlId) {
    // Store the URL ID and show the delete confirmation modal
    document.getElementById('delete-url-id').value = urlId;
    document.getElementById('delete-modal').style.display = 'flex';
}

async function confirmDeleteUrl() {
    const urlId = document.getElementById('delete-url-id').value;

    // Close the modal
    closeDeleteModal();

    try {
        const response = await fetch(API_BASE + 'api/delete-url', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ urlid: parseInt(urlId) })
        });

        const data = await response.json();

        if (data.status === 'success' || data.status === 'ok') {
            showToast('URL deleted successfully!', 'success');
            loadUserUrls();
        } else {
            showToast(data.message || 'Error deleting URL', 'error');
        }
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
    }
}

function closeDeleteModal() {
    document.getElementById('delete-modal').style.display = 'none';
    document.getElementById('delete-url-id').value = '';
}

function getGradientColorAt(x, y, width, height, color1, color2, gradientType) {
    let ratio;

    switch(gradientType) {
        case 'linear-horizontal':
            ratio = x / width;
            break;
        case 'linear-vertical':
            ratio = y / height;
            break;
        case 'linear-diagonal':
            ratio = (x + y) / (width + height);
            break;
        case 'radial':
            const centerX = width / 2;
            const centerY = height / 2;
            const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
            const distance = Math.sqrt((x - centerX) * (x - centerX) + (y - centerY) * (y - centerY));
            ratio = distance / maxDistance;
            break;
        default:
            ratio = (x + y) / (width + height);
    }

    ratio = Math.min(1, Math.max(0, ratio));

    const c1 = hexToRgb(color1);
    const c2 = hexToRgb(color2);

    return {
        r: Math.round(c1.r + (c2.r - c1.r) * ratio),
        g: Math.round(c1.g + (c2.g - c1.g) * ratio),
        b: Math.round(c1.b + (c2.b - c1.b) * ratio)
    };
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : {r: 0, g: 0, b: 0};
}

// Modal Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Close modals when clicking outside
    const deleteModal = document.getElementById('delete-modal');
    const updateModal = document.getElementById('update-modal');

    if (deleteModal) {
        deleteModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeDeleteModal();
            }
        });
    }

    if (updateModal) {
        updateModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeUpdateModal();
            }
        });
    }

    // Close modals with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (deleteModal && deleteModal.style.display === 'flex') {
                closeDeleteModal();
            }
            if (updateModal && updateModal.style.display === 'flex') {
                closeUpdateModal();
            }
        }
    });
});

