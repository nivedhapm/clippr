package com.clippr.app.features.url.view;

import com.clippr.app.features.url.contract.UrlContract;
import com.clippr.app.repository.dto.UrlDto;
import com.clippr.app.utils.JsonUtil;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class UrlView implements UrlContract.View {
    private HttpServletResponse response;

    public UrlView(HttpServletResponse response) {
        this.response = response;
    }

    @Override
    public void onShortUrlCreated(UrlDto url) {
        try {
            Map<String, Object> result = new HashMap<>();
            result.put("status", "ok");
            result.put("shorturlid", url.getShorturlid());
            result.put("longurl", url.getLongurl());
            JsonUtil.sendSuccess(response, result);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onUrlsRetrieved(List<UrlDto> urls) {
        try {
            JsonUtil.sendSuccess(response, urls);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onUrlUpdated(boolean success) {
        try {
            if (success) {
                Map<String, String> result = new HashMap<>();
                result.put("status", "ok");
                result.put("message", "URL updated successfully");
                JsonUtil.sendSuccess(response, result);
            } else {
                JsonUtil.sendError(response, 400, "Failed to update URL");
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onUrlDeleted(boolean success) {
        try {
            if (success) {
                Map<String, String> result = new HashMap<>();
                result.put("status", "ok");
                result.put("message", "URL deleted successfully");
                JsonUtil.sendSuccess(response, result);
            } else {
                JsonUtil.sendError(response, 400, "Failed to delete URL");
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onError(String message) {
        try {
            JsonUtil.sendError(response, 400, message);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
