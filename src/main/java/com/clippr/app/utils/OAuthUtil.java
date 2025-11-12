package com.clippr.app.utils;

import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import java.util.ArrayList;
import java.util.List;

public class OAuthUtil {

    public static JsonObject exchangeCodeForToken(String tokenUrl, String code, String clientId,
                                                   String clientSecret, String redirectUri) throws Exception {
        CloseableHttpClient client = HttpClients.createDefault();
        HttpPost post = new HttpPost(tokenUrl);

        // Use form-encoded data for OAuth token exchange (standard for OAuth)
        List<BasicNameValuePair> params = new ArrayList<>();
        params.add(new BasicNameValuePair("code", code));
        params.add(new BasicNameValuePair("client_id", clientId));
        params.add(new BasicNameValuePair("client_secret", clientSecret));
        params.add(new BasicNameValuePair("redirect_uri", redirectUri));
        params.add(new BasicNameValuePair("grant_type", "authorization_code"));

        post.setEntity(new UrlEncodedFormEntity(params));
        post.setHeader("Content-Type", "application/x-www-form-urlencoded");

        CloseableHttpResponse response = client.execute(post);
        String responseBody = EntityUtils.toString(response.getEntity());

        System.out.println("Token exchange response: " + responseBody); // Debug log

        client.close();

        return JsonParser.parseString(responseBody).getAsJsonObject();
    }

    public static JsonObject getUserInfo(String userInfoUrl, String accessToken) throws Exception {
        CloseableHttpClient client = HttpClients.createDefault();
        HttpGet get = new HttpGet(userInfoUrl);
        get.setHeader("Authorization", "Bearer " + accessToken);

        CloseableHttpResponse response = client.execute(get);
        String responseBody = EntityUtils.toString(response.getEntity());

        System.out.println("User info response: " + responseBody); // Debug log

        client.close();

        return JsonParser.parseString(responseBody).getAsJsonObject();
    }
}
