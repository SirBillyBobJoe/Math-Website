import Image from "next/image";
import styles from "./page.module.css";
import SignIn from "./SignIn/signin";

export default function Home() {
  return (
    <main>
      <SignIn/>
    </main>
  )
}
