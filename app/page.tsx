import Link from "next/link";
import { ArrowRight, Sparkles, Zap, Target, Rocket } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold text-white">WebNova</span>
            </div>
            <Link
              href="/solutii"
              className="rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-500 hover:scale-105"
            >
              Explorează Soluții
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-32">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20"></div>
        <div className="mx-auto max-w-5xl text-center relative z-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-500/20 px-4 py-2 text-sm text-blue-300">
            <Zap className="h-4 w-4" />
            Website-as-a-Service Platform
          </div>
          <h1 className="mb-6 text-6xl font-extrabold leading-tight tracking-tight text-white md:text-7xl">
            Pagini de Landing
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> Generate de AI</span>
          </h1>
          <p className="mb-12 text-xl leading-relaxed text-slate-300 max-w-3xl mx-auto">
            WebNova.ro transformă afaceri în prezențe online captivante. Generăm automat landing pages optimizate SEO,
            personalizate pentru fiecare nișă B2B, cu design adaptat psihologiei vizuale și conținut ultra-optimizat.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/solutii"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-4 text-lg font-bold text-white shadow-2xl shadow-blue-500/50 transition-all hover:scale-105 hover:shadow-blue-500/70"
            >
              Vezi Exemple Live
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/20 bg-white/5 px-8 py-4 text-lg font-bold text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/30"
            >
              Află Mai Multe
            </a>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="px-6 py-24 bg-black/20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">De Ce WebNova?</h2>
            <p className="text-xl text-slate-300">Tehnologie AI de ultimă generație pentru rezultate excepționale</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group rounded-3xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 p-8 transition-all hover:scale-105 hover:border-blue-400/40 hover:shadow-2xl hover:shadow-blue-500/20">
              <Target className="h-12 w-12 text-blue-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-3">Design Adaptat Psihologic</h3>
              <p className="text-slate-300 leading-relaxed">
                Fiecare pagină folosește un sistem de design specific industriei: Clinical Trust pentru medici,
                Legal Authority pentru avocați, Industrial Action pentru constructori.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group rounded-3xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 p-8 transition-all hover:scale-105 hover:border-purple-400/40 hover:shadow-2xl hover:shadow-purple-500/20">
              <Sparkles className="h-12 w-12 text-purple-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-3">Conținut SEO Inteligent</h3>
              <p className="text-slate-300 leading-relaxed">
                Google Gemini 2.5 Flash creează conținut AIO-optimizat: keywords long-tail, entități semantice,
                și copywriting în framework-ul PAS (Problem-Agitate-Solve).
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group rounded-3xl bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-500/20 p-8 transition-all hover:scale-105 hover:border-orange-400/40 hover:shadow-2xl hover:shadow-orange-500/20">
              <Rocket className="h-12 w-12 text-orange-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-3">Imagini Dinamice Generate</h3>
              <p className="text-slate-300 leading-relaxed">
                Fiecare landing page include imagini fotorealiste generate automat pentru fiecare nișă,
                fără costuri suplimentare și perfect aliniate cu mesajul paginii.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-32">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-5xl font-extrabold text-white mb-6">
            Pregătit Să Transformi <br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Prezența Ta Online?
            </span>
          </h2>
          <p className="text-xl text-slate-300 mb-10">
            Explorează paginile generate pentru diverse industrii și descoperă puterea AI-ului aplicat pentru B2B.
          </p>
          <Link
            href="/solutii"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-10 py-5 text-xl font-bold text-white shadow-2xl shadow-blue-500/50 transition-all hover:scale-105 hover:shadow-blue-500/70"
          >
            Descoperă Soluțiile
            <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 px-6 py-12">
        <div className="mx-auto max-w-7xl text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-blue-400" />
            <span className="text-xl font-bold text-white">WebNova.ro</span>
          </div>
          <p className="text-slate-400">
            Website-as-a-Service Platform • Powered by Google Gemini AI
          </p>
          <p className="text-slate-500 text-sm mt-2">
            © 2025 WebNova. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
