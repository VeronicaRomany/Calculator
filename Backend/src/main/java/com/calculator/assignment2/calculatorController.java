package com.calculator.assignment2;

import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/calculator")
public class calculatorController {
    @GetMapping ("/exp")
    public String calculate (@RequestParam String number1 , @RequestParam String op , @RequestParam String number2){
        double result=0;
        double num1 = Double.parseDouble(number1);
        double num2 = Double.parseDouble(number2);
        switch (op){
            case "-":
                result = num1 - num2;
                break;
            case "*":
                result = num1 * num2;
                break;
            case "/":
                if(num2 == 0){
                    return "Math Error";
                }else {
                    result = num1 / num2;
                    break;
                }
            default:
                result = num1+num2;
                break;
        }
        System.out.println(String.valueOf(result));
        return String.valueOf(result);
    }

    @GetMapping("/Change")
    public String onlyOneChange (@RequestParam  String number ,@RequestParam String action){
        double result=0;
        double Number = Double.parseDouble(number);
        switch (action){
            case "root" :
                if(Number<0){
                    return "Math Error";
                }
                result = Math.sqrt(Number);
                break;
            case "overOne" :
                result = 1/Number;
                break;
            case "powerTwo" :
                result = Number*Number;
                break;
            default:
                if(Number<0){
                    return "Math Error";
                }
                result = Number / 100 ;
                break;
        }
        System.out.println(String.valueOf(result));
        return String.valueOf(result);
    }


}


