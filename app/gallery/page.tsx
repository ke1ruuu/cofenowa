"use client"

import Header from "@/components/home/Header"
import Footer from "@/components/home/Footer"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Maximize2, Instagram, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const GALLERY_IMAGES = [
    { src: "/images/image1.jpg", alt: "NOWA CAFE Neon", aspect: "aspect-[4/5]" },
    { src: "/images/image2.jpg", alt: "Cafe Community", aspect: "aspect-[16/10]" },
    { src: "/images/image3.jpg", alt: "Outdoor Ambiance", aspect: "aspect-[4/3]" },
    { src: "/images/image4.jpg", alt: "Signature Duo", aspect: "aspect-square" },
    { src: "/images/image5.jpg", alt: "Barista Skills", aspect: "aspect-[4/5]" },
    { src: "/images/image6.jpg", alt: "Morning Brew", aspect: "aspect-[3/4]" },
    { src: "/images/image7.jpg", alt: "Cozy Interior", aspect: "aspect-[4/5]" },
    { src: "/images/image8.jpg", alt: "Coffee Bloom", aspect: "aspect-[3/4]" },
    { src: "/images/image9.jpg", alt: "Latte Art", aspect: "aspect-[4/5]" },
    { src: "/images/image10.jpg", alt: "Urban Sanctuary", aspect: "aspect-[3/4]" },
    { src: "/images/image11.jpg", alt: "Evening Glow", aspect: "aspect-[4/5]" },
    { src: "/images/image12.jpg", alt: "Our Story", aspect: "aspect-[3/4]" },
    { src: "/images/image13.jpg", alt: "Vibrant Space", aspect: "aspect-[4/5]" },
    { src: "/images/image14.jpg", alt: "Craftsmanship", aspect: "aspect-[3/4]" },
    { src: "/images/image15.jpg", alt: "Daily Ritual", aspect: "aspect-[4/5]" },
]

export default function GalleryPage() {
    return (
        <div className="min-h-screen bg-[#f8f7f5] text-[#181411]">
            <Header />

            <main className="container mx-auto max-w-7xl px-4 py-12 md:px-10">
                {/* Header Section */}
                <div className="mb-12">
                    <Link href="/" className="mb-6 flex items-center gap-2 text-sm font-bold text-[#f27f0d] transition-transform hover:-translate-x-1">
                        <ArrowLeft className="h-4 w-4" /> Back to Home
                    </Link>
                    <div className="flex flex-col items-center text-center">
                        <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#f27f0d]">The Visual Story</span>
                        <h1 className="mt-4 text-5xl font-black md:text-7xl">Corner of <span className="italic text-[#f27f0d]">NOWA</span></h1>
                        <p className="mt-6 max-w-2xl text-lg text-[#8a7560]">
                            A curated collection of moments, artistry, and the vibrant life within our walls.
                            Explore the textures and tones that make NOWA CAFE unique.
                        </p>
                    </div>
                </div>

                {/* Pinterest Masonry Layout */}
                <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4">
                    {GALLERY_IMAGES.map((img, i) => (
                        <div
                            key={i}
                            className="group relative mb-6 break-inside-avoid overflow-hidden rounded-3xl bg-neutral-200 transition-all duration-500 hover:shadow-2xl"
                        >
                            <div className={`relative w-full ${img.aspect}`}>
                                <Image
                                    src={img.src}
                                    alt={img.alt}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>

                            {/* Overlay with Pinterest-style actions */}
                            <div className="absolute inset-0 flex flex-col justify-between bg-black/40 p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                <div className="flex justify-end gap-2">
                                    <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-colors hover:bg-white/40">
                                        <Share2 className="h-5 w-5" />
                                    </button>
                                    <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black transition-colors hover:bg-[#f27f0d] hover:text-white">
                                        <Maximize2 className="h-5 w-5" />
                                    </button>
                                </div>

                                <div>
                                    <p className="text-sm font-bold tracking-wider text-white/80">{img.alt}</p>
                                    <div className="mt-2 flex items-center gap-2">
                                        <div className="h-6 w-6 rounded-full bg-[#f27f0d] flex items-center justify-center">
                                            <Instagram className="h-3 w-3 text-white" />
                                        </div>
                                        <span className="text-xs font-medium text-white">@nowacafe</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Call to Action */}
                <div className="mt-24 rounded-[3rem] bg-[#181411] px-8 py-16 text-center text-white">
                    <h2 className="text-3xl font-black md:text-5xl">Share Your #NOWAMoment</h2>
                    <p className="mx-auto mt-6 max-w-xl text-lg text-white/60">
                        Tag us in your photos for a chance to be featured in our gallery and receive
                        exclusive offers from our baristas.
                    </p>
                    <div className="mt-10 flex flex-wrap justify-center gap-4">
                        <Button size="lg" className="h-14 bg-[#f27f0d] px-10 text-lg font-bold hover:bg-[#f27f0d]/90">
                            Follow Us on Instagram
                        </Button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
