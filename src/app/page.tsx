// import { Button } from "~/_components/ui/button"
// import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#12026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          SV Baseball <span className="text-[hsl(280,100%,70%)]">MiL Draft</span> App
        </h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          <div className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
            <h3 className="text-2xl font-bold">First Steps →</h3>
            <div className="text-lg">
              Just the basics - Get Everything scaffolded for league managers
              Setting up the draft functionality.
              Make it mobile friendly.
            </div>
          </div>
          <div className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
            <h3 className="text-2xl font-bold">Documentation →</h3>
            <div className="text-lg">
              Setup for documentation with the app, 
              guiding users on how to use it.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
