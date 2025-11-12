package com.clippr.app.features.auth.view;

import com.clippr.app.features.auth.contract.AuthContract;
import com.clippr.app.repository.dto.UserDto;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;

public class AuthView implements AuthContract.View {
    private HttpServletResponse response;
    private HttpSession session;
    private String redirectUrl;

    public AuthView(HttpServletResponse response, HttpSession session, String redirectUrl) {
        this.response = response;
        this.session = session;
        this.redirectUrl = redirectUrl;
    }

    @Override
    public void onAuthSuccess(UserDto user) {
        try {
            session.setAttribute("user", user);
            response.sendRedirect(redirectUrl);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onAuthError(String message) {
        try {
            response.sendRedirect(redirectUrl + "?error=" + message);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
