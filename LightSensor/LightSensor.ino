#include <math.h>

const int sensor = A0;
const int EMPTY_LED = 4;
const int FULL_LED = 3;

const int threshold = 30;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);

  // LED rouge
  pinMode(FULL_LED, OUTPUT);
  // LED vert
  pinMode(EMPTY_LED, OUTPUT);
}

void loop() {
  // put your main code here, to run repeatedly:
  int sensorValue=analogRead(sensor);
  Serial.println(sensorValue);

  // Si valeur de luminosité supérieur au seuil,
  // la poubelle est vide.
  if(sensorValue > threshold) {
    digitalWrite(EMPTY_LED, HIGH);
    digitalWrite(FULL_LED, LOW);
  } else {
    digitalWrite(FULL_LED, HIGH);
    digitalWrite(EMPTY_LED, LOW);
  }
  delay(1000);
}
