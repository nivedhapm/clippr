package com.clippr.app.api.servlet.url;

import com.clippr.app.features.url.contract.UrlContract;
import com.clippr.app.features.url.model.UrlModel;
import com.clippr.app.repository.dto.UrlDto;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/s/*")
public class RedirectServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String pathInfo = request.getPathInfo();

        if (pathInfo == null || pathInfo.length() <= 1) {
            response.sendRedirect(request.getContextPath() + "/url-not-found.html");
            return;
        }

        String shorturlid = pathInfo.substring(1); // Remove leading /

        try {
            UrlContract.Model model = new UrlModel();
            UrlDto url = model.findByShortUrlId(shorturlid);

            if (url != null) {
                model.incrementCount(shorturlid);
                response.sendRedirect(url.getLongurl());
            } else {
                response.sendRedirect(request.getContextPath() + "/url-not-found.html?code=" + shorturlid);
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect(request.getContextPath() + "/url-not-found.html?code=" + shorturlid);
        }
    }
}
