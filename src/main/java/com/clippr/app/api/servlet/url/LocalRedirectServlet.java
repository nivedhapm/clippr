package com.clippr.app.api.servlet.url;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/local/*")
public class LocalRedirectServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String pathInfo = request.getPathInfo();

        if (pathInfo == null || pathInfo.length() <= 1) {
            response.sendError(404, "Short URL not found");
            return;
        }

        String shorturlid = pathInfo.substring(1); // Remove leading /

        // For local URLs, redirect to a page that handles localStorage lookup
        response.sendRedirect(request.getContextPath() + "/redirect.html?code=" + shorturlid);
    }
}
