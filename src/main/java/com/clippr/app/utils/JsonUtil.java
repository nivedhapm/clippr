package com.clippr.app.utils;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class JsonUtil {
    private static final Gson gson = new GsonBuilder().create();

    public static void sendJsonResponse(HttpServletResponse response, int statusCode, Object data) throws IOException {
        response.setStatus(statusCode);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(gson.toJson(data));
    }

    public static void sendSuccess(HttpServletResponse response, Object data) throws IOException {
        sendJsonResponse(response, 200, data);
    }

    public static void sendError(HttpServletResponse response, int statusCode, String message) throws IOException {
        Map<String, String> error = new HashMap<>();
        error.put("status", "error");
        error.put("message", message);
        sendJsonResponse(response, statusCode, error);
    }

    public static <T> T fromJson(String json, Class<T> classOfT) {
        return gson.fromJson(json, classOfT);
    }

    public static String toJson(Object obj) {
        return gson.toJson(obj);
    }
}
