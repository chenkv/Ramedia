import Link from "next/link";
import styles from "../styles/Navbar.module.css";

export default function Navbar() {
    return (
        <div className="flex">
            <div className="h-14" id={styles.logo} >
                Image
            </div>
            <div className="grow" id={styles.test}>
                Test
            </div>
        </div>
    )
}