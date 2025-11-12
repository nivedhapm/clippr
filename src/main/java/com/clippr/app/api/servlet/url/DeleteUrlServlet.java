package com.clippr.app.api.servlet.url;

import com.clippr.app.features.url.contract.UrlContract;
import com.clippr.app.features.url.model.UrlModel;
import com.clippr.app.features.url.presenter.UrlPresenter;
import com.clippr.app.features.url.view.UrlView;
import com.clippr.app.repository.dto.UserDto;
import com.clippr.app.utils.JsonUtil;
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

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("user") == null) {
            JsonUtil.sendError(response, 401, "Unauthorized");
            return;
        }

        UserDto user = (UserDto) session.getAttribute("user");
        int id = Integer.parseInt(request.getParameter("id"));

        UrlContract.Model model = new UrlModel();
        UrlContract.View view = new UrlView(response);
        UrlContract.Presenter presenter = new UrlPresenter(model, view);

        presenter.deleteUrl(id, user.getId());
    }
}
