package com.clippr.app.api.servlet.url;

import com.clippr.app.features.url.contract.UrlContract;
import com.clippr.app.features.url.model.UrlModel;
import com.clippr.app.features.url.presenter.UrlPresenter;
import com.clippr.app.features.url.view.UrlView;
import com.clippr.app.repository.dto.UserDto;
import com.clippr.app.utils.JsonUtil;
import com.google.gson.JsonObject;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.BufferedReader;
import java.io.IOException;

@WebServlet("/api/create-short-url")
public class CreateShortUrlServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("user") == null) {
            JsonUtil.sendError(response, 401, "Please login to create short URLs");
            return;
        }

        UserDto user = (UserDto) session.getAttribute("user");

        StringBuilder sb = new StringBuilder();
        BufferedReader reader = request.getReader();
        String line;
        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }

        JsonObject json = JsonUtil.fromJson(sb.toString(), JsonObject.class);
        String longurl = json.get("longurl").getAsString();

        String appHost = request.getScheme() + "://" + request.getServerName() +
                        ":" + request.getServerPort() + request.getContextPath();

        UrlContract.Model model = new UrlModel();
        UrlContract.View view = new UrlView(response);
        UrlContract.Presenter presenter = new UrlPresenter(model, view);

        presenter.createShortUrl(user.getId(), longurl, appHost);
    }
}
