import Image from "next/image"

export default function About() {
    return (
        <section
            className="bg-[#f8f7f5] px-4 py-20 md:px-10"
            id="about"
            style={{
                backgroundImage:
                    "radial-gradient(#f27f0d10 1px, transparent 1px)",
                backgroundSize: "20px 20px",
            }}
        >
            <div className="container mx-auto flex max-w-7xl flex-col items-center gap-12 lg:flex-row">
                <div className="relative w-full lg:w-1/2">
                    <div className="relative z-10 overflow-hidden rounded-2xl shadow-2xl">
                        <Image
                            src="/images/image2.jpg"
                            alt="People enjoying the warm atmosphere at NOWA CAFE"
                            width={600}
                            height={500}
                            className="h-[500px] w-full object-cover"
                        />
                    </div>
                    <div className="absolute -bottom-6 -right-6 -z-0 hidden h-48 w-48 rounded-2xl bg-[#f27f0d] md:block" />
                    <div className="absolute -left-6 -top-6 -z-0 hidden h-32 w-32 rounded-2xl border-4 border-[#e6e0db] md:block" />
                </div>

                <div className="flex w-full flex-col gap-6 lg:w-1/2">
                    <span className="text-sm font-bold uppercase tracking-widest text-[#f27f0d]">
                        Our Story
                    </span>
                    <h2 className="text-4xl font-black md:text-5xl">
                        A Space for Connection
                    </h2>
                    <p className="text-lg leading-relaxed text-[#8a7560]">
                        At NOWA CAFE, we've created more than just a coffee shop. We've built a
                        vibrant hub where the city comes together. Our warm, inviting space is
                        designed to foster community and conversation.
                    </p>
                    <p className="text-lg leading-relaxed text-[#8a7560]">
                        Whether you're looking for a quiet corner to work or a lively spot to
                        meet friends, our doors are open to everyone seeking quality brew and
                        genuine connection.
                    </p>
                    <div className="grid grid-cols-2 gap-6 pt-4">
                        <div className="flex flex-col">
                            <span className="text-3xl font-black text-[#f27f0d]">
                                100%
                            </span>
                            <span className="text-sm font-bold">Organic Beans</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-3xl font-black text-[#f27f0d]">
                                25k+
                            </span>
                            <span className="text-sm font-bold">Happy Locals</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
