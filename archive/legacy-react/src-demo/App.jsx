import NavBar from '../components/NavBar'

export default function App(){
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <NavBar
        links={[
          {label:'Home', href:'#'},
          {label:'Products', href:'#'},
          {label:'Solutions', href:'#'},
          {label:'Pricing', href:'#'},
          {label:'Docs', href:'#'},
          {label:'Resources', href:'#'},
        ]}
        cta={{label:'Talk to an Expert', href:'#'}}
        showMenu
      />
      <main className="mx-auto max-w-[1200px] px-6 md:px-8">
        <section className="py-20">
          <h1 className="heading text-4xl md:text-5xl mb-6">Frosted Menu Demo</h1>
          <p className="text-slate-400 max-w-prose">Keyboard test: Tab to the Options button, Enter to open, Arrow keys to navigate, Esc to close.</p>
        </section>
      </main>
    </div>
  )
}

