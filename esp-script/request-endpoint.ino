#include <WiFi.h>;
#include <HTTPClient.h>;
#include <ArduinoJson.h>;

const char* ssid = "Mubarok";
const char* password = "Mubarok090319";

void setup {
  Serial.begin(9600);
  WiFi.begin(ssid, password);
  Serial.print("Connect to WiFi");

  while (WiFi.status() != WL_CONNECT) {
    Serial.print(".");
    delay(500);
  }

  Serial.println("\nConnected to the WiFi network");
  Serial.print("IP Address: ");
  Serial.print(WiFi.localIP())
}

void loop {
    if (WiFi.status() == WL_CONNECT) {
      HTTPClient client;

      client.begin("http://192.168.1.12:3000/customer/uid-scan/rfid/8080277111");
      client.POST();
    }
}
