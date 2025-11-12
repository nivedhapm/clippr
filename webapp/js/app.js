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

// Check if user is logged in on page load
window.onload = function() {
    checkAuth();
    setupTabSwitching();
    setupGradientToggle();
    setupFooterButtons();
    updateColorValues();
    initializeDefaultTab(); // Make sure Short Link tab is active by default
    setupQrCustomizationToggle(); // Setup QR customization visibility
    console.log('API_BASE:', API_BASE);
};

function initializeDefaultTab() {
    // Ensure Short Link tab is active by default
    const shortLinkTab = document.querySelector('.tab-btn[data-tab="shortlink"]');
    const shortLinkContent = document.getElementById('shortlink');

    if (shortLinkTab && shortLinkContent) {
        // Remove active from all tabs first
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        // Make Short Link tab active
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

                // Hide QR result when input is cleared
                if (qrResult) {
                    qrResult.style.display = 'none';
                }

                // Show the preview banner again
                if (qrPreviewBanner) {
                    qrPreviewBanner.style.display = 'block';
                }

                // Clear stored QR data
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
            document.getElementById('profileIcon').src = 'https://ui-avatars.com/api/?name=User&background=C5FF41&color=151312';
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

// Tab Switching Functionality
function setupTabSwitching() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    function switchTab(tabName) {
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // Add active class to clicked button and corresponding content
        const activeTabButton = document.querySelector(`.tab-btn[data-tab="${tabName}"]`);
        if (activeTabButton) {
            activeTabButton.classList.add('active');
        }

        const activeContent = document.getElementById(tabName);
        if (activeContent) {
            activeContent.classList.add('active');
        }
    }

    // Add click event listeners to tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        });
    });

    // Make switchTab globally available for footer buttons
    window.switchTab = switchTab;
}

// Footer Buttons Functionality
function setupFooterButtons() {
    const footerButtons = document.querySelectorAll('.footer-btn');

    footerButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');

            // Use the global switchTab function
            if (window.switchTab) {
                window.switchTab(tabName);
            }

            // Scroll to the content card smoothly
            const contentCard = document.querySelector('.content-card');
            if (contentCard) {
                contentCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    });
}

// Auth Overlay Functions
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

// Profile Overlay Functions
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
            // Not authenticated – prompt login and do not show placeholders
            showAuthOverlay();
            return;
        }

        if (response.ok) {
            const userData = await response.json();
            const name = userData.name || 'User';
            const email = userData.email || '';
            document.getElementById('profileName').textContent = name;
            document.getElementById('profileEmail').textContent = email;

            const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=C5FF41&color=151312`;
            document.getElementById('profilePicture').src = userData.profilePicture || avatar;
            document.getElementById('profileIcon').src = userData.profilePicture || avatar;
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
        // createdAt from DTO (camelCase) with safe fallbacks
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
        alert('Please enter a URL');
        return;
    }

    if (!longurl.startsWith('http://') && !longurl.startsWith('https://')) {
        alert('URL must start with http:// or https://');
        return;
    }

    if (!currentUser) {
        alert('Please login to shorten URLs');
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
        } else {
            alert(data.message || 'Error creating short URL');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

function copyToClipboard() {
    const shortUrl = document.getElementById('short-url-link').textContent;
    navigator.clipboard.writeText(shortUrl).then(() => {
        alert('Short URL copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy to clipboard');
    });
}

function copyUrlToClipboard(url) {
    navigator.clipboard.writeText(url).then(() => {
        alert('URL copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy to clipboard');
    });
}

// QR Code Functions
function generateQR() {
    const text = document.getElementById('qrUrl').value.trim();

    if (!text) {
        alert('Please enter a URL or text');
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

    // Customization options are already shown when URL is entered

    // Hide the preview banner when QR is generated
    const previewBanner = document.getElementById('qr-preview-banner');
    if (previewBanner) {
        previewBanner.style.display = 'none';
    }

    // Store the current QR URL for downloads
    window.currentQrUrl = qrUrl;
    window.currentQrText = text;
}

function setupGradientToggle() {
    const gradientCheckbox = document.getElementById('use-gradient');
    const simpleColors = document.getElementById('simple-colors');
    const gradientColors = document.getElementById('gradient-colors');
    const gradientTypeSelect = document.getElementById('gradient-type');
    const color2Picker = document.getElementById('color2-picker');

    // Function to regenerate QR if it exists
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

    // Add color change listeners for real-time updates
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
    // All gradient types now require two colors, so always show color2 picker
    const color2Picker = document.getElementById('color2-picker');
    color2Picker.style.display = 'flex';
}

function generateGradientQR(text) {
    const gradientType = document.getElementById('gradient-type').value;
    const color1 = document.getElementById('gradient-color1').value;
    const color2 = document.getElementById('gradient-color2').value;

    // First, get a basic black QR code from the API
    const basicQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}&color=000000&bgcolor=ffffff`;

    // Create a canvas to apply gradient effect
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 300;
    canvas.height = 300;

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = function() {
        try {
            // Draw the QR code
            ctx.drawImage(img, 0, 0, 300, 300);

            // Get image data
            const imageData = ctx.getImageData(0, 0, 300, 300);
            const data = imageData.data;

            // Apply gradient to dark pixels
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];

                // If pixel is dark (QR code pattern)
                if (r < 128 && g < 128 && b < 128) {
                    const x = (i / 4) % canvas.width;
                    const y = Math.floor((i / 4) / canvas.width);

                    // Calculate gradient color for this position
                    const color = getGradientColorAt(x, y, canvas.width, canvas.height, color1, color2, gradientType);
                    data[i] = color.r;     // Red
                    data[i + 1] = color.g; // Green
                    data[i + 2] = color.b; // Blue
                }
            }

            // Put the modified image data back
            ctx.putImageData(imageData, 0, 0);

            // Update the QR image with the gradient version
            document.getElementById('qr-image').src = canvas.toDataURL();

            // Store the canvas for downloads
            window.currentQrCanvas = canvas;
        } catch (error) {
            console.error('Error applying gradient:', error);
            // Fallback to basic QR code
            document.getElementById('qr-image').src = basicQrUrl;
        }
    };

    img.onerror = function() {
        console.error('Error loading QR code image');
        // Fallback to basic QR code
        const fallbackUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}&color=${color1.replace('#', '')}&bgcolor=ffffff`;
        document.getElementById('qr-image').src = fallbackUrl;
    };

    img.src = basicQrUrl;
    return basicQrUrl; // Return immediately, canvas will update asynchronously
}

function downloadQR(format) {
    if (!window.currentQrUrl && !window.currentQrCanvas) {
        alert('Please generate a QR code first');
        return;
    }

    const useGradient = document.getElementById('use-gradient').checked;

    if (useGradient && window.currentQrCanvas) {
        // Download the gradient canvas version
        downloadCanvasQR(format);
    } else {
        // Download regular QR code
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
        // For SVG, we'll convert to PNG since canvas doesn't directly support SVG export
        link.href = canvas.toDataURL('image/png');
        link.download = `qrcode-gradient-${Date.now()}.png`;
        alert('Gradient QR codes are downloaded as PNG format');
    }

    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function downloadRegularQR(format) {
    const fgColor = document.getElementById('qrForeground').value.replace('#', '');
    const bgColor = document.getElementById('qrBackground').value.replace('#', '');
    const downloadUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&format=${format}&data=${encodeURIComponent(window.currentQrText)}&color=${fgColor}&bgcolor=${bgColor}`;

    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.download = `qrcode-${Date.now()}.${format}`;
    link.style.display = 'none';
    document.body.appendChild(link);

    // Fetch the image and create a blob for proper download
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

            // Clean up
            setTimeout(() => {
                window.URL.revokeObjectURL(blobUrl);
                document.body.removeChild(link);
            }, 100);
        })
        .catch(error => {
            console.error('Download failed:', error);
            // Fallback: direct download (may not work due to CORS)
            link.href = downloadUrl;
            link.target = '_blank';
            link.click();
            document.body.removeChild(link);
        });
}

// Update color value displays
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
        alert('Please enter a URL');
        return;
    }

    if (!newUrl.startsWith('http://') && !newUrl.startsWith('https://')) {
        alert('URL must start with http:// or https://');
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
            alert('URL updated successfully');
            closeUpdateModal();
            loadUserUrls();
        } else {
            alert(data.message || 'Error updating URL');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

async function deleteUrl(urlId) {
    if (!confirm('Are you sure you want to delete this URL?')) {
        return;
    }

    try {
        const response = await fetch(API_BASE + 'api/delete-url', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ urlid: urlId })
        });

        const data = await response.json();

        if (data.status === 'success' || data.status === 'ok') {
            alert('URL deleted successfully');
            loadUserUrls();
        } else {
            alert(data.message || 'Error deleting URL');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
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

    // Parse colors
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
