package com.clippr.app.api.servlet.auth;

import com.clippr.app.features.auth.contract.AuthContract;
import com.clippr.app.features.auth.model.AuthModel;
import com.clippr.app.features.auth.presenter.AuthPresenter;
import com.clippr.app.features.auth.view.AuthView;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/auth/google/callback")
public class GoogleCallbackServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // Log all parameters for debugging
        System.out.println("Google callback parameters:");
        request.getParameterMap().forEach((key, values) -> {
            System.out.println(key + ": " + String.join(", ", values));
        });

        String code = request.getParameter("code");
        String error = request.getParameter("error");

        if (error != null) {
            System.out.println("OAuth error: " + error);
            response.sendRedirect(request.getContextPath() + "/?error=" + error);
            return;
        }

        if (code == null) {
            System.out.println("No authorization code received");
            response.sendRedirect(request.getContextPath() + "/?error=no_code");
            return;
        }

        try {
            AuthContract.Model model = new AuthModel();
            AuthContract.View view = new AuthView(response, request.getSession(),
                                                  request.getContextPath() + "/");
            AuthContract.Presenter presenter = new AuthPresenter(model, view);

            presenter.handleOAuthCallback(code, "google");
        } catch (Exception e) {
            System.out.println("Error in OAuth callback: " + e.getMessage());
            e.printStackTrace();
            response.sendRedirect(request.getContextPath() + "/?error=auth_failed");
        }
    }
}
