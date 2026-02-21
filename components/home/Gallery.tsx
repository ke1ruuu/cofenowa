import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const galleryImages = [
    { src: "/images/image1.jpg", alt: "NOWA CAFE Neon Sign" },
    { src: "/images/image2.jpg", alt: "Community at NOWA CAFE" },
    { src: "/images/image3.jpg", alt: "Cozy Outdoor Seating" },
    { src: "/images/image4.jpg", alt: "Signature Iced Beverages" },
]

export default function Gallery() {
    return (
        <section
            className="px-4 py-20 md:px-10"
            id="gallery"
        >
            <div className="container mx-auto max-w-7xl">
                <div className="mb-12 text-center">
                    <span className="text-sm font-bold uppercase tracking-widest text-[#f27f0d]">
                        Our Space
                    </span>
                    <h2 className="mt-2 text-4xl font-black md:text-5xl">
                        Captured Moments
                    </h2>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {galleryImages.map((img, i) => (
                        <div key={i} className="group relative aspect-square overflow-hidden rounded-2xl">
                            <Image
                                src={img.src}
                                alt={img.alt}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                <p className="text-sm font-bold text-white">{img.alt}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-16 flex justify-center">
                    <Link href="/gallery">
                        <Button variant="outline" size="lg" className="h-14 rounded-full border-2 border-[#181411] px-10 text-lg font-bold text-[#181411] transition-all hover:bg-[#181411] hover:text-white">
                            View Full Gallery
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}
