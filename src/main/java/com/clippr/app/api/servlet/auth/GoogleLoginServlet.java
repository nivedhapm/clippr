package com.clippr.app.api.servlet.auth;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

@WebServlet("/auth/google")
public class GoogleLoginServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        Properties config = new Properties();
        InputStream input = getClass().getClassLoader().getResourceAsStream("config.properties");
        config.load(input);

        String clientId = config.getProperty("google.client.id");
        String redirectUri = config.getProperty("google.redirect.uri");

        String authUrl = "https://accounts.google.com/o/oauth2/v2/auth?" +
                "client_id=" + clientId +
                "&redirect_uri=" + redirectUri +
                "&response_type=code" +
                "&scope=email profile" +
                "&access_type=offline";

        response.sendRedirect(authUrl);
    }
}
