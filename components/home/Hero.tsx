import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Hero() {
    return (
        <section className="relative px-4 py-8 md:px-10 md:py-12">
            <div className="container mx-auto max-w-7xl">
                <div
                    className="relative flex min-h-[520px] items-center justify-center overflow-hidden rounded-xl bg-cover bg-center p-6 text-center"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url('/images/image3.jpg')",
                    }}
                >
                    <div className="flex max-w-2xl flex-col items-center gap-6">
                        <h1 className="text-5xl font-black leading-tight tracking-tight text-white md:text-7xl">
                            Where Every Sip <br />
                            <span className="text-[#f27f0d]">Tells a Story</span>
                        </h1>
                        <p className="max-w-lg text-lg font-medium text-white/90 md:text-xl">
                            Escape to your cozy urban sanctuary. Experience the perfect blend of
                            artisanal coffee and a warm atmosphere at NOWA CAFE.
                        </p>
                        <div className="mt-4 flex flex-wrap justify-center gap-4">
                            <Link href="/menu">
                                <Button
                                    size="lg"
                                    className="bg-[#f27f0d] text-lg font-bold hover:scale-105 hover:bg-[#f27f0d]/90"
                                >
                                    View Menu
                                </Button>
                            </Link>
                            <Link href="/about">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-white/30 bg-white/20 text-lg font-bold text-white backdrop-blur-md hover:bg-white/30 hover:text-white"
                                >
                                    Our Story
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
