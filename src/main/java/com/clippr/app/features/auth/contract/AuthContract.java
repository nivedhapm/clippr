package com.clippr.app.features.auth.contract;

import com.clippr.app.repository.dto.UserDto;

public interface AuthContract {

    interface Model {
        UserDto findOrCreateUser(String email, String name, String provider, String providerId);
    }

    interface View {
        void onAuthSuccess(UserDto user);
        void onAuthError(String message);
    }

    interface Presenter {
        void handleOAuthCallback(String code, String provider);
    }
}
