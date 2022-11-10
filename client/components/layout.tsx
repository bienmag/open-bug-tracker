import useSWR from "swr";
import Navbar, { NavbarLink } from "./navbar";

type LayoutProps = {
  links: NavbarLink[];
  children: React.ReactNode | React.ReactNode[];
};

export default function Layout({ children, links }: LayoutProps) {
  const { data, error } = useSWR("/api/navigation", fetch);

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <Navbar links={links} />
      <main>{children}</main>
    </div>
  );
}
