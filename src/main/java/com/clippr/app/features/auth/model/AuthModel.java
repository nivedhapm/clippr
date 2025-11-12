package com.clippr.app.features.auth.model;

import com.clippr.app.features.auth.contract.AuthContract;
import com.clippr.app.repository.database.dao.UserDao;
import com.clippr.app.repository.dto.UserDto;

public class AuthModel implements AuthContract.Model {
    private UserDao userDao;

    public AuthModel() {
        this.userDao = new UserDao();
    }

    @Override
    public UserDto findOrCreateUser(String email, String name, String provider, String providerId) {
        UserDto user = userDao.findByEmail(email);
        if (user == null) {
            user = userDao.createUser(email, name, provider, providerId);
        }
        return user;
    }
}
