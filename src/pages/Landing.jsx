import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiCube, HiLightningBolt, HiShieldCheck, HiGlobe, HiArrowRight, HiCurrencyDollar, HiUpload, HiSearch } from 'react-icons/hi'
import { FaEthereum, FaBitcoin } from 'react-icons/fa'
import { SiPolygon, SiSolana } from 'react-icons/si'
import ObjectCard from '../components/ObjectCard'

export default function Landing() {
  const [stats, setStats] = useState({ totalObjects: 0, totalUsers: 0, totalVolume: 0 })
  const [featuredObjects, setFeaturedObjects] = useState([])

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(setStats).catch(() => {})
    fetch('/api/objects?sort=popular').then(r => r.json()).then(data => setFeaturedObjects(data.slice(0, 4))).catch(() => {})
  }, [])

  const features = [
    {
      icon: HiShieldCheck,
      title: 'Secure Transactions',
      description: 'All payments are processed on-chain with full transparency and security.',
      color: 'from-glow to-purple-400'
    },
    {
      icon: HiLightningBolt,
      title: 'Instant Delivery',
      description: 'Download your 3D assets immediately after purchase confirmation.',
      color: 'from-cyan to-blue-400'
    },
    {
      icon: HiCube,
      title: 'Premium Assets',
      description: 'Curated collection of high-quality 3D models from top creators.',
      color: 'from-lime to-green-400'
    },
    {
      icon: HiGlobe,
      title: 'Global Marketplace',
      description: 'Buy and sell with creators worldwide using cryptocurrency.',
      color: 'from-ember to-orange-400'
    }
  ]

  const steps = [
    { step: '01', title: 'Connect Wallet', description: 'Link your crypto wallet to get started', icon: HiCurrencyDollar },
    { step: '02', title: 'Explore or Create', description: 'Browse assets or upload your own 3D models', icon: HiSearch },
    { step: '03', title: 'Buy or Sell', description: 'Complete transactions with cryptocurrency', icon: HiUpload },
  ]

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-glow/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan/20 rounded-full blur-[120px] animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]">
            <div className="w-full h-full border border-white/5 rounded-full animate-[spin_60s_linear_infinite]" />
            <div className="absolute inset-8 border border-white/5 rounded-full animate-[spin_40s_linear_infinite_reverse]" />
            <div className="absolute inset-16 border border-white/5 rounded-full animate-[spin_20s_linear_infinite]" />
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-glow/10 border border-glow/20 text-glow text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-glow animate-pulse" />
                Web3 Native Marketplace
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6"
            >
              The Future of{' '}
              <span className="gradient-text">3D Digital Assets</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-mist max-w-2xl mx-auto mb-10"
            >
              Buy, sell, and trade premium 3D objects with cryptocurrency. 
              A decentralized marketplace for creators and collectors.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/explore"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold bg-gradient-to-r from-glow via-purple-500 to-cyan text-white hover:opacity-90 transition-opacity"
              >
                Explore Marketplace
                <HiArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/upload"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold bg-slate border border-white/10 hover:border-white/20 transition-colors"
              >
                Start Creating
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-3 gap-8 mt-16 max-w-lg mx-auto"
            >
              <div className="text-center">
                <p className="text-3xl font-bold gradient-text">{stats.totalObjects || '500'}+</p>
                <p className="text-mist text-sm mt-1">3D Assets</p>
              </div>
              <div className="text-center border-x border-white/10">
                <p className="text-3xl font-bold gradient-text">{stats.totalUsers || '200'}+</p>
                <p className="text-mist text-sm mt-1">Creators</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold gradient-text">{stats.totalVolume?.toFixed(0) || '150'} ETH</p>
                <p className="text-mist text-sm mt-1">Volume</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Supported Chains */}
      <section className="py-12 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-12 text-mist/50">
            <span className="text-sm uppercase tracking-wider">Supported Chains</span>
            <FaEthereum className="w-8 h-8 hover:text-cyan transition-colors cursor-pointer" />
            <SiPolygon className="w-8 h-8 hover:text-purple-500 transition-colors cursor-pointer" />
            <SiSolana className="w-6 h-6 hover:text-lime transition-colors cursor-pointer" />
            <FaBitcoin className="w-8 h-8 hover:text-ember transition-colors cursor-pointer" />
          </div>
        </div>
      </section>

      {/* Featured Objects */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3">
                Featured Assets
              </h2>
              <p className="text-mist">Discover trending 3D objects from top creators</p>
            </div>
            <Link
              to="/explore"
              className="hidden sm:inline-flex items-center gap-2 text-glow hover:text-purple-400 transition-colors"
            >
              View All
              <HiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredObjects.map((obj, i) => (
              <ObjectCard key={obj.id} object={obj} index={i} />
            ))}
          </div>

          <Link
            to="/explore"
            className="sm:hidden mt-8 inline-flex items-center gap-2 text-glow hover:text-purple-400 transition-colors"
          >
            View All Assets
            <HiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-obsidian/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Why Choose Dimension?
            </h2>
            <p className="text-mist max-w-2xl mx-auto">
              Built for the future of digital asset trading with security, speed, and simplicity at its core.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6 group hover:border-glow/30 transition-colors"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-mist text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-mist max-w-2xl mx-auto">
              Get started in minutes with our simple three-step process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative text-center"
              >
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-glow/50 to-transparent" />
                )}
                <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-slate border border-white/10 mb-6">
                  <item.icon className="w-10 h-10 text-glow" />
                  <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-to-br from-glow to-cyan flex items-center justify-center text-sm font-bold text-void">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
                <p className="text-mist">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative glass rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-glow/20 via-transparent to-cyan/20" />
            <div className="relative px-8 py-16 sm:px-16 sm:py-20 text-center">
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                Ready to Join the Future?
              </h2>
              <p className="text-mist text-lg max-w-2xl mx-auto mb-10">
                Whether you're a creator looking to sell your 3D assets or a collector searching for unique pieces, Dimension Market is your gateway to the metaverse.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/explore"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold bg-white text-void hover:bg-white/90 transition-colors"
                >
                  Start Exploring
                </Link>
                <Link
                  to="/upload"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold border border-white/20 hover:bg-white/5 transition-colors"
                >
                  Become a Creator
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

