package com.clippr.app.api.servlet.url;

import com.clippr.app.features.url.contract.UrlContract;
import com.clippr.app.features.url.model.UrlModel;
import com.clippr.app.features.url.presenter.UrlPresenter;
import com.clippr.app.features.url.view.UrlView;
import com.clippr.app.repository.dto.UserDto;
import com.clippr.app.utils.JsonUtil;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;

@WebServlet("/api/delete-url")
public class DeleteUrlServlet extends HttpServlet {

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // Set response content type to JSON
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("user") == null) {
            JsonUtil.sendError(response, 401, "Unauthorized");
            return;
        }

        try {
            UserDto user = (UserDto) session.getAttribute("user");
            int urlId;

            // Try to get ID from URL parameter first (for backward compatibility)
            String idParam = request.getParameter("id");
            if (idParam != null && !idParam.isEmpty()) {
                urlId = Integer.parseInt(idParam);
            } else {
                // Read JSON request body
                StringBuilder jsonBuffer = new StringBuilder();
                String line;
                while ((line = request.getReader().readLine()) != null) {
                    jsonBuffer.append(line);
                }

                // Parse JSON to get urlid
                String jsonString = jsonBuffer.toString();
                JsonObject jsonObject = JsonParser.parseString(jsonString).getAsJsonObject();
                urlId = jsonObject.get("urlid").getAsInt();
            }

            UrlContract.Model model = new UrlModel();
            UrlContract.View view = new UrlView(response);
            UrlContract.Presenter presenter = new UrlPresenter(model, view);

            presenter.deleteUrl(urlId, user.getId());

        } catch (Exception e) {
            e.printStackTrace();
            JsonUtil.sendError(response, 400, "Invalid request format: " + e.getMessage());
        }
    }
}
