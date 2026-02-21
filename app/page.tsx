import Header from "@/components/home/Header"
import Hero from "@/components/home/Hero"
import Menu from "@/components/home/Menu"
import About from "@/components/home/About"
import Gallery from "@/components/home/Gallery"
import Newsletter from "@/components/home/Newsletter"
import Footer from "@/components/home/Footer"

export default function HomePage() {
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