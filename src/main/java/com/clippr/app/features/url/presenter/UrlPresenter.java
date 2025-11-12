package com.clippr.app.features.url.presenter;

import com.clippr.app.features.url.contract.UrlContract;
import com.clippr.app.repository.dto.UrlDto;
import com.clippr.app.utils.ValidationUtil;
import java.util.List;

public class UrlPresenter implements UrlContract.Presenter {
    private UrlContract.Model model;
    private UrlContract.View view;

    public UrlPresenter(UrlContract.Model model, UrlContract.View view) {
        this.model = model;
        this.view = view;
    }

    @Override
    public void createShortUrl(int userId, String longurl, String appHost) {
        if (!ValidationUtil.isValidUrl(longurl)) {
            view.onError("Invalid URL. Must start with http:// or https://");
            return;
        }

        try {
            UrlDto url = model.createShortUrl(userId, longurl);
            if (url != null) {
                view.onShortUrlCreated(url);
            } else {
                view.onError("Failed to create short URL");
            }
        } catch (IllegalArgumentException e) {
            view.onError(e.getMessage());
        }
    }

    @Override
    public void getRedirectUrl(String shorturlid) {
        UrlDto url = model.findByShortUrlId(shorturlid);
        if (url != null) {
            model.incrementCount(shorturlid);
        }
    }

    @Override
    public void getUserUrls(int userId) {
        List<UrlDto> urls = model.getUserUrls(userId);
        view.onUrlsRetrieved(urls);
    }

    @Override
    public void updateUrl(int id, int userId, String newLongUrl) {
        if (!ValidationUtil.isValidUrl(newLongUrl)) {
            view.onError("Invalid URL");
            return;
        }
        boolean success = model.updateUrl(id, userId, newLongUrl);
        view.onUrlUpdated(success);
    }

    @Override
    public void deleteUrl(int id, int userId) {
        boolean success = model.deleteUrl(id, userId);
        view.onUrlDeleted(success);
    }
}
