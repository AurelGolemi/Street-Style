export default function Hero() {
  return (
    <section className="section-padding bg-gradient-to-r from-gray-100 to-purple-200 dark:from-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto text-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Your Product Name
        </h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Brief description of your amazing Product
        </p>
        <button className="btn-primary bg-black dark:bg-slate-800 hover:bg-gray-800 dark:hover:bg-slate-800 p-1">
          Get Started
        </button>
      </div>
    </section>
  )
}
