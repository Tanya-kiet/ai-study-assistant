import { BackgroundVideo } from '../components/BackgroundVideo'
import { Hero } from '../components/Hero'
import { Navbar } from '../components/Navbar'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <motion.section
      id="top"
      className="relative flex min-h-screen flex-col overflow-visible bg-[hsl(var(--background))] text-[hsl(var(--foreground))]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="relative h-full min-h-full w-full overflow-hidden">
          <BackgroundVideo />
        </div>
      </div>

      <div
        className="pointer-events-none absolute left-1/2 top-1/2 z-[5] h-[527px] w-[984px] max-w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 bg-gray-950 opacity-90 blur-[82px]"
        aria-hidden
      />

      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />
        <Hero />
      </div>
    </motion.section>
  )
}
