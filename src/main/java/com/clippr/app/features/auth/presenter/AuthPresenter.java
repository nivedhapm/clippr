package com.clippr.app.features.auth.presenter;

import com.clippr.app.features.auth.contract.AuthContract;
import com.clippr.app.repository.dto.UserDto;
import com.clippr.app.utils.OAuthUtil;
import com.google.gson.JsonObject;
import java.io.InputStream;
import java.util.Properties;

public class AuthPresenter implements AuthContract.Presenter {
    private AuthContract.Model model;
    private AuthContract.View view;
    private Properties config;

    public AuthPresenter(AuthContract.Model model, AuthContract.View view) {
        this.model = model;
        this.view = view;
        loadConfig();
    }

    private void loadConfig() {
        try {
            config = new Properties();
            InputStream input = getClass().getClassLoader().getResourceAsStream("application.properties");
            if (input == null) {
                throw new RuntimeException("application.properties file not found in classpath");
            }
            config.load(input);
            input.close();
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to load configuration", e);
        }
    }

    @Override
    public void handleOAuthCallback(String code, String provider) {
        try {
            String tokenUrl, userInfoUrl, clientId, clientSecret, redirectUri;

            if ("google".equals(provider)) {
                tokenUrl = "https://oauth2.googleapis.com/token";
                userInfoUrl = "https://www.googleapis.com/oauth2/v2/userinfo";
                clientId = config.getProperty("google.client.id");
                clientSecret = config.getProperty("google.client.secret");
                redirectUri = config.getProperty("google.redirect.uri");
            } else if ("zoho".equals(provider)) {
                tokenUrl = "https://accounts.zoho.in/oauth/v2/token";
                userInfoUrl = "https://accounts.zoho.in/oauth/user/info";
                clientId = config.getProperty("zoho.client.id");
                clientSecret = config.getProperty("zoho.client.secret");
                redirectUri = config.getProperty("zoho.redirect.uri");
            } else {
                view.onAuthError("Invalid provider");
                return;
            }

            JsonObject tokenResponse = OAuthUtil.exchangeCodeForToken(tokenUrl, code, clientId, clientSecret, redirectUri);
            String accessToken = tokenResponse.get("access_token").getAsString();

            JsonObject userInfo = OAuthUtil.getUserInfo(userInfoUrl, accessToken);

            String email, name, providerId;
            if ("google".equals(provider)) {
                email = userInfo.get("email").getAsString();
                name = userInfo.get("name").getAsString();
                providerId = userInfo.get("id").getAsString();
            } else {
                email = userInfo.get("Email").getAsString();
                name = userInfo.get("Display_Name").getAsString();
                providerId = userInfo.get("ZUID").getAsString();
            }

            UserDto user = model.findOrCreateUser(email, name, provider, providerId);
            view.onAuthSuccess(user);

        } catch (Exception e) {
            view.onAuthError(e.getMessage());
        }
    }
}
