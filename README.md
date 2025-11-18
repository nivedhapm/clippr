<div align="center">
  <img src="webapp/assets/images/logo-banner.png" alt="Clippr Logo" width="400"/>

# Clippr - URL Shortener & QR Code Generator

[![Java](https://img.shields.io/badge/Java-17+-orange.svg)](https://www.oracle.com/java/)
[![Maven](https://img.shields.io/badge/Maven-3.6+-purple.svg)](https://maven.apache.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-blue.svg)](https://www.mysql.com/)
[![Tomcat](https://img.shields.io/badge/Tomcat-10.1-yellow.svg)](https://tomcat.apache.org/)
[![Oracle Cloud](https://img.shields.io/badge/Oracle_Cloud-Free_Tier-red.svg)](https://www.oracle.com/cloud/free/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**A full-stack web application for URL shortening and QR code generation with OAuth authentication**

🌐 **[Live Demo: https://clipprme.me](https://clipprme.me)** 🌐

*Experience Clippr in action! Create short URLs, generate custom QR codes, and manage your links with our live production deployment.*

</div>

---

## Table of Contents
1. [Overview](#overview)
2. [Key Features](#key-features)
3. [Technology Stack](#technology-stack)
4. [Application Setup](#application-setup)
5. [Usage Guide](#usage-guide)
6. [API Endpoints](#api-endpoints)
6. [Deployment](#deployment)
7. [Demo Video](#demo-video)
8. [Contributing](#contributing)
9. [License](#license)
10. [Technical Documentation](#technical-documentation)

---

## Overview

**Clippr** is a full-stack web application that provides URL shortening and QR code generation services with OAuth-based user authentication. Users can create shortened URLs, generate customizable QR codes with gradient support, and manage their links through a personalized dashboard.

Clippr demonstrates a complete end-to-end system integrating:
- Java Servlets (Jakarta EE)
- MySQL database
- OAuth 2.0 authentication (Google & Zoho)
- Vanilla JavaScript frontend with Canvas API

The combination of traditional server-side rendering with modern JavaScript capabilities creates a responsive and feature-rich user experience, while the robust backend ensures data integrity and security.

### Educational Value
This project serves as an excellent learning resource for developers interested in:
- Full-stack Java web development with modern practices
- OAuth 2.0 authentication implementation
- RESTful API design and implementation
- Database integration with MySQL
- Frontend JavaScript and Canvas API usage
- Cloud deployment on Oracle Cloud Infrastructure

Students and developers are encouraged to explore, learn from, and contribute to this codebase!

---

## Key Features

### Core Functionality
- **URL Shortening** with unique alphanumeric short codes
- **QR Code Generation** with gradient color customization
- **OAuth 2.0 Authentication** (Google & Zoho)
- **User Dashboard** with comprehensive analytics
- **Real-time Click Tracking** for shortened URLs
- **CRUD Operations** for user URL management

### Advanced Features
- **QR Code Customization**: Solid colors, linear gradients, radial gradients, diagonal gradients
- **Analytics Dashboard**: View creation date, last clicked timestamp, click counts
- **Responsive Design**: Mobile-first design with cross-device compatibility
- **Secure Authentication**: Industry-standard OAuth 2.0 implementation
- **Real-time Updates**: Instant URL validation and QR code generation
- **Multiple Download Formats**: PNG and SVG support for QR codes

---

## Technology Stack

### Backend
- **Java 17+** with Jakarta EE (Servlet API 6.0)
- **Apache Tomcat 10.1.48** (Servlet Container)
- **MySQL 8.0+** (Database)
- **Maven 3.6+** (Build Tool)
- **Apache HttpClient 4.5.14** (OAuth HTTP requests)
- **Gson 2.10.1** (JSON Processing)

### Frontend
- **HTML5** with semantic markup
- **CSS3** with Flexbox/Grid layouts
- **Vanilla JavaScript ES6+** with Canvas API
- **Font Awesome 6** (Icons)
- **QR Server API** (External QR generation service)

### Architecture
- **MVP Pattern** for clean separation of concerns
- **RESTful API Design** for frontend-backend communication
- **Session-based Authentication** with HTTP cookies
- **Responsive Single Page Application** (SPA)

### Deployment & Hosting
- **Oracle Cloud Free Tier** (Cloud hosting platform)
- **Compute Instance** (VM for application hosting)
- **Oracle MySQL Database Service** (Managed database)

---

## Application Setup

### Prerequisites

Ensure you have the following installed:

- **Java JDK 17+** ([Download](https://www.oracle.com/java/technologies/downloads/))
- **Apache Maven 3.6+** ([Download](https://maven.apache.org/download.cgi))
- **MySQL 8.0+** ([Download](https://dev.mysql.com/downloads/))
- **Apache Tomcat 10.1+** ([Download](https://tomcat.apache.org/download-10.cgi))
- **Git** ([Download](https://git-scm.com/downloads))

### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/clippr-app.git
cd clippr-app
```

### Step 2: Database Setup

1. **Start MySQL Server**

2. **Create Database and User**
   ```sql
   -- Login to MySQL
   mysql -u root -p
   
   -- Create database
   CREATE DATABASE clippr_db;
   
   -- Create user (replace 'your_password' with a secure password)
   CREATE USER 'clippr_user'@'localhost' IDENTIFIED BY 'your_password';
   
   -- Grant privileges
   GRANT ALL PRIVILEGES ON clippr_db.* TO 'clippr_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

3. **Import Database Schema**
   ```bash
   mysql -u clippr_user -p clippr_db < database-schema.sql
   ```

### Step 3: OAuth Configuration

#### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google+ API**
4. Go to **Credentials** > **Create Credentials** > **OAuth 2.0 Client ID**
5. Configure OAuth consent screen
6. Add authorized redirect URI: `http://localhost:8080/clippr/auth/google/callback`
7. Copy **Client ID** and **Client Secret**

#### Zoho OAuth Setup

1. Go to [Zoho API Console](https://api-console.zoho.in/)
2. Click **Add Client** > **Server-based Applications**
3. Add authorized redirect URI: `http://localhost:8080/clippr/auth/zoho/callback`
4. Copy **Client ID** and **Client Secret**

### Step 4: Configure Application

Edit `src/main/resources/config.properties`:

```properties
# Database Configuration
db.url=jdbc:mysql://localhost:3306/clippr_db?useSSL=false
db.username=clippr_user
db.password=your_password
db.driver=com.mysql.cj.jdbc.Driver

# Google OAuth
google.client.id=YOUR_GOOGLE_CLIENT_ID
google.client.secret=YOUR_GOOGLE_CLIENT_SECRET
google.redirect.uri=http://localhost:8080/clippr/auth/google/callback

# Zoho OAuth
zoho.client.id=YOUR_ZOHO_CLIENT_ID
zoho.client.secret=YOUR_ZOHO_CLIENT_SECRET
zoho.redirect.uri=http://localhost:8080/clippr/auth/zoho/callback
```

### Step 5: Build Application

```bash
mvn clean package
```

This creates `target/clippr.war`

### Step 6: Deploy to Tomcat

**Option A: Manual Deployment**
```bash
cp target/clippr.war /path/to/tomcat/webapps/
```

**Option B: Using Deployment Script (Windows)**
```bash
deploy.bat
```

### Step 7: Start Tomcat

```bash
# Linux/Mac
./catalina.sh run

# Windows
catalina.bat run
```

### Step 8: Access Application

Open your browser and navigate to:
```
http://localhost:8080/clippr
```

---

## Usage Guide

### For End Users

#### 1. Authentication

1. Visit `http://localhost:8080/clippr`
2. Click **Login** button
3. Choose **Google** or **Zoho**
4. Complete OAuth authorization
5. You'll be redirected to the dashboard

#### 2. Shorten a URL

1. Navigate to **Short URL** tab
2. Enter your long URL (e.g., `https://www.example.com/very-long-url`)
3. Click **Get Your Short Link**
4. Copy the generated short URL
5. Share it anywhere

**Example:**
```
Input:  https://www.example.com/products/category/subcategory/item-12345
Output: http://localhost:8080/clippr/s/aB3xYz
```

#### 3. Generate QR Code

1. Navigate to **QR Code** tab
2. Enter URL or text to encode
3. **Simple Mode** (Solid Colors):
    - Choose foreground color
    - Choose background color
    - Click **Generate QR Code**

4. **Advanced Mode** (Gradients):
    - Check **Use Gradient Effect**
    - Select gradient type (Linear/Radial/Diagonal)
    - Choose two colors
    - Click **Generate QR Code**

5. Download in PNG or SVG format

#### 4. Manage Your URLs

1. Click your **profile icon** (top right)
2. View all your shortened URLs
3. See analytics:
    - Click count
    - Creation date
    - Last clicked timestamp
4. **Edit** or **Delete** URLs as needed

### QR Code Customization Options

- **Solid Colors**: Choose foreground and background colors
- **Linear Gradients**: Horizontal, vertical, diagonal directions
- **Radial Gradients**: Center-to-edge color transitions
- **Single Color Mode**: Apply single color to QR pattern

[//]: # (### For Developers)

[//]: # ()
[//]: # (#### API Integration)

[//]: # ()
[//]: # (Clippr provides RESTful APIs for integration:)

[//]: # ()
[//]: # (```javascript)

[//]: # (// Create short URL)

[//]: # (const response = await fetch&#40;'http://localhost:8080/clippr/api/create-short-url', {)

[//]: # (    method: 'POST',)

[//]: # (    headers: { 'Content-Type': 'application/json' },)

[//]: # (    credentials: 'include',)

[//]: # (    body: JSON.stringify&#40;{ )

[//]: # (        longurl: 'https://example.com' )

[//]: # (    }&#41;)

[//]: # (}&#41;;)

[//]: # ()
[//]: # (const data = await response.json&#40;&#41;;)

[//]: # (console.log&#40;data.shorturl&#41;; // http://localhost:8080/clippr/s/abc123)

[//]: # (```)

---

## API Endpoints

#### Authentication Endpoints
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| GET | `/auth/google` | Initiate Google OAuth login | None |
| GET | `/auth/google/callback` | Handle Google OAuth callback | None |
| GET | `/auth/zoho` | Initiate Zoho OAuth login | None |
| GET | `/auth/zoho/callback` | Handle Zoho OAuth callback | None |
| GET | `/auth/logout` | Logout current user | Session |

#### URL Management Endpoints
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | `/api/create-short-url` | Create new shortened URL | Required |
| GET | `/api/get-all-urls` | Get user's all URLs | Required |
| PUT | `/api/update-url` | Update existing URL | Required |
| DELETE | `/api/delete-url?id={id}` | Delete URL by ID | Required |
| GET | `/s/{shortCode}` | Redirect to original URL | None |

#### User Profile Endpoints
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| GET | `/api/user-profile` | Get user profile info | Required |

### Request/Response Examples

#### Create Short URL
```javascript
// Request
POST /api/create-short-url
Content-Type: application/json

{
  "longurl": "https://www.example.com/very-long-url"
}

// Response  
{
  "status": "ok",
  "shorturlid": "abc123",
  "shorturl": "http://localhost:8080/clippr/s/abc123"
}
```

#### Get All URLs
```javascript
// Response
[
  {
    "id": 1,
    "longurl": "https://www.example.com",
    "shorturlid": "abc123", 
    "count": 5,
    "created_at": "2025-11-10T14:30:00",
    "last_clicked": "2025-11-10T16:45:00"
  }
]
```

---

## Deployment

### Oracle Cloud Free Tier Deployment

Clippr is configured to deploy on Oracle Cloud Infrastructure (OCI) Free Tier, providing:
- **Always Free Compute Instance** (VM.Standard.E2.1.Micro)
- **Oracle MySQL Database Service** (Free tier eligible)
- **50 GB Block Storage**
- **10 TB Outbound Data Transfer per month**

#### Prerequisites for Oracle Cloud Deployment

1. **Oracle Cloud Account** ([Sign Up Free](https://www.oracle.com/cloud/free/))
2. **SSH Key Pair** for instance access
3. **Domain Name** (optional, for custom URLs)

#### Deployment Steps

1. **Create Compute Instance**
    - Login to Oracle Cloud Console
    - Navigate to **Compute** > **Instances**
    - Click **Create Instance**
    - Select **Always Free Eligible** shape (VM.Standard.E2.1.Micro)
    - Choose **Oracle Linux 8** or **Ubuntu 20.04**
    - Configure networking and add SSH key
    - Note the **Public IP Address**

2. **Configure Security List**
    - Navigate to **Networking** > **Virtual Cloud Networks**
    - Select your VCN > **Security Lists**
    - Add Ingress Rules:
        - Port 8080 (Tomcat)
        - Port 3306 (MySQL) - only if using separate DB instance
        - Port 80/443 (HTTP/HTTPS) - optional

3. **Connect to Instance**
   ```bash
   ssh -i /path/to/private-key opc@<public-ip-address>
   ```

4. **Install Required Software**
   ```bash
   # Update system
   sudo yum update -y
   
   # Install Java 17
   sudo yum install java-17-openjdk java-17-openjdk-devel -y
   
   # Install Maven
   sudo yum install maven -y
   
   # Install MySQL
   sudo yum install mysql-server -y
   sudo systemctl start mysqld
   sudo systemctl enable mysqld
   
   # Install Tomcat
   wget https://dlcdn.apache.org/tomcat/tomcat-10/v10.1.48/bin/apache-tomcat-10.1.48.tar.gz
   tar -xzf apache-tomcat-10.1.48.tar.gz
   sudo mv apache-tomcat-10.1.48 /opt/tomcat
   ```

5. **Setup Database**
   ```bash
   # Secure MySQL installation
   sudo mysql_secure_installation
   
   # Create database and user
   mysql -u root -p
   CREATE DATABASE clippr_db;
   CREATE USER 'clippr_user'@'localhost' IDENTIFIED BY 'secure_password';
   GRANT ALL PRIVILEGES ON clippr_db.* TO 'clippr_user'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   
   # Import schema
   mysql -u clippr_user -p clippr_db < database-schema.sql
   ```

6. **Deploy Application**
   ```bash
   # Clone repository
   git clone https://github.com/yourusername/clippr-app.git
   cd clippr-app
   
   # Update config.properties with production values
   nano src/main/resources/config.properties
   
   # Build application
   mvn clean package
   
   # Deploy to Tomcat
   sudo cp target/clippr.war /opt/tomcat/webapps/
   ```

7. **Configure OAuth for Production**
    - Update OAuth redirect URIs in Google Cloud Console and Zoho API Console:
      ```
      http://<your-public-ip>:8080/clippr/auth/google/callback
      http://<your-public-ip>:8080/clippr/auth/zoho/callback
      ```
    - Update `config.properties` with production redirect URIs

8. **Start Tomcat**
   ```bash
   /opt/tomcat/bin/startup.sh
   ```

9. **Configure Firewall**
   ```bash
   sudo firewall-cmd --permanent --add-port=8080/tcp
   sudo firewall-cmd --reload
   ```

10. **Access Application**
    ```
    http://<your-public-ip>:8080/clippr
    ```

#### Optional: Setup Domain and SSL

1. **Configure Domain**
    - Point your domain's A record to the instance public IP
    - Install and configure Apache/Nginx as reverse proxy
    - Proxy port 80/443 to Tomcat port 8080

2. **Install SSL Certificate**
   ```bash
   # Install Certbot
   sudo yum install certbot python3-certbot-apache -y
   
   # Obtain certificate
   sudo certbot --apache -d yourdomain.com
   ```

### Local Development Deployment

For local development and testing, follow the [Application Setup](#application-setup) section above.

---

## Demo Video

<img src="https://raw.githubusercontent.com/nivedhapm/clippr/main/demo/clippr-demo.gif" alt="Clippr Application Demo" width="700">

To view the application demo:

[Download and watch demo](https://github.com/nivedhapm/clippr/releases/download/v1.0/clippr-application-demo.mp4)

---

## Contributing

Contributions are welcome. To contribute:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/new-feature
   ```

3. Make your changes and commit:
   ```bash
   git commit -m "Add new feature"
   ```

4. Push to your branch:
   ```bash
   git push origin feature/new-feature
   ```

5. Submit a Pull Request.

Report bugs or request features here:
- [Report Bug](https://github.com/nivedhapm/clippr/issues)
- [Request Feature](https://github.com/nivedhapm/clippr/issues)

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Technical Documentation

For complete architecture details, API endpoints, database schema, and OAuth flow explanation, refer to:

[CLIPPR_TECHNICAL_DOCUMENTATION.md](CLIPPR_TECHNICAL_DOCUMENTATION.md)

---

<div align="center">

Made with dedication by **Nivedha P M**

</div>