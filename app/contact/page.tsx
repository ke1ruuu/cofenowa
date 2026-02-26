"use client"

import Header from "@/components/home/Header"
import Footer from "@/components/home/Footer"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Mail, Phone, MapPin, Send, Instagram, Twitter, Facebook, CheckCircle, Loader2 } from "lucide-react"
import { submitFeedback } from "./actions"
import { useState } from "react"

export default function ContactPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [success, setSuccess] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)
        setError(null)
        setSuccess(null)

        const formData = new FormData(event.currentTarget)
        const result = await submitFeedback(formData)

        setIsLoading(false)
        if (result.error) {
            setError(result.error)
        } else {
            setSuccess(result.message || "Message sent successfully!")
            event.currentTarget.reset()
        }
    }

    return (
        <div className="min-h-screen bg-[#f8f7f5] text-[#181411]">
            <Header />

            <main>
                {/* Simple Header */}
                <section className="bg-white px-4 py-20 text-center md:px-10">
                    <div className="container mx-auto max-w-7xl">
                        <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#f27f0d] transition-transform hover:-translate-x-1">
                            <ArrowLeft className="h-4 w-4" /> Back to Home
                        </Link>
                        <h1 className="text-5xl font-black md:text-7xl">Get in <span className="text-[#f27f0d]">Touch</span></h1>
                        <p className="mx-auto mt-6 max-w-2xl text-lg text-[#8a7560]">
                            Whether you have a question about our beans, want to book our space, or just want to say hi, we'd love to hear from you.
                        </p>
                    </div>
                </section>

                <section className="px-4 pb-24 md:px-10">
                    <div className="container mx-auto max-w-7xl">
                        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                            {/* Contact Form */}
                            <div className="rounded-[2.5rem] bg-white p-8 shadow-xl md:p-12">
                                <h2 className="mb-8 text-3xl font-black">Send us a Message</h2>
                                
                                {success ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in">
                                        <div className="h-20 w-20 rounded-full bg-green-50 flex items-center justify-center mb-6">
                                            <CheckCircle className="h-10 w-10 text-green-500" />
                                        </div>
                                        <h3 className="text-2xl font-black mb-2">Message Sent!</h3>
                                        <p className="text-[#8a7560] max-w-xs">{success}</p>
                                        <Button 
                                            onClick={() => setSuccess(null)}
                                            variant="outline" 
                                            className="mt-8 rounded-xl font-bold border-[#e6e0db]"
                                        >
                                            Send Another Message
                                        </Button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {error && (
                                            <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold">
                                                {error}
                                            </div>
                                        )}
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold uppercase tracking-wider text-[#8a7560]">Full Name</label>
                                                <Input name="full_name" required placeholder="John Doe" className="border-[#e6e0db] bg-[#f8f7f5] h-12 rounded-xl focus-visible:ring-[#f27f0d]" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold uppercase tracking-wider text-[#8a7560]">Email Address</label>
                                                <Input name="email" type="email" required placeholder="john@example.com" className="border-[#e6e0db] bg-[#f8f7f5] h-12 rounded-xl focus-visible:ring-[#f27f0d]" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold uppercase tracking-wider text-[#8a7560]">Subject</label>
                                            <Input name="subject" placeholder="Inquiry about..." className="border-[#e6e0db] bg-[#f8f7f5] h-12 rounded-xl focus-visible:ring-[#f27f0d]" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold uppercase tracking-wider text-[#8a7560]">Message</label>
                                            <textarea
                                                name="message"
                                                required
                                                className="min-h-[150px] w-full rounded-2xl border border-[#e6e0db] bg-[#f8f7f5] p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#f27f0d] transition-all"
                                                placeholder="How can we help you?"
                                            ></textarea>
                                        </div>
                                        <Button disabled={isLoading} className="h-14 w-full bg-[#f27f0d] text-lg font-bold hover:bg-[#f27f0d]/90 rounded-2xl shadow-lg shadow-[#f27f0d]/20 transition-all active:scale-[0.98]">
                                            {isLoading ? (
                                                <Loader2 className="h-6 w-6 animate-spin" />
                                            ) : (
                                                <>Send Message <Send className="ml-2 h-5 w-5" /></>
                                            )}
                                        </Button>
                                    </form>
                                )}
                            </div>

                            {/* Contact Info & Map */}
                            <div className="flex flex-col gap-8">
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div className="rounded-3xl bg-[#181411] p-8 text-white">
                                        <Mail className="mb-4 h-8 w-8 text-[#f27f0d]" />
                                        <h3 className="mb-2 font-bold">Email Us</h3>
                                        <p className="text-white/60">hello@nowacafe.com</p>
                                    </div>
                                    <div className="rounded-3xl bg-[#f27f0d] p-8 text-white">
                                        <Phone className="mb-4 h-8 w-8 text-white" />
                                        <h3 className="mb-2 font-bold">Call Us</h3>
                                        <p className="text-white/90">(503) 555-0123</p>
                                    </div>
                                </div>

                                <div className="flex-1 rounded-[2.5rem] bg-[#f2ede8] p-8">
                                    <div className="mb-6 flex items-start gap-4">
                                        <MapPin className="h-6 w-6 shrink-0 text-[#f27f0d]" />
                                        <div>
                                            <h3 className="font-bold">Visit the Sanctuary</h3>
                                            <p className="text-[#8a7560]">123 Roast Lane, Coffee District, Portland, OR 97201</p>
                                        </div>
                                    </div>
                                    <div className="h-[300px] w-full overflow-hidden rounded-2xl">
                                        <iframe
                                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15456.3262446754!2d121.0189736!3d14.4225339!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397d1e8e58350b9%3A0xe75853f064883e60!2sNowa%20Cafe!5e0!3m2!1sen!2sph!4v1707819123456!5m2!1sen!2sph"
                                            width="100%"
                                            height="100%"
                                            style={{ border: 0 }}
                                            allowFullScreen={true}
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                        ></iframe>
                                    </div>

                                    <div className="mt-8 flex justify-center gap-6">
                                        <a href="#" className="h-12 w-12 flex items-center justify-center rounded-full bg-white text-[#f27f0d] shadow-md transition-transform hover:scale-110">
                                            <Instagram className="h-6 w-6" />
                                        </a>
                                        <a href="#" className="h-12 w-12 flex items-center justify-center rounded-full bg-white text-[#f27f0d] shadow-md transition-transform hover:scale-110">
                                            <Twitter className="h-6 w-6" />
                                        </a>
                                        <a href="#" className="h-12 w-12 flex items-center justify-center rounded-full bg-white text-[#f27f0d] shadow-md transition-transform hover:scale-110">
                                            <Facebook className="h-6 w-6" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
