import { TextAttribute } from '@angular/compiler/src/render3/r3_ast';
import { Component } from '@angular/core';
import {HttpClient, HttpClientModule} from '@angular/common/http'
//import { Action } from 'rxjs/internal/scheduler/Action';
//import { strictEqual } from 'assert';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'calculator1';
  
  constructor (private http:HttpClient){}

  // intialize variables
  singleflag:number=0;
  expression: string="";
  output: any;
  Num1:string="";
  operator : string="";
  Num2:string="";
  flag: number =0;
  Added:string="";
  what:string=""

  //get request functions
  Send(Num1:string , operator:string , Num2:string){
    this.http.get('http://localhost:8081/calculator/exp',{
      responseType:'text',
      params:{
        number1:Num1,
        op:operator,
        number2:Num2
      },
      observe:'response'
    }).subscribe(response=>{
      this.output = response.body
      if(this.flag==1){
        console.log(this.output)
        this.expression = this.output+this.Added
        console.log(this.expression)
        this.flag=0
        this.Added=""
      }else if(this.singleflag=1){
        console.log(this.output)
        this.expression=this.output
        console.log(this.output)
        this.singleflag=0;
        this.Action(this.what)
    }else{
      console.log(this.output)
      console.log(this.output)
        this.expression = this.output
      }   
    })
  }

  // functions to show the expression on the screen Screen and remove
  Screen(x: string) {
    if(x=="-" || x=="+" || x=="/" || x=="*"){
      this.Prepare(this.expression)
      if(this.Num1=="" || this.operator=="" || this.Num2==""){
        this.expression = this.expression+x;
      }else{
        this.flag=1;
        this.Added=x;
        this.Send(this.Num1,this.operator,this.Num2)
        //this.expression=this.expression+x
      }
    }else{
      this.expression = this.expression+x;
    }
}

// deleting function
  Remove(x:string){
    if (x == 'C' || x =='CE'){
      this.expression= "";
    }
    else{
      this.expression= this.expression.slice(0,-1);
    }
  }
  

  Negativehandle(exp:string , x:string ){
    let cont =0;
    for(let i=0 ; i<exp.length ; i++){
      if(exp.charAt(i)==x){
          cont++;
      }
    }

    return cont;
  }
  
  //check the validity of expresion
  ValidCheck(exp:string){
    let addoperatoers:number=0;
    let subopperators:number=0;
    let multopperators:number=0;
    let divopperators :number=0;
    let ledingsub :number=0;
    if(exp.startsWith("--")){
      return false;
    }
    for(let i=0 ; i<exp.length;i++){
      if(exp.charAt(i)=="+"){
        if(exp.charAt(i+1)=="+" || exp.charAt(i+1)=="*" || exp.charAt(i+1)=="/" ){
          return false;
        }
        addoperatoers++;
      }else if (exp.charAt(i)=="-"){
        if(exp.charAt(i+1)=="+" || exp.charAt(i+1)=="*" || exp.charAt(i+1)=="/" ){
          return false;
        }
        subopperators++;
        
        while(exp.charAt(i)=="-"){
          ledingsub++;
          i++;
        }
        if(ledingsub>2){
          return false;
        }else{
          ledingsub=0;
        }
      }else if(exp.charAt(i)=="*"){
        if(exp.charAt(i+1)=="+" || exp.charAt(i+1)=="*" || exp.charAt(i+1)=="/" ){
          return false;
        }
        multopperators++;
      }else if(exp.charAt(i)=="/"){
        if(exp.charAt(i+1)=="+" || exp.charAt(i+1)=="*" || exp.charAt(i+1)=="/" ){
          return false;
        }
        divopperators++;
      }


      if(addoperatoers>1 || subopperators>3 || multopperators>1 || divopperators>1){
        return false;
      }
    }
    return true;
  }

  // function to slice the expression into first number operator and second number
  Prepare(expression: string){
    let findOp:number=0;
    console.log(expression)
    if(expression.includes("+")){
      findOp=expression.indexOf("+");
    }else if(expression.includes("*")){
      findOp=expression.indexOf("*");
    }else if(expression.includes("/")) {
      findOp=expression.indexOf("/");
    }else if (expression.includes("-")){
      let howmuch=this.Negativehandle(expression,"-");
      if(howmuch==1 || (howmuch==2 && !(expression.charAt(0)=="-"))){
        findOp=expression.indexOf("-");
      }else if(howmuch==2 && expression.charAt(0)=="-"){
        findOp=expression.lastIndexOf("-");
      }else{
        let lastmins = expression.lastIndexOf("-");
        findOp=lastmins-1;
        console.log(lastmins)
        console.log(findOp)
      }
     
    }
    this.Num1 = expression.slice(0,findOp);
    console.log(this.Num1)
    this.operator = expression.charAt(findOp);
    console.log(this.operator)
    this.Num2 = expression.slice(findOp+1,expression.length);
    console.log(this.Num2)
   
    
  }

  Dots(Num1:string,Num2:string){
    let firstNumOfDots:number=0;
    let secondNumOfDots :number=0;
    for(let i=0 ; i<this.Num1.length ; i++){
      if(Num1.charAt(i)=="."){
          firstNumOfDots++;
      }
    }

    for(let i=0 ; i<this.Num1.length ; i++){
      if(Num2.charAt(i)=="."){
          secondNumOfDots++;
      }
    }

    if(firstNumOfDots>1 || secondNumOfDots>1){
      return false;
    }else{
      return true;
    }
  }
  
  // get request to calculate % or power 2 or 1/x or root
  SingleChange(value:string , act:string){
    this.http.get('http://localhost:8081/calculator/Change',{
      responseType:'text',
      params:{
        number:value,
        action:act
      },
      observe:'response'
    }).subscribe(response=>{
      this.output = response.body
      this.expression=this.output
    })
  }

 // calculate equation 
  eval(){
     // split the expression to number , operator and number 
     console.log(this.expression)
    this.Prepare(this.expression)  
    console.log(this.Num1)
    console.log(this.operator)
    console.log(this.Num2)
    if(!(this.Num1=="") &&  !(this.operator=="") && !(this.Num2=="")){
      // check the validity of the expression and the Dots problems
      if(this.ValidCheck(this.expression) && this.Dots(this.Num1,this.Num2)){   
        this.Send(this.Num1,this.operator,this.Num2)
      }else{
        this.expression="Expression Error"
      }
    }
  }

  //make a single action 
  Action(x:string){
    this.Prepare(this.expression)
      if(!(this.Num1=="") &&  !(this.operator=="") && !(this.Num2=="")){
        this.singleflag=1;
        this.what=x
        this.Send(this.Num1,this.operator,this.Num2)
      }
    
    switch(x){
      case "%":
        this.SingleChange(this.expression,"percentege")
        break
      case "over":
        this.SingleChange(this.expression,"overOne")
        break 
      case "power":
          this.SingleChange(this.expression,"powerTwo")
          break 
      case "root":
          this.SingleChange(this.expression,"root")
          break;
      default:
        break;
    }
  }

  Viceverse(){
    let char : string="-"
    let findop : number=0
    let howmuch :number=0
    if((!this.expression.includes("+"))&&(!this.expression.includes("/"))&&(!this.expression.includes("-"))&&(!this.expression.includes("*"))){
        this.expression=char+this.expression
    }else{
      if(this.expression.includes("+") || this.expression.includes("/") || this.expression.includes("*")){
        if(this.expression.includes("+")){
          findop=this.expression.indexOf("+")
        }else if(this.expression.includes("*")){
          findop=this.expression.indexOf("*")
        }else{
          findop=this.expression.indexOf("/")
        }
  
        if (this.expression.charAt(findop+1)=="-"){
          this.expression=this.expression.slice(0,findop+1)+this.expression.slice(findop+2,this.expression.length)
        }else{
          this.expression=this.expression.slice(0,findop+1)+char+this.expression.slice(findop+1,this.expression.length)
        }
  
      }else if(this.expression.includes("-")){
        howmuch=this.Negativehandle(this.expression,"-")
        if(howmuch==1){
          if(this.expression.charAt(0)=="-"){
            this.expression=this.expression.slice(1,this.expression.length)
          }else{
            findop=this.expression.indexOf("-")
            this.expression=this.expression.slice(0,findop)+"+"+this.expression.slice(findop+1,this.expression.length)
          }
          
        }else if(howmuch==2){
          if(!(this.expression.charAt(0)=="-")){
            findop=this.expression.indexOf("-")
            this.expression=this.expression.slice(0,findop)+this.expression.slice(findop+1,this.expression.length)
          }else{
            findop=this.expression.lastIndexOf("-")
            this.expression=this.expression.slice(0,findop)+"+"+this.expression.slice(findop+1,this.expression.length)
          }
         
        }else{
          findop=this.expression.lastIndexOf("-")
          this.expression=this.expression.slice(0,findop)+this.expression.slice(findop+1,this.expression.length)
          }
       }
    }
  }
}




