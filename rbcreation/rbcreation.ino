#include <HSBColor.h>
#include <Encabulator.h>
#include <Wire.h>

String cmdLine = "";
int timeout = 0;
int lastVelocity = 0;
boolean fading = false;
void setup(){
  Encabulator.upUpDownDownLeftRightLeftRightBA();
  
  Encabulator.setVerbose(true);
  //Encabulator.stripBankB.jumpHeaderToRGB(1,255,0,0);
}

void loop(){
  char ch = Serial.read();
  if(ch > -1){
    if(ch == '\n'){
      //Serial.println(cmdLine);
      cmd(cmdLine);
      cmdLine = "";
      
      return;
    }
    cmdLine += String(ch);
    return;
  }
  delay(1);
  if(timeout > 0){
    timeout--;
  }else{
    if(lastVelocity > 0 && !fading){
      Encabulator.stripBankB.fadeHeaderToRGB(1,0,0,0,20);
      fading = true;
    }
  }
}

void cmd(String line){
  byte note = line[0];
  byte velocity = line[1];
  int brightness = map(velocity, 0, 130, 0, 90);
//  int octave = map(note, 21, 108, 0, 20);
  int hue = map(note, 21, 108, 0, 359);
  int saturation = 99;
  int rgb[3];
  H2R_HSBtoRGB(hue, saturation, brightness, rgb);
  int red = rgb[0];//map(note, 21, 108, power, 0);
  int green = rgb[1];//0;//map(note, 21, 1, power, 0);
  int blue = rgb[2];//power - red;
  Serial.print("red: ");
  Serial.print(red);
  Serial.print(", Green: ");
  Serial.print(green);
  Serial.print(", Blue: ");
  Serial.println(blue);
  Encabulator.stripBankB.fadeHeaderToRGB(1,red,green,blue, 5);
  Encabulator.addressable.drawGradient(0,0,0,0,0,0,64);  
  Encabulator.addressable.drawGradient(0,255,0,255,0,0,map(velocity, 0, 95, 0, 64));  
  lastVelocity = velocity;
  timeout = velocity*1;
  fading = false;
}