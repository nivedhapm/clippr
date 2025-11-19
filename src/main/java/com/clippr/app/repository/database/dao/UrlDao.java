package com.clippr.app.repository.database.dao;

import com.clippr.app.repository.database.DatabaseConnection;
import com.clippr.app.repository.dto.UrlDto;
import java.sql.*;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

public class UrlDao {

    private static final ZoneId IST_ZONE = ZoneId.of("Asia/Kolkata");
    private static final DateTimeFormatter IST_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private String formatTimestampToIST(Timestamp timestamp) {
        if (timestamp == null) return null;
        return timestamp.toLocalDateTime()
                .atZone(ZoneId.systemDefault())
                .withZoneSameInstant(IST_ZONE)
                .format(IST_FORMATTER);
    }

    public UrlDto findByLongUrl(String longurl) {
        String sql = "SELECT * FROM urls WHERE longurl = ?";
        try (Connection conn = DatabaseConnection.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, longurl);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return mapResultSet(rs);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public UrlDto findByLongUrlAndUserId(String longurl, int userId) {
        String sql = "SELECT * FROM urls WHERE longurl = ? AND user_id = ?";
        try (Connection conn = DatabaseConnection.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, longurl);
            stmt.setInt(2, userId);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return mapResultSet(rs);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public UrlDto findByShortUrlId(String shorturlid) {
        String sql = "SELECT * FROM urls WHERE shorturlid = ?";
        try (Connection conn = DatabaseConnection.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, shorturlid);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return mapResultSet(rs);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public UrlDto createUrl(int userId, String longurl, String shorturlid) {
        String sql = "INSERT INTO urls (user_id, longurl, shorturlid) VALUES (?, ?, ?)";
        try (Connection conn = DatabaseConnection.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            stmt.setInt(1, userId);
            stmt.setString(2, longurl);
            stmt.setString(3, shorturlid);

            int rows = stmt.executeUpdate();
            if (rows > 0) {
                ResultSet rs = stmt.getGeneratedKeys();
                if (rs.next()) {
                    return new UrlDto(rs.getInt(1), userId, longurl, shorturlid, 0, null);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public List<UrlDto> findAllByUserId(int userId) {
        List<UrlDto> urls = new ArrayList<>();
        String sql = "SELECT * FROM urls WHERE user_id = ? ORDER BY created_at DESC";
        try (Connection conn = DatabaseConnection.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, userId);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                urls.add(mapResultSet(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return urls;
    }

    public boolean updateCount(String shorturlid) {
        String sql = "UPDATE urls SET count = count + 1, lastclicked = CURRENT_TIMESTAMP WHERE shorturlid = ?";
        try (Connection conn = DatabaseConnection.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, shorturlid);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean updateLongUrl(int id, int userId, String newLongUrl) {
        String sql = "UPDATE urls SET longurl = ? WHERE id = ? AND user_id = ?";
        try (Connection conn = DatabaseConnection.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, newLongUrl);
            stmt.setInt(2, id);
            stmt.setInt(3, userId);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean deleteUrl(int id, int userId) {
        String sql = "DELETE FROM urls WHERE id = ? AND user_id = ?";
        try (Connection conn = DatabaseConnection.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, id);
            stmt.setInt(2, userId);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    private UrlDto mapResultSet(ResultSet rs) throws SQLException {
        return new UrlDto(
            rs.getInt("id"),
            rs.getInt("user_id"),
            rs.getString("longurl"),
            rs.getString("shorturlid"),
            rs.getInt("count"),
            formatTimestampToIST(rs.getTimestamp("created_at")),
            formatTimestampToIST(rs.getTimestamp("lastclicked"))
        );
    }
}
