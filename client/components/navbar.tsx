import Link from "next/link";
import styles from "../styles/Navbar.module.css";

export type NavbarLink = {
  url: string;
  text: string;
};

type NavbarProps = {
  links: NavbarLink[];
};

export default function Navbar({ links }: NavbarProps): JSX.Element {
  return (
    <div>
      <nav className={styles.navbar}>
        {links.map((link) => (
          <Link key={link.url} href={link.url}>
            <a>{link.text}</a>
          </Link>
        ))}
      </nav>
    </div>
  );
}
