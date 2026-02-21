import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Coffee } from "lucide-react"

export default function Newsletter() {
    return (
        <section className="px-4 py-20 md:px-10" id="contact">
            <div className="container relative mx-auto flex max-w-5xl flex-col items-center justify-between gap-10 overflow-hidden rounded-3xl bg-[#f27f0d] p-8 text-white md:flex-row md:p-16">
                <div className="absolute right-0 top-0 opacity-10">
                    < Coffee className="h-[200px] w-[200px]" />
                </div>
                <div className="relative z-10 flex-1">
                    <h2 className="mb-4 text-3xl font-black md:text-4xl">
                        Join the Brew Club
                    </h2>
                    <p className="text-lg font-medium text-white/80">
                        Subscribe to get exclusive offers, seasonal menu updates, and
                        brewing tips.
                    </p>
                </div>
                <div className="relative z-10 flex w-full flex-col gap-3 sm:flex-row md:w-auto">
                    <Input
                        type="email"
                        placeholder="Your email address"
                        className="w-full border-none bg-white text-[#181411] sm:w-64"
                    />
                    <Button
                        className="bg-[#221910] hover:bg-black"
                        size="lg"
                    >
                        Subscribe
                    </Button>
                </div>
            </div>
        </section>
    )
}
