import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#f8f7f5] overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-[#f27f0d]/5 rounded-full blur-[120px] animate-pulse" />

      <div className="relative flex flex-col items-center">
        <div className="relative mb-16 group">
          <div className="absolute inset-0 bg-[#f27f0d]/30 rounded-[2.5rem] blur-2xl animate-pulse scale-110" />
          <div className="relative h-40 w-40 rounded-[2.5rem] bg-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)] border border-[#e6e0db] flex items-center justify-center rotate-6 transition-transform hover:rotate-12 duration-700">
            <div className="h-32 w-32 rounded-3xl bg-[#181411] flex items-center justify-center text-white relative overflow-hidden group">
              <div className="absolute inset-0 bg-[#f27f0d] translate-y-full group-hover:translate-y-0 transition-transform duration-500 opacity-10" />
              <Loader2 className="h-16 w-16 text-[#f27f0d] animate-spin [animation-duration:3s]" />
            </div>
          </div>
        </div>

        <div className="relative space-y-6 text-center">
          <h3 className="text-sm font-black uppercase tracking-[0.6em] text-[#181411]/40">
            Nowa Cafe
          </h3>
          <h2 className="text-4xl font-black tracking-tighter text-[#181411]">
            Brewing <span className="text-[#f27f0d]">Excellence</span>
          </h2>
        </div>
      </div>
    </div>
  );
}
