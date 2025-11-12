package com.clippr.app.features.url.contract;

import com.clippr.app.repository.dto.UrlDto;
import java.util.List;

public interface UrlContract {

    interface Model {
        UrlDto createShortUrl(int userId, String longurl);
        UrlDto findByShortUrlId(String shorturlid);
        List<UrlDto> getUserUrls(int userId);
        boolean updateUrl(int id, int userId, String newLongUrl);
        boolean deleteUrl(int id, int userId);
        boolean incrementCount(String shorturlid);
    }

    interface View {
        void onShortUrlCreated(UrlDto url);
        void onUrlsRetrieved(List<UrlDto> urls);
        void onUrlUpdated(boolean success);
        void onUrlDeleted(boolean success);
        void onError(String message);
    }

    interface Presenter {
        void createShortUrl(int userId, String longurl, String appHost);
        void getRedirectUrl(String shorturlid);
        void getUserUrls(int userId);
        void updateUrl(int id, int userId, String newLongUrl);
        void deleteUrl(int id, int userId);
    }
}
