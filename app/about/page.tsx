"use client"

import Header from "@/components/home/Header"
import Footer from "@/components/home/Footer"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Coffee, Users, Leaf, Heart } from "lucide-react"
import { useRef } from "react"

export default function AboutPage() {
    const scrollRef = useRef<HTMLDivElement>(null)
    return (
        <div className="min-h-screen bg-[#f8f7f5] text-[#181411]">
            <Header />

            <main>
                {/* Hero Section */}
                <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
                    <Image
                        src="/images/image12.jpg"
                        alt="NOWA CAFE Interior"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="container relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white md:px-10">
                        <Link href="/" className="mb-6 flex items-center gap-2 text-sm font-bold text-[#f27f0d] transition-transform hover:-translate-x-1">
                            <ArrowLeft className="h-4 w-4" /> Back to Home
                        </Link>
                        <h1 className="text-5xl font-black md:text-7xl">Our <span className="italic text-[#f27f0d]">Journey</span></h1>
                        <p className="mt-6 max-w-2xl text-lg text-white/80 md:text-xl">
                            From a single dream to your daily ritual. Discover the passion behind every bean at NOWA CAFE.
                        </p>
                    </div>
                </section>

                {/* Horizontal Timeline Section */}
                <section className="bg-white px-4 py-24 md:px-10 overflow-hidden">
                    <div className="container mx-auto max-w-7xl">
                        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end mb-16">
                            <div>
                                <span className="text-sm font-bold uppercase tracking-widest text-[#f27f0d]">Our Story</span>
                                <h2 className="mt-4 text-4xl font-black md:text-5xl">The Journey of <span className="text-[#f27f0d]">NOWA</span></h2>
                            </div>

                            {/* Navigation Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        if (scrollRef.current) scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
                                    }}
                                    className="flex h-12 w-12 items-center justify-center rounded-full border border-[#e6e0db] bg-white transition-all hover:bg-[#181411] hover:text-white"
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => {
                                        if (scrollRef.current) scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
                                    }}
                                    className="flex h-12 w-12 items-center justify-center rounded-full border border-[#e6e0db] bg-white transition-all hover:bg-[#181411] hover:text-white"
                                >
                                    <ArrowLeft className="h-5 w-5 rotate-180" />
                                </button>
                            </div>
                        </div>

                        <div className="relative group/timeline">
                            {/* Gradient Fades for Scroll Indication */}
                            <div className="pointer-events-none absolute left-0 top-0 z-20 h-full w-24 bg-gradient-to-r from-white to-transparent opacity-0 transition-opacity group-hover/timeline:opacity-100" />
                            <div className="pointer-events-none absolute right-0 top-0 z-20 h-full w-32 bg-gradient-to-l from-white to-transparent" />

                            <div
                                id="timeline-scroll"
                                ref={scrollRef} // Added ref
                                className="flex overflow-x-auto pb-12 pt-4 no-scrollbar scroll-smooth cursor-grab active:cursor-grabbing"
                                onWheel={(e) => {
                                    if (e.deltaY !== 0) {
                                        e.preventDefault(); // Prevent vertical page scroll
                                        e.currentTarget.scrollLeft += e.deltaY;
                                    }
                                }}
                            >
                                <div className="relative flex min-w-max gap-4 px-4">
                                    {/* Continuous Timeline Track */}
                                    <div className="absolute top-[84px] left-0 h-[2px] w-full bg-[#f2ede8]" />

                                    {[
                                        { year: "2018", title: "The Dream", desc: "Our founders traveled to coffee regions in Ethiopia and Colombia to find the perfect beans.", icon: "🌍" },
                                        { year: "2019", title: "First Brew", desc: "We opened our small 10-seat corner shop in Portland, introducing Spanish Lattes to the neighborhood.", icon: "☕" },
                                        { year: "2021", title: "Expanding Flavors", desc: "Introduced our signature in-house bakery, pairing fresh pastries with specialty roasts.", icon: "🥐" },
                                        { year: "2023", title: "Green Label", desc: "Officially certified for 100% direct-trade sourcing, ensuring every farmer gets a fair share.", icon: "🌿" },
                                        { year: "2024", title: "Modern Ritual", desc: "Launched our digital order experience while maintaining the soul of traditional brewing.", icon: "✨" },
                                    ].map((event, i) => (
                                        <div key={i} className="group relative flex w-[300px] flex-col px-4">
                                            {/* Year & Circle */}
                                            <div className="mb-6 flex flex-col items-center">
                                                <span className="mb-2 text-2xl font-black text-[#f27f0d] transition-transform group-hover:scale-110">{event.year}</span>
                                                <div className="z-10 flex h-6 w-6 items-center justify-center rounded-full border-4 border-white bg-[#f27f0d] shadow-md outline outline-2 outline-[#f2ede8] transition-all group-hover:scale-125" />
                                            </div>

                                            {/* Card content */}
                                            <div className="rounded-3xl border border-[#e6e0db] bg-[#f8f7f5] p-8 transition-all hover:-translate-y-2 hover:shadow-xl">
                                                <div className="mb-4 text-3xl">{event.icon}</div>
                                                <h3 className="mb-3 text-xl font-bold">{event.title}</h3>
                                                <p className="text-sm leading-relaxed text-[#8a7560]">
                                                    {event.desc}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    {/* Final Buffer */}
                                    <div className="w-24" /> {/* Changed from w-12 to w-24 */}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="bg-[#181411] px-4 py-24 text-white md:px-10">
                    <div className="container mx-auto max-w-7xl">
                        <div className="mb-16 text-center">
                            <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#f27f0d]">Our Philosophy</span>
                            <h2 className="mt-4 text-4xl font-black md:text-5xl">What We Stand For</h2>
                        </div>
                        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
                            {[
                                { icon: <Coffee className="h-8 w-8" />, title: "Artisan Quality", desc: "Every cup is a masterpiece, brewed with precision and passion." },
                                { icon: <Leaf className="h-8 w-8" />, title: "Sustainably Sourced", desc: "We partner directly with farmers to ensure ethical and organic practices." },
                                { icon: <Users className="h-8 w-8" />, title: "Community Hub", desc: "A place for connection, conversation, and shared moments." },
                                { icon: <Heart className="h-8 w-8" />, title: "Made with Love", desc: "Our baristas are artists who care about your perfect morning ritual." },
                            ].map((value, i) => (
                                <div key={i} className="flex flex-col items-center text-center">
                                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f27f0d] text-white">
                                        {value.icon}
                                    </div>
                                    <h3 className="mb-4 text-xl font-bold">{value.title}</h3>
                                    <p className="text-white/60">{value.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Vision Section */}
                <section className="px-4 py-24 md:px-10">
                    <div className="container mx-auto max-w-5xl">
                        <div className="flex flex-col gap-16 lg:flex-row-reverse lg:items-center">
                            <div className="lg:w-1/2">
                                <span className="text-sm font-bold uppercase tracking-widest text-[#f27f0d]">The Future</span>
                                <h2 className="mt-4 text-4xl font-black md:text-5xl">Expanding Our Brew</h2>
                                <p className="mt-8 text-lg leading-relaxed text-[#8a7560]">
                                    As we look to the future, our goal remains the same: to be the heartbeat of our neighborhood. We are constantly experimenting with new flavor profiles and brewing techniques to elevate your coffee experience.
                                </p>
                                <div className="mt-10">
                                    <Link href="/menu">
                                        <button className="h-14 rounded-full bg-[#f27f0d] px-10 text-lg font-bold text-white transition-all hover:scale-105 hover:bg-[#f27f0d]/90">
                                            Explore Our Menu
                                        </button>
                                    </Link>
                                </div>
                            </div>
                            <div className="relative aspect-[4/5] overflow-hidden rounded-[3rem] shadow-2xl lg:w-1/2">
                                <Image
                                    src="/images/image15.jpg"
                                    alt="NOWA CAFE Experience"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
