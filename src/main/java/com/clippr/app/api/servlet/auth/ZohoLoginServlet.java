package com.clippr.app.api.servlet.auth;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Properties;

@WebServlet("/auth/zoho")
public class ZohoLoginServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        Properties config = new Properties();
        InputStream input = getClass().getClassLoader().getResourceAsStream("application.properties");
        if (input == null) {
            throw new ServletException("application.properties file not found in classpath");
        }
        config.load(input);
        input.close();

        String clientId = config.getProperty("zoho.client.id");
        String redirectUri = config.getProperty("zoho.redirect.uri");

        if (clientId == null || redirectUri == null) {
            throw new ServletException("Zoho OAuth configuration missing");
        }

        // URL encode parameters
        String encodedClientId = URLEncoder.encode(clientId, StandardCharsets.UTF_8);
        String encodedRedirectUri = URLEncoder.encode(redirectUri, StandardCharsets.UTF_8);
        String encodedScope = URLEncoder.encode("AaaServer.profile.Read", StandardCharsets.UTF_8);

        String authUrl = "https://accounts.zoho.in/oauth/v2/auth?" +
                "scope=" + encodedScope +
                "&client_id=" + encodedClientId +
                "&response_type=code" +
                "&access_type=offline" +
                "&redirect_uri=" + encodedRedirectUri;

        System.out.println("Zoho OAuth URL: " + authUrl); // Debug log
        response.sendRedirect(authUrl);
    }
}
