package com.clippr.app.api.servlet.auth;

import com.clippr.app.repository.database.dao.UserDao;
import com.clippr.app.repository.dto.UserDto;
import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@WebServlet("/api/user-profile")
public class UserProfileServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        HttpSession session = request.getSession(false);
        if (session == null) {
            response.setStatus(401);
            response.getWriter().write("{\"error\": \"Not authenticated\"}");
            return;
        }

        try {
            // Prefer the full user object stored by AuthView
            UserDto user = (UserDto) session.getAttribute("user");

            // Fallback: if only user_id was stored, fetch from DB
            if (user == null && session.getAttribute("user_id") != null) {
                int userId = (Integer) session.getAttribute("user_id");
                user = new UserDao().findById(userId);
            }

            if (user == null) {
                response.setStatus(401);
                response.getWriter().write("{\"error\": \"Not authenticated\"}");
                return;
            }

            Map<String, String> userProfile = new HashMap<>();
            String name = (user.getName() != null && !user.getName().isBlank())
                    ? user.getName()
                    : extractNameFromEmail(user.getEmail());
            userProfile.put("name", name);
            userProfile.put("email", user.getEmail());
            // profile picture is optional in DB; frontend can fallback to initials avatar
            if (user.getProfilePicture() != null) {
                userProfile.put("profilePicture", user.getProfilePicture());
            }

            String json = new Gson().toJson(userProfile);
            response.getWriter().write(json);
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(500);
            response.getWriter().write("{\"error\": \"Internal server error\"}");
        }
    }

    private String extractNameFromEmail(String email) {
        if (email != null && email.contains("@")) {
            String username = email.split("@")[0];
            if (username.isEmpty()) return "User";
            return username.substring(0, 1).toUpperCase() +
                   username.substring(1).replace(".", " ").replace("_", " ");
        }
        return "User";
    }
}
