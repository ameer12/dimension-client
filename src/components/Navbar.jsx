import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useWallet } from '../context/WalletContext'
import { HiMenu, HiX, HiCube, HiUpload, HiUser, HiLogout } from 'react-icons/hi'
import { motion, AnimatePresence } from 'framer-motion'
import WalletModal from './WalletModal'
import FullNameModal from './FullNameModal'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { 
    account, 
    user, 
    disconnect, 
    loading, 
    error,
    isConnected,
    showFullnameModal,
    showWalletModal,
    openWalletModal,
    closeWalletModal,
    closeFullnameModal,
    handleFullnameSubmit,
    clearError,
    connectWithWallet
  } = useWallet()
  const location = useLocation()

  const navLinks = [
    { path: '/explore', label: 'Explore', icon: HiCube },
    { path: '/upload', label: 'Create', icon: HiUpload },
  ]

  const formatAddress = (addr) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-glow to-cyan flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <HiCube className="w-6 h-6 text-white" />
              </div>
              <span className="font-display font-bold text-xl hidden sm:block">
                Dimension<span className="text-glow">.</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    location.pathname === link.path
                      ? 'bg-glow/20 text-glow'
                      : 'text-mist hover:text-white hover:bg-white/5'
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Connect Wallet / User Menu */}
            <div className="hidden md:flex items-center gap-4">
              {isConnected ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-3 px-4 py-2 rounded-xl bg-slate border border-white/10 hover:border-glow/50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-glow to-cyan flex items-center justify-center">
                      <span className="text-xs font-bold">{user?.username?.charAt(0).toUpperCase() || 'U'}</span>
                    </div>
                    <span className="text-sm font-medium">{formatAddress(account)}</span>
                  </button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 top-full mt-2 w-48 py-2 glass rounded-xl border border-white/10 shadow-xl"
                      >
                        <Link
                          to={`/profile/${account}`}
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2 text-mist hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <HiUser className="w-5 h-5" />
                          Profile
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            disconnect()
                            setShowUserMenu(false)
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-mist hover:text-red-400 hover:bg-white/5 transition-colors"
                        >
                          <HiLogout className="w-5 h-5" />
                          Disconnect
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={openWalletModal}
                  disabled={loading}
                  className="relative group px-6 py-2.5 rounded-xl font-semibold overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-glow via-cyan to-lime opacity-100 group-hover:opacity-90 transition-opacity" />
                  <span className="relative text-void">
                    {loading ? 'Signing in...' : 'Sign in'}
                  </span>
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              {isOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden glass border-t border-white/5"
            >
              <div className="px-4 py-4 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                      location.pathname === link.path
                        ? 'bg-glow/20 text-glow'
                        : 'text-mist hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <link.icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                ))}

                {isConnected ? (
                  <>
                    <Link
                      to={`/profile/${account}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-mist hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <HiUser className="w-5 h-5" />
                      Profile
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        disconnect()
                        setIsOpen(false)
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-mist hover:text-red-400 hover:bg-white/5 transition-colors"
                    >
                      <HiLogout className="w-5 h-5" />
                      Disconnect ({formatAddress(account)})
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      openWalletModal()
                      setIsOpen(false)
                    }}
                    disabled={loading}
                    className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-glow via-cyan to-lime text-void"
                  >
                    {loading ? 'Signing in...' : 'Sign in'}
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* FullName Modal */}
      <FullNameModal
        isOpen={showFullnameModal}
        onClose={closeFullnameModal}
        onSubmit={handleFullnameSubmit}
      />

      {/* Wallet Selection Modal */}
      <WalletModal
        isOpen={showWalletModal}
        onClose={closeWalletModal}
        onConnect={connectWithWallet}
        error={error}
        loading={loading}
        onClearError={clearError}
      />
    </>
  )
}