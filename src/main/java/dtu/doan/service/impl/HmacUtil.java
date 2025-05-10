package dtu.doan.service.impl;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

public class HmacUtil {
    public static String hmacSHA512(String key, String data) {
        try {
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(), "HmacSHA512");
            Mac mac = Mac.getInstance("HmacSHA512");
            mac.init(secretKey);
            byte[] bytes = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder hash = new StringBuilder();
            for (byte b : bytes) {
                hash.append(String.format("%02x", b));
            }
            return hash.toString();
        } catch (Exception ex) {
            throw new RuntimeException("Failed to generate HMAC SHA512", ex);
        }
    }
}
