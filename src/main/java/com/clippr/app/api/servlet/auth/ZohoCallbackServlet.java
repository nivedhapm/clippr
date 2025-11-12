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

@WebServlet("/auth/zoho/callback")
public class ZohoCallbackServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String code = request.getParameter("code");
        if (code == null) {
            response.sendRedirect(request.getContextPath() + "/?error=no_code");
            return;
        }

        AuthContract.Model model = new AuthModel();
        AuthContract.View view = new AuthView(response, request.getSession(),
                                              request.getContextPath() + "/");
        AuthContract.Presenter presenter = new AuthPresenter(model, view);

        presenter.handleOAuthCallback(code, "zoho");
    }
}
