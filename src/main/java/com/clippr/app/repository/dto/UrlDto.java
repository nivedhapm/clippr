package com.clippr.app.repository.dto;

public class UrlDto {
    private int id;
    private int userId;
    private String longurl;
    private String shorturlid;
    private int count;
    private String createdAt;
    private String lastclicked;

    public UrlDto() {}

    public UrlDto(int id, int userId, String longurl, String shorturlid, int count, String createdAt) {
        this.id = id;
        this.userId = userId;
        this.longurl = longurl;
        this.shorturlid = shorturlid;
        this.count = count;
        this.createdAt = createdAt;
    }

    public UrlDto(int id, int userId, String longurl, String shorturlid, int count, String createdAt, String lastclicked) {
        this.id = id;
        this.userId = userId;
        this.longurl = longurl;
        this.shorturlid = shorturlid;
        this.count = count;
        this.createdAt = createdAt;
        this.lastclicked = lastclicked;
    }

    // Getters and Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }

    public String getLongurl() { return longurl; }
    public void setLongurl(String longurl) { this.longurl = longurl; }

    public String getShorturlid() { return shorturlid; }
    public void setShorturlid(String shorturlid) { this.shorturlid = shorturlid; }

    public int getCount() { return count; }
    public void setCount(int count) { this.count = count; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getLastclicked() { return lastclicked; }
    public void setLastclicked(String lastclicked) { this.lastclicked = lastclicked; }
}
