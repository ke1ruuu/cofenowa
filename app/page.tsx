import Header from "@/components/home/Header"
import Hero from "@/components/home/Hero"
import Menu from "@/components/home/Menu"
import About from "@/components/home/About"
import Gallery from "@/components/home/Gallery"
import Newsletter from "@/components/home/Newsletter"
import Footer from "@/components/home/Footer"

import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle()

    if (profile?.role?.toLowerCase() === "admin") {
      redirect("/admin")
    } else {
      redirect("/home")
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f7f5] text-[#181411]">
      <Header />
      <main>
        <Hero />
        <Menu />
        <About />
        <Gallery />
        <Newsletter />
      </main>
      <Footer />
    </div>
  )
}