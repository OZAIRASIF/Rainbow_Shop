import { redirect } from "next/navigation";

export default function Home() {
  // Middleware already handles redirect based on login status
  // So just redirect to login as default
  redirect("/login");
}
