'use client'
import Image from "next/image";
import styles from "./page.module.css";
import SignIn from "./SignIn/signin";
import { setFormulas } from "./firebase/functions";
export default function Home() {
  let num:string[] = [];

  for (let i = 1; i <= 10; i++) {
      num.push("O");
      num.push(i.toString());
      num.push(i.toString());
      num.push("1");
      num.push("10");
      num.push("R");
      num.push(i.toString());
      num.push(i.toString());
      num.push("1");
      num.push("3");
      num.push("R");
      num.push(i.toString());
      num.push(i.toString());
      num.push("4");
      num.push("6");
      num.push("R");
      num.push(i.toString());
      num.push(i.toString());
      num.push("7");
      num.push("10");
      num.push("R");
      num.push(i.toString());
      num.push(i.toString());
      num.push("1");
      num.push("10");
  }
  num.push("R");
  num.push("1");
  num.push("10");
  num.push("1");
  num.push("10");


  const onClickButton=()=>{
      setFormulas("104",num)
  }
  return (
    <main>
      <button onClick={onClickButton}>hello</button>
      <SignIn/>
    </main>
  )
}
