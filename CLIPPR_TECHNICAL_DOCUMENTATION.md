# Clippr - URL Shortener & QR Code Generator
## Comprehensive Technical Documentation

---

## Table of Contents
1. [Application Overview](#application-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture & Project Structure](#architecture--project-structure)
4. [Database Design](#database-design)
5. [URL Shortening Implementation](#url-shortening-implementation)
6. [QR Code Generation Implementation](#qr-code-generation-implementation)
7. [OAuth Authentication Implementation](#oauth-authentication-implementation)
8. [Frontend Implementation](#frontend-implementation)
9. [Security Features](#security-features)
10. [Deployment & Configuration](#deployment--configuration)
11. [API Endpoints](#api-endpoints)
12. [Data Flow Diagrams](#data-flow-diagrams)
13. [Error Handling & Logging](#error-handling--logging)
14. [Future Enhancement Opportunities](#future-enhancement-opportunities)
15. [Conclusion](#conclusion)

---

## Application Overview

**Clippr** is a full-stack web application that provides URL shortening and QR code generation services with OAuth-based user authentication. Users can create shortened URLs, generate customizable QR codes with gradient support, and manage their links through a personalized dashboard.

### Key Features:
- URL shortening with custom short codes
- QR code generation with gradient customization
- OAuth authentication (Google & Zoho)
- User dashboard for link management
- Click tracking and analytics
- Responsive web interface

---

## Technology Stack

### Backend Technologies

#### 1. **Java Servlet API (Jakarta EE)**
- **Version**: Jakarta Servlet 6.0
- **Purpose**: Core server-side logic and HTTP request handling
- **Files**: All servlet classes in `src/main/java/com/clippr/app/api/servlet/`
- **Key Features**:
  - HTTP request/response handling
  - Session management
  - Annotation-based URL mapping (`@WebServlet`)
  - Filter chain for request processing

#### 2. **MySQL Database**
- **Version**: MySQL 8.0+
- **Driver**: MySQL Connector/J 8.0.33
- **Purpose**: Data persistence and user management
- **Configuration**: `src/main/resources/config.properties`
- **Connection Pooling**: Basic connection management in `DatabaseConnection.java`

#### 3. **Apache Tomcat**
- **Version**: 10.1.48
- **Purpose**: Servlet container and web server
- **Configuration**: `webapp/WEB-INF/web.xml`
- **Deployment**: WAR file deployment

#### 4. **Maven Build System**
- **File**: `pom.xml`
- **Purpose**: Dependency management and build automation
- **Key Dependencies**:
  - MySQL Connector
  - Apache HttpClient (OAuth)
  - Gson (JSON processing)
  - Commons Codec (Base64 encoding)

### Frontend Technologies

#### 1. **HTML5**
- **File**: `webapp/index.html`
- **Features**: Semantic markup, responsive design
- **Structure**: Single-page application with tab-based navigation

#### 2. **CSS3**
- **File**: `webapp/css/styles.css`
- **Features**: 
  - Flexbox and Grid layouts
  - CSS animations and transitions
  - Custom gradient backgrounds
  - Responsive design with media queries
  - Font Awesome icons integration

#### 3. **Vanilla JavaScript (ES6+)**
- **File**: `webapp/js/app.js`
- **Features**:
  - Fetch API for AJAX requests
  - Canvas API for QR code gradient processing
  - Local storage management
  - Event-driven architecture

#### 4. **External APIs**
- **QR Server API**: `https://api.qrserver.com/v1/create-qr-code/`
- **Font Awesome**: Icon library for UI elements

---

## Architecture & Project Structure

### Maven Standard Directory Layout
```
clippr-app/
├── src/main/java/com/clippr/app/
│   ├── api/servlet/          # HTTP endpoints
│   ├── features/            # Business logic
│   ├── repository/          # Data access layer
│   └── utils/              # Utility classes
├── src/main/resources/      # Configuration files
├── webapp/                 # Web assets
└── target/                # Build output
```

### Package Structure Explanation

#### `com.clippr.app.api.servlet`
- **Purpose**: HTTP request handlers (Controllers in MVC)
- **Subpackages**:
  - `auth/`: Authentication-related servlets
  - `url/`: URL management servlets
  - `user/`: User profile servlets

#### `com.clippr.app.features`
- **Purpose**: Business logic and services
- **Subpackages**:
  - `auth/`: OAuth authentication logic
  - `url/`: URL shortening algorithms

#### `com.clippr.app.repository`
- **Purpose**: Data access layer (DAO pattern)
- **Subpackages**:
  - `database/`: Database connection and queries
  - `dto/`: Data Transfer Objects

#### `com.clippr.app.utils`
- **Purpose**: Utility classes and helpers
- **Classes**: JSON processing, OAuth utilities, validation

---

## Database Design

### Tables Structure

#### 1. **users** Table
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    oauth_provider VARCHAR(20) NOT NULL,     -- 'google' or 'zoho'
    oauth_id VARCHAR(255) NOT NULL UNIQUE,   -- Provider's user ID
    name VARCHAR(100) NOT NULL,              -- User's full name
    email VARCHAR(100) NOT NULL,             -- User's email
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_oauth (oauth_provider, oauth_id)
);
```

#### 2. **urls** Table
```sql
CREATE TABLE urls (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,                            -- Foreign key to users
    longurl TEXT NOT NULL,                  -- Original URL
    shorturlid VARCHAR(10) NOT NULL UNIQUE, -- Short code (e.g., 'abc123')
    count INT DEFAULT 0,                    -- Click count
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_clicked TIMESTAMP NULL,            -- Last access time
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Database Relationships
- **One-to-Many**: One user can have multiple URLs
- **Cascade Delete**: When user is deleted, all their URLs are deleted
- **Indexing**: Unique indexes on `shorturlid` and `oauth_id` for fast lookups

---

## URL Shortening Implementation

### Algorithm & Logic

#### 1. **Short Code Generation**
- **File**: `src/main/java/com/clippr/app/features/url/UrlShortener.java`
- **Method**: `generateShortUrl()`
- **Algorithm**:
  ```java
  private static final String CHARACTERS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  
  public String generateShortUrl() {
      SecureRandom random = new SecureRandom();
      StringBuilder shortUrl = new StringBuilder(SHORT_URL_LENGTH);
      
      for (int i = 0; i < SHORT_URL_LENGTH; i++) {
          int randomIndex = random.nextInt(CHARACTERS.length());
          shortUrl.append(CHARACTERS.charAt(randomIndex));
      }
      
      return shortUrl.toString();
  }
  ```

#### 2. **URL Validation**
- **File**: `src/main/java/com/clippr/app/utils/ValidationUtil.java`
- **Checks**: Protocol validation (HTTP/HTTPS), format validation
- **Regex Pattern**: `^https?://.*` for basic URL validation

### API Endpoints

#### Create Short URL
- **Endpoint**: `POST /api/create-short-url`
- **File**: `CreateShortUrlServlet.java`
- **Flow**:
  1. Validate user authentication
  2. Validate URL format
  3. Generate unique short code
  4. Store in database
  5. Return shortened URL

#### Redirect Service
- **Endpoint**: `GET /s/{shortCode}`
- **File**: `RedirectServlet.java`
- **Flow**:
  1. Extract short code from URL
  2. Look up original URL in database
  3. Increment click counter
  4. Update last_clicked timestamp
  5. Redirect to original URL (HTTP 302)

---

## QR Code Generation Implementation

### Technology Stack for QR Codes

#### 1. **External QR API**
- **Service**: QR Server API (`https://api.qrserver.com/`)
- **Why Used**: Reliable, free tier, supports multiple formats
- **Parameters**:
  - `size`: QR code dimensions (300x300, 500x500)
  - `data`: URL or text to encode
  - `color`: Foreground color (hex without #)
  - `bgcolor`: Background color (hex without #)
  - `format`: Output format (PNG, SVG)

#### 2. **Canvas API for Gradients**
- **File**: `webapp/js/app.js`
- **Purpose**: Apply gradient effects to QR codes
- **Process**:
  1. Fetch basic black/white QR code from API
  2. Load image into HTML5 Canvas
  3. Process pixel data using `getImageData()`
  4. Apply gradient colors to dark pixels
  5. Export as downloadable image

### Gradient Implementation Logic

#### 1. **Gradient Types Supported**
```javascript
const gradientTypes = {
    'single': 'Solid color',
    'linear-horizontal': 'Left to right gradient',
    'linear-vertical': 'Top to bottom gradient', 
    'linear-diagonal': 'Diagonal gradient',
    'radial': 'Center to edge gradient'
};
```

#### 2. **Color Calculation Algorithm**
```javascript
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
    }
    
    // Interpolate between color1 and color2
    const c1 = hexToRgb(color1);
    const c2 = hexToRgb(color2);
    
    return {
        r: Math.round(c1.r + (c2.r - c1.r) * ratio),
        g: Math.round(c1.g + (c2.g - c1.g) * ratio),
        b: Math.round(c1.b + (c2.b - c1.b) * ratio)
    };
}
```

#### 3. **Download Implementation**
- **PNG Download**: Direct canvas `toDataURL()` conversion
- **SVG Limitation**: Converted to PNG (Canvas doesn't support SVG export)
- **File Naming**: `qrcode-gradient-{timestamp}.{format}`

### QR Code Features
- **Customization**: Foreground/background colors, gradient effects
- **Size Options**: 300x300 (preview), 500x500 (download)
- **Format Support**: PNG, SVG (fallback to PNG for gradients)
- **Real-time Preview**: Instant generation on parameter change

---

## OAuth Authentication Implementation

### Supported Providers

#### 1. **Google OAuth 2.0**
- **Configuration File**: `src/main/resources/config.properties`
- **Endpoints**:
  - Authorization: `https://accounts.google.com/o/oauth2/v2/auth`
  - Token: `https://oauth2.googleapis.com/token`
  - User Info: `https://www.googleapis.com/oauth2/v2/userinfo`

#### 2. **Zoho OAuth 2.0**
- **Region**: India (`.in` domain)
- **Endpoints**:
  - Authorization: `https://accounts.zoho.in/oauth/v2/auth`
  - Token: `https://accounts.zoho.in/oauth/v2/token`
  - User Info: `https://accounts.zoho.in/oauth/v2/user/info`

### OAuth Flow Implementation

#### 1. **Authorization Request**
- **File**: `GoogleAuthServlet.java`, `ZohoAuthServlet.java`
- **Flow**:
  ```java
  String authUrl = AUTH_URL + 
      "?client_id=" + CLIENT_ID +
      "&redirect_uri=" + URLEncoder.encode(REDIRECT_URI, "UTF-8") +
      "&response_type=code" +
      "&scope=" + URLEncoder.encode(SCOPE, "UTF-8") +
      "&access_type=offline";
  
  response.sendRedirect(authUrl);
  ```

#### 2. **Callback Processing**
- **Files**: `GoogleCallbackServlet.java`, `ZohoCallbackServlet.java`
- **Steps**:
  1. Extract authorization code from callback
  2. Exchange code for access token
  3. Use access token to fetch user profile
  4. Store/update user in database
  5. Create user session
  6. Redirect to dashboard

#### 3. **Token Exchange**
- **HTTP Client**: Apache HttpClient 4.5.14
- **Method**: POST request with form data
- **Response**: JSON containing access_token and user info

### User Data Mapping

#### Google OAuth Response
```json
{
    "id": "1234567890",
    "name": "John Doe", 
    "email": "john@gmail.com",
    "picture": "https://...",
    "verified_email": true
}
```

#### Zoho OAuth Response
```json
{
    "ZUID": "1234567890",
    "Display_Name": "John Doe",
    "Email": "john@zoho.com",
    "First_Name": "John",
    "Last_Name": "Doe"
}
```

#### Database Storage Logic
```java
// Check if user exists
User existingUser = userDAO.findByOAuthId(provider, oauthId);

if (existingUser != null) {
    // Update existing user
    existingUser.setName(name);
    existingUser.setEmail(email);
    userDAO.update(existingUser);
} else {
    // Create new user
    User newUser = new User(provider, oauthId, name, email);
    userDAO.create(newUser);
}
```

### Session Management
- **Technology**: HTTP Sessions (Jakarta Servlet)
- **Storage**: Server-side session store
- **Data Stored**: User ID, OAuth provider, user name
- **Timeout**: Default Tomcat session timeout (30 minutes)

---

## Frontend Implementation

### Architecture Pattern
- **Pattern**: Single Page Application (SPA)
- **Navigation**: Tab-based interface with JavaScript routing
- **State Management**: Local variables and DOM manipulation
- **API Communication**: Fetch API with JSON payloads

### Key JavaScript Modules

#### 1. **Authentication Module**
```javascript
// Check authentication status
async function checkAuth() {
    try {
        const response = await fetch(API_BASE + 'api/get-all-urls', {
            credentials: 'include'  // Include session cookies
        });
        
        if (response.ok) {
            currentUser = true;
            // Update UI for logged-in state
        }
    } catch (error) {
        // Handle not logged in
    }
}
```

#### 2. **URL Shortener Module**
```javascript
async function createShortUrl() {
    const response = await fetch(API_BASE + 'api/create-short-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ longurl })
    });
    
    const data = await response.json();
    // Handle response and update UI
}
```

#### 3. **QR Code Module**
```javascript
function generateQR() {
    const useGradient = document.getElementById('use-gradient').checked;
    
    if (useGradient) {
        // Complex gradient processing with Canvas API
        generateGradientQR(text);
    } else {
        // Simple API call for solid colors
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?${params}`;
    }
}
```

### UI Components

#### 1. **Tab Navigation System**
- **Implementation**: CSS classes + JavaScript event listeners
- **Files**: `styles.css` (styling), `app.js` (functionality)
- **Features**: Smooth transitions, active state management

#### 2. **Modal Dialogs**
- **Login Overlay**: OAuth provider selection
- **User Profile**: Dashboard with URL management
- **Edit Modal**: Inline URL editing

#### 3. **Responsive Design**
- **Breakpoints**: Mobile (<768px), Tablet (768px-1024px), Desktop (>1024px)
- **Layout**: Flexbox for components, CSS Grid for dashboard
- **Touch Support**: Mobile-optimized button sizes and spacing

---

## Security Features

### 1. **Input Validation**
- **URL Validation**: Protocol and format checking
- **SQL Injection Prevention**: Prepared statements in all database queries
- **XSS Protection**: Input sanitization and output encoding

### 2. **Authentication Security**
- **OAuth 2.0 Standard**: Industry-standard authentication
- **CSRF Protection**: State parameter in OAuth flow
- **Secure Sessions**: HTTP-only session cookies

### 3. **Database Security**
- **Prepared Statements**: All SQL queries use parameterized statements
- **Connection Security**: SSL/TLS database connections
- **User Isolation**: Users can only access their own URLs

### 4. **Rate Limiting Considerations**
- **QR API**: External service rate limits handled
- **Database**: Connection pooling for performance
- **Session Management**: Timeout-based cleanup

---

## Deployment & Configuration

### Configuration Files

#### 1. **Database Configuration**
```properties
# src/main/resources/config.properties
db.url=jdbc:mysql://localhost:3306/clippr_db?useSSL=true
db.username=clippr_user
db.password=secure_password
db.driver=com.mysql.cj.jdbc.Driver
```

#### 2. **OAuth Configuration**
```properties
# Google OAuth
google.client.id=your-google-client-id
google.client.secret=your-google-client-secret
google.redirect.uri=http://localhost:8080/clippr/auth/google/callback

# Zoho OAuth  
zoho.client.id=your-zoho-client-id
zoho.client.secret=your-zoho-client-secret
zoho.redirect.uri=http://localhost:8080/clippr/auth/zoho/callback
```

### Build & Deployment

#### 1. **Maven Build Process**
```bash
# Clean and compile
mvn clean compile

# Package as WAR
mvn package

# Output: target/clippr.war
```

#### 2. **Tomcat Deployment**
- **Method**: WAR file deployment to `webapps/` directory
- **Context Path**: `/clippr`
- **Auto-deployment**: Enabled in Tomcat configuration

#### 3. **Database Setup**
```sql
-- Create database
CREATE DATABASE clippr_db;

-- Create user
CREATE USER 'clippr_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON clippr_db.* TO 'clippr_user'@'localhost';

-- Run schema files
SOURCE database-schema.sql;
```

---

## API Endpoints

### Authentication Endpoints
| Method | Endpoint | Purpose | File |
|--------|----------|---------|------|
| GET | `/auth/google` | Start Google OAuth | `GoogleAuthServlet.java` |
| GET | `/auth/google/callback` | Handle Google callback | `GoogleCallbackServlet.java` |
| GET | `/auth/zoho` | Start Zoho OAuth | `ZohoAuthServlet.java` |
| GET | `/auth/zoho/callback` | Handle Zoho callback | `ZohoCallbackServlet.java` |
| GET | `/auth/logout` | Logout user | `LogoutServlet.java` |

### URL Management Endpoints
| Method | Endpoint | Purpose | File |
|--------|----------|---------|------|
| POST | `/api/create-short-url` | Create shortened URL | `CreateShortUrlServlet.java` |
| GET | `/api/get-all-urls` | Get user's URLs | `GetAllUrlsServlet.java` |
| PUT | `/api/update-url` | Update URL | `UpdateUrlServlet.java` |
| DELETE | `/api/delete-url` | Delete URL | `DeleteUrlServlet.java` |
| GET | `/s/{shortCode}` | Redirect to original URL | `RedirectServlet.java` |

### User Profile Endpoints  
| Method | Endpoint | Purpose | File |
|--------|----------|---------|------|
| GET | `/api/user-profile` | Get user profile | `UserProfileServlet.java` |

---

## Data Flow Diagrams

### URL Shortening Flow
```
User Input (Long URL)
        ↓
Frontend Validation
        ↓
POST /api/create-short-url
        ↓
Authentication Check
        ↓
URL Validation
        ↓
Generate Short Code
        ↓
Check Database Collision
        ↓ (if collision, retry)
Store in Database
        ↓
Return Short URL
        ↓
Display to User
```

### QR Code Generation Flow
```
User Input (URL/Text + Style Options)
        ↓
Frontend Processing
        ↓
Gradient Check
        ↓
[Simple Color]           [Gradient]
        ↓                     ↓
Direct API Call         Canvas Processing
        ↓                     ↓
Display QR Code         Apply Gradient
                             ↓
                        Display QR Code
```

### OAuth Authentication Flow
```
User Clicks Login
        ↓
Redirect to OAuth Provider
        ↓
User Authorizes Application
        ↓
Provider Redirects with Code
        ↓
Exchange Code for Token
        ↓
Fetch User Profile
        ↓
Store/Update User in Database
        ↓
Create Session
        ↓
Redirect to Dashboard
```

## Error Handling & Logging

### 1. **HTTP Error Codes**
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Authentication required
- `404 Not Found`: Short URL not found
- `500 Internal Server Error`: Server-side errors

### 2. **Error Response Format**
```json
{
    "status": "error",
    "message": "Descriptive error message",
    "code": "ERROR_CODE_IF_APPLICABLE"
}
```

### 3. **Logging Strategy**
- Java Util Logging for server-side events
- Browser console for client-side debugging
- Database error logging for critical failures

---

## Future Enhancement Opportunities

### 1. **Technical Improvements**
- Connection pooling implementation (HikariCP)
- Redis caching for frequently accessed URLs
- JWT tokens instead of server sessions
- API rate limiting implementation

### 2. **Feature Enhancements**
- Custom short URL aliases
- QR code templates and branding
- Analytics dashboard with charts
- URL expiration dates

---

## Conclusion

This Clippr application demonstrates a comprehensive full-stack implementation using modern Java web technologies, RESTful API design, OAuth 2.0 authentication, and advanced frontend techniques including Canvas API manipulation. The modular architecture ensures maintainability while the technology choices provide scalability and security for a production environment.

The combination of traditional server-side rendering with modern JavaScript capabilities creates a responsive and feature-rich user experience, while the robust backend ensures data integrity and security.
