import ActionMenu from './ActionMenu'

export default function NavBar({ links = [], cta, showMenu = false }) {
  return (
    <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/10 dark:bg-black/20 supports-[backdrop-filter]:bg-white/10 border-b border-white/10">
      <div className="mx-auto max-w-[1200px] px-6 md:px-8 h-16 flex items-center justify-between">
        {/* Left: brand */}
        <a href="#" className="font-semibold tracking-tight text-white/90 hover:text-white rounded-full px-3 py-2 ring-1 ring-white/10">
          Nova Amino
        </a>

        {/* Center: nav links */}
        <nav className="hidden md:flex items-center gap-3 md:gap-4" aria-label="Primary">
          {links.map((link) => (
            <a key={link.label} href={link.href}
              className="px-3 py-2 rounded-full text-sm/6 text-slate-200 hover:text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40">
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right: actions */}
        <div className="flex items-center">
          <a href="#" className="px-3 py-2 rounded-full text-sm text-slate-200 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40">Log in</a>
          {cta && (
            <a href={cta.href} className="ml-3 px-4 py-2 rounded-full bg-white text-slate-900 hover:bg-slate-100 font-semibold">{cta.label}</a>
          )}
          {showMenu && (
            <div className="ml-3"><ActionMenu /></div>
          )}
        </div>
      </div>
      {/* Underbar gradient for depth */}
      <div className="pointer-events-none h-px w-full bg-gradient-to-r from-transparent via-white/25 to-transparent" />
    </div>
  )
}

