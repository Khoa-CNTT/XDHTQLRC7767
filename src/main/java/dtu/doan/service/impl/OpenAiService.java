package dtu.doan.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class OpenAiService {

    public String ask(String prompt, String apiKey) {
        HttpClient client = HttpClient.newHttpClient();
        ObjectMapper objectMapper = new ObjectMapper();

        // Tạo body request đúng chuẩn
        ObjectNode requestBody = objectMapper.createObjectNode();
        requestBody.put("model", "gpt-3.5-turbo");

        ArrayNode messages = objectMapper.createArrayNode();
        ObjectNode message = objectMapper.createObjectNode();
        message.put("role", "user");
        message.put("content", prompt);
        messages.add(message);

        requestBody.set("messages", messages);

        String jsonString;
        try {
            jsonString = objectMapper.writeValueAsString(requestBody);
        } catch (Exception e) {
            return "Lỗi khi tạo JSON: " + e.getMessage();
        }

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.openai.com/v1/chat/completions"))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + apiKey)
                .POST(HttpRequest.BodyPublishers.ofString(jsonString))
                .build();

        try {
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            String json = response.body();

            // Kiểm tra lỗi
            if (json.contains("error")) {
                return "Lỗi từ OpenAI: " + json;
            }

            // Trích xuất kết quả
            JsonNode rootNode = objectMapper.readTree(json);
            if (rootNode.has("choices")) {
                return rootNode.get("choices").get(0).get("message").get("content").asText();
            } else {
                return "Không có nội dung phản hồi.";
            }
        } catch (Exception e) {
            return "Lỗi khi gọi OpenAI: " + e.getMessage();
        }
    }
}
