package com.clippr.app.features.url.model;

import com.clippr.app.features.url.contract.UrlContract;
import com.clippr.app.repository.database.dao.UrlDao;
import com.clippr.app.repository.dto.UrlDto;
import java.util.List;
import java.util.Random;

public class UrlModel implements UrlContract.Model {
    private UrlDao urlDao;

    public UrlModel() {
        this.urlDao = new UrlDao();
    }

    @Override
    public UrlDto createShortUrl(int userId, String longurl) {
        // Check if the URL is already a Clippr short URL
        if (isClipprUrl(longurl)) {
            throw new IllegalArgumentException("Invalid URL: Already a Clippr shortened URL");
        }

        // Check if this long URL already exists for this user
        UrlDto existing = urlDao.findByLongUrlAndUserId(longurl, userId);
        if (existing != null) {
            return existing; // Return existing short URL to avoid duplicates
        }

        String shorturlid = generateShortCode();
        return urlDao.createUrl(userId, longurl, shorturlid);
    }

    private boolean isClipprUrl(String url) {
        // Check if URL matches Clippr short URL patterns
        return url.contains("/clippr/s/") ||
               url.matches(".*://[^/]+/clippr/s/[a-zA-Z0-9]{7}$");
    }

    @Override
    public UrlDto findByShortUrlId(String shorturlid) {
        return urlDao.findByShortUrlId(shorturlid);
    }

    @Override
    public List<UrlDto> getUserUrls(int userId) {
        return urlDao.findAllByUserId(userId);
    }

    @Override
    public boolean updateUrl(int id, int userId, String newLongUrl) {
        return urlDao.updateLongUrl(id, userId, newLongUrl);
    }

    @Override
    public boolean deleteUrl(int id, int userId) {
        return urlDao.deleteUrl(id, userId);
    }

    @Override
    public boolean incrementCount(String shorturlid) {
        return urlDao.updateCount(shorturlid);
    }

    private String generateShortCode() {
        String chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        Random random = new Random();
        StringBuilder sb = new StringBuilder(7);
        for (int i = 0; i < 7; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }
}
