import { GitBranch, GitCommit, Github, Globe } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="p-6 flex justify-center items-center font-bold">
      Developed by <Link href={"https://bio.link/devashishroy"} className="text-blue-500 flex" target="_blank"> <Globe className="mx-2" /> Devashish Roy</Link>
    </footer>
  );
}