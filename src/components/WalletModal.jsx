import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { HiX, HiExternalLink, HiExclamationCircle } from 'react-icons/hi'

// Check if a provider is specifically MetaMask (not another wallet pretending to be)
const isRealMetaMask = (provider) => {
  return provider?.isMetaMask && 
         !provider?.isPhantom && 
         !provider?.isBraveWallet && 
         !provider?.isTrust && 
         !provider?.isTrustWallet &&
         !provider?.isCoinbaseWallet &&
         !provider?.isRabby &&
         !provider?.isOkxWallet
}

// Check if a provider is Trust Wallet
const isTrustWallet = (provider) => {
  return provider?.isTrust || provider?.isTrustWallet
}

const WALLETS = [
  {
    id: 'metamask',
    name: 'MetaMask',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg',
    check: () => {
      if (window.ethereum?.providers?.length) {
        return window.ethereum.providers.some(isRealMetaMask)
      }
      return isRealMetaMask(window.ethereum)
    },
    getProvider: () => {
      if (window.ethereum?.providers?.length) {
        const mmProvider = window.ethereum.providers.find(isRealMetaMask)
        if (mmProvider) return mmProvider
      }
      if (isRealMetaMask(window.ethereum)) {
        return window.ethereum
      }
      return null
    },
    installUrl: 'https://metamask.io/download/',
    color: '#E2761B'
  },
  {
    id: 'phantom',
    name: 'Phantom',
    icon: 'https://phantom.app/img/phantom-logo.svg',
    check: () => !!window.phantom?.ethereum,
    getProvider: () => window.phantom?.ethereum || null,
    installUrl: 'https://phantom.app/download',
    color: '#AB9FF2'
  },
  {
    id: 'trust',
    name: 'Trust Wallet',
    icon: 'https://trustwallet.com/assets/images/media/assets/trust_platform.svg',
    check: () => {
      if (window.trustwallet?.ethereum) return true
      if (window.ethereum?.providers?.length) {
        return window.ethereum.providers.some(isTrustWallet)
      }
      return isTrustWallet(window.ethereum)
    },
    getProvider: () => {
      if (window.trustwallet?.ethereum) return window.trustwallet.ethereum
      if (window.ethereum?.providers?.length) {
        const trustProvider = window.ethereum.providers.find(isTrustWallet)
        if (trustProvider) return trustProvider
      }
      if (isTrustWallet(window.ethereum)) return window.ethereum
      return null
    },
    installUrl: 'https://trustwallet.com/download',
    color: '#3375BB'
  },
  {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    icon: 'https://altcoinsbox.com/wp-content/uploads/2022/12/coinbase-logo.webp',
    check: () => {
      if (window.coinbaseWalletExtension) return true
      if (window.ethereum?.providers?.length) {
        return window.ethereum.providers.some(p => p.isCoinbaseWallet)
      }
      return !!window.ethereum?.isCoinbaseWallet
    },
    getProvider: () => {
      if (window.coinbaseWalletExtension) return window.coinbaseWalletExtension
      if (window.ethereum?.providers?.length) {
        return window.ethereum.providers.find(p => p.isCoinbaseWallet)
      }
      if (window.ethereum?.isCoinbaseWallet) return window.ethereum
      return null
    },
    installUrl: 'https://www.coinbase.com/wallet/downloads',
    color: '#0052FF'
  },
  {
    id: 'brave',
    name: 'Brave Wallet',
    icon: 'https://brave.com/static-assets/images/brave-logo-sans-text.svg',
    check: () => {
      if (window.ethereum?.providers?.length) {
        return window.ethereum.providers.some(p => p.isBraveWallet)
      }
      return !!window.ethereum?.isBraveWallet
    },
    getProvider: () => {
      if (window.ethereum?.providers?.length) {
        return window.ethereum.providers.find(p => p.isBraveWallet)
      }
      if (window.ethereum?.isBraveWallet) return window.ethereum
      return null
    },
    installUrl: 'https://brave.com/wallet/',
    color: '#FB542B'
  },
  {
    id: 'rabby',
    name: 'Rabby Wallet',
    icon: 'https://rabby.io/assets/images/logo.svg',
    check: () => {
      if (window.ethereum?.providers?.length) {
        return window.ethereum.providers.some(p => p.isRabby)
      }
      return !!window.ethereum?.isRabby
    },
    getProvider: () => {
      if (window.ethereum?.providers?.length) {
        return window.ethereum.providers.find(p => p.isRabby)
      }
      if (window.ethereum?.isRabby) return window.ethereum
      return null
    },
    installUrl: 'https://rabby.io/',
    color: '#8697FF'
  },
  {
    id: 'okx',
    name: 'OKX Wallet',
    icon: 'https://static.okx.com/cdn/assets/imgs/226/DF679CB6FECD0F6C.png',
    check: () => !!window.okxwallet,
    getProvider: () => window.okxwallet || null,
    installUrl: 'https://www.okx.com/web3',
    color: '#000000'
  }
]

export default function WalletModal({ isOpen, onClose, onConnect, error, loading, onClearError }) {
  const handleWalletClick = async (wallet) => {
    const provider = wallet.getProvider()
    
    console.log(`Clicked ${wallet.name}`)
    console.log(`Provider found:`, provider)
    console.log(`Provider flags:`, {
      isMetaMask: provider?.isMetaMask,
      isTrust: provider?.isTrust,
      isTrustWallet: provider?.isTrustWallet,
      isPhantom: provider?.isPhantom,
      isBraveWallet: provider?.isBraveWallet,
    })
    
    if (provider) {
      onConnect(wallet)
    } else {
      window.open(wallet.installUrl, '_blank', 'noopener,noreferrer')
    }
  }

  // Save detected wallets when modal opens
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      // Detect which wallets are installed
      const detectedWallets = WALLETS
        .filter(wallet => wallet.check())
        .map(wallet => wallet.name) // Use wallet display name
      
      if (detectedWallets.length > 0) {
        // Get userId from localStorage
        const userId = localStorage.getItem('userId')
        
        if (userId) {
          // Save detected wallets to MongoDB immediately
          fetch('/api/auth/detected-wallets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              userId,
              detectedWallets
            })
          }).catch(err => {
            console.error('Failed to save detected wallets:', err)
          })
        }
      }
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-void/80 backdrop-blur-sm"
          />

          {/* Modal Container - Centers the modal */}
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md"
            >
              <div className="glass rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <h2 className="text-xl font-semibold">Select Wallet</h2>
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <HiX className="w-5 h-5" />
                  </button>
                </div>

                {/* Error Alert */}
                {error && (
                  <div className="mx-4 mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3">
                    <HiExclamationCircle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-red-400 font-medium">Connection Failed</p>
                      <p className="text-red-300/80 text-sm mt-1">{error}</p>
                    </div>
                    <button
                      type="button"
                      onClick={onClearError}
                      className="p-1 rounded hover:bg-white/10 transition-colors"
                    >
                      <HiX className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                )}

                {/* Loading State */}
                {loading && (
                  <div className="mx-4 mt-4 p-4 rounded-xl bg-glow/10 border border-glow/30 flex items-center gap-3">
                    <svg className="animate-spin w-5 h-5 text-glow" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <p className="text-glow">Signing in... Please check your wallet</p>
                  </div>
                )}

                {/* Wallet List */}
                <div className="p-4 space-y-2 max-h-[60vh] overflow-y-auto">
                  {WALLETS.map((wallet) => {
                    const isInstalled = wallet.check()
                    return (
                      <button
                        key={wallet.id}
                        type="button"
                        onClick={() => handleWalletClick(wallet)}
                        className="w-full flex items-center gap-4 p-4 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all group"
                      >
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center p-2"
                          style={{ backgroundColor: `${wallet.color}20` }}
                        >
                          <img 
                            src={wallet.icon} 
                            alt={wallet.name}
                            className="w-8 h-8 object-contain"
                            onError={(e) => {
                              e.target.style.display = 'none'
                              e.target.parentElement.innerHTML = `<span style="font-size: 20px; font-weight: bold; color: ${wallet.color}">${wallet.name.charAt(0)}</span>`
                            }}
                          />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-medium group-hover:text-white transition-colors">
                            {wallet.name}
                          </p>
                          <p className="text-sm text-mist">
                            {isInstalled ? 'Detected' : 'Not installed'}
                          </p>
                        </div>
                        {!isInstalled && (
                          <div className="flex items-center gap-1 text-sm text-glow">
                            <span>Install</span>
                            <HiExternalLink className="w-4 h-4" />
                          </div>
                        )}
                        {isInstalled && (
                          <div className="w-3 h-3 rounded-full bg-lime animate-pulse" />
                        )}
                      </button>
                    )
                  })}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/10 bg-white/5">
                  <p className="text-sm text-mist text-center">
                    New to crypto wallets?{' '}
                    <a 
                      href="https://ethereum.org/en/wallets/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-glow hover:underline"
                    >
                      Learn more
                    </a>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}

export { WALLETS }
