import { MapPin, Phone, Instagram, Twitter, Facebook } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function Footer() {
    return (
        <footer className="border-t border-[#e6e0db] bg-[#f2ede8] px-4 pb-8 pt-16 md:px-10">
            <div className="container mx-auto mb-16 grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
                <div className="flex flex-col gap-6">
                    <Link href="/" className="flex items-center gap-3">
                        <Image
                            src="/images/cofenowa/android-chrome-192x192.png"
                            alt="NOWA CAFE Logo"
                            width={32}
                            height={32}
                            className="h-8 w-8 rounded-lg"
                        />
                        <h3 className="text-xl font-black">NOWA CAFE</h3>
                    </Link>
                    <p className="text-sm leading-relaxed text-[#8a7560]">
                        Your urban sanctuary for artisanal coffee and community connection.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#f27f0d] shadow-sm transition-transform hover:scale-110">
                            <Instagram className="h-5 w-5" />
                        </a>
                        <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#f27f0d] shadow-sm transition-transform hover:scale-110">
                            <Twitter className="h-5 w-5" />
                        </a>
                        <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#f27f0d] shadow-sm transition-transform hover:scale-110">
                            <Facebook className="h-5 w-5" />
                        </a>
                    </div>
                </div>

                <div>
                    <h4 className="mb-6 font-bold">Quick Links</h4>
                    <ul className="flex flex-col gap-4 text-sm font-medium text-[#8a7560]">
                        <li>
                            <Link href="/menu" className="transition-colors hover:text-[#f27f0d]">Our Menu</Link>
                        </li>
                        <li>
                            <Link href="/about" className="transition-colors hover:text-[#f27f0d]">About Us</Link>
                        </li>
                        <li>
                            <Link href="/gallery" className="transition-colors hover:text-[#f27f0d]">Gallery</Link>
                        </li>
                        <li>
                            <Link href="/contact" className="transition-colors hover:text-[#f27f0d]">Contact</Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 className="mb-6 font-bold">Store Hours</h4>
                    <ul className="flex flex-col gap-4 text-sm font-medium text-[#8a7560]">
                        <li className="flex justify-between">
                            <span>Mon - Fri</span> <span>7:00am - 6:00pm</span>
                        </li>
                        <li className="flex justify-between">
                            <span>Saturday</span> <span>8:00am - 7:00pm</span>
                        </li>
                        <li className="flex justify-between">
                            <span>Sunday</span> <span>8:00am - 5:00pm</span>
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 className="mb-6 font-bold">Find Us</h4>
                    <div className="space-y-4 text-sm font-medium text-[#8a7560]">
                        <p className="flex items-start gap-2">
                            <MapPin className="h-5 w-5 text-[#f27f0d]" />
                            123 Roast Lane, Coffee District
                            <br />
                            Portland, OR 97201
                        </p>
                        <p className="flex items-center gap-2">
                            <Phone className="h-5 w-5 text-[#f27f0d]" />
                            (503) 555-0123
                        </p>
                        <div className="mt-4 h-32 w-full overflow-hidden rounded-lg">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15456.3262446754!2d121.0189736!3d14.4225339!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397d1e8e58350b9%3A0xe75853f064883e60!2sNowa%20Cafe!5e0!3m2!1sen!2sph!4v1707819123456!5m2!1sen!2sph"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen={true}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="grayscale opacity-70"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-[#e6e0db] pt-8 md:flex-row">
                <p className="text-xs text-[#8a7560]">
                    © 2024 NOWA CAFE. All rights reserved.
                </p>
                <div className="flex gap-8 text-xs font-medium text-[#8a7560]">
                    <a href="#" className="hover:text-[#181411]">
                        Privacy Policy
                    </a>
                    <a href="#" className="hover:text-[#181411]">
                        Terms of Service
                    </a>
                </div>
            </div>
        </footer>
    )
}
