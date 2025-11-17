import { Link } from 'react-router-dom'
import { HiCube } from 'react-icons/hi'
import { FaTwitter, FaDiscord, FaGithub } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-glow to-cyan flex items-center justify-center">
                <HiCube className="w-6 h-6 text-white" />
              </div>
              <span className="font-display font-bold text-xl">Dimension<span className="text-glow">.</span></span>
            </Link>
            <p className="text-mist text-sm leading-relaxed">
              The premier marketplace for buying and selling 3D digital assets with cryptocurrency.
            </p>
          </div>

          {/* Marketplace */}
          <div>
            <h4 className="font-semibold mb-4">Marketplace</h4>
            <ul className="space-y-2">
              <li><Link to="/explore" className="text-mist hover:text-white transition-colors">Explore</Link></li>
              <li><Link to="/explore?category=characters" className="text-mist hover:text-white transition-colors">Characters</Link></li>
              <li><Link to="/explore?category=vehicles" className="text-mist hover:text-white transition-colors">Vehicles</Link></li>
              <li><Link to="/explore?category=architecture" className="text-mist hover:text-white transition-colors">Architecture</Link></li>
            </ul>
          </div>

          {/* Creators */}
          <div>
            <h4 className="font-semibold mb-4">Creators</h4>
            <ul className="space-y-2">
              <li><Link to="/upload" className="text-mist hover:text-white transition-colors">Upload Asset</Link></li>
              <li><a href="#" className="text-mist hover:text-white transition-colors">Creator Guide</a></li>
              <li><a href="#" className="text-mist hover:text-white transition-colors">Pricing Tips</a></li>
              <li><a href="#" className="text-mist hover:text-white transition-colors">Best Practices</a></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-semibold mb-4">Community</h4>
            <div className="flex gap-4 mb-4">
              <a href="#" className="w-10 h-10 rounded-lg bg-slate flex items-center justify-center text-mist hover:text-white hover:bg-steel transition-all">
                <FaTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-slate flex items-center justify-center text-mist hover:text-white hover:bg-steel transition-all">
                <FaDiscord className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-slate flex items-center justify-center text-mist hover:text-white hover:bg-steel transition-all">
                <FaGithub className="w-5 h-5" />
              </a>
            </div>
            <p className="text-mist text-sm">Join our community of 3D artists and collectors.</p>
          </div>
        </div>

        <div className="border-t border-white/5 mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-mist text-sm">
            © 2024 Dimension Market. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-mist hover:text-white transition-colors">Terms</a>
            <a href="#" className="text-mist hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-mist hover:text-white transition-colors">Help</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

