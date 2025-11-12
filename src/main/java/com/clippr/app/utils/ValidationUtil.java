package com.clippr.app.utils;

import java.net.URL;

public class ValidationUtil {

    public static boolean isValidUrl(String urlString) {
        if (urlString == null || urlString.trim().isEmpty()) {
            return false;
        }

        urlString = urlString.trim();

        if (!urlString.startsWith("http://") && !urlString.startsWith("https://")) {
            return false;
        }

        try {
            new URL(urlString);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public static boolean isClipprUrl(String urlString, String appHost) {
        if (urlString == null || appHost == null) {
            return false;
        }
        return urlString.startsWith(appHost);
    }
}
