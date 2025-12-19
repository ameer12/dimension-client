import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiEye, HiShoppingCart, HiDownload, HiShare, HiHeart, HiArrowLeft, HiRefresh } from 'react-icons/hi'
import { FaEthereum } from 'react-icons/fa'
import { useWallet } from '../context/WalletContext'
import Model3DViewer from '../components/Model3DViewer'
import WalletModal from '../components/WalletModal'

export default function ObjectDetail() {
  const { id } = useParams()
  const { account, isConnected, openWalletModal, showWalletModal, closeWalletModal, connectWithWallet, error, loading: walletLoading, clearError } = useWallet()
  const [object, setObject] = useState(null)
  const [pageLoading, setPageLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)
  const [purchased, setPurchased] = useState(false)

  useEffect(() => {
    fetchObject()
  }, [id])

  const fetchObject = async () => {
    try {
      const res = await fetch(`/api/objects/${id}`)
      if (!res.ok) throw new Error('Not found')
      const data = await res.json()
      setObject(data)
    } catch (error) {
      console.error('Failed to fetch object:', error)
    } finally {
      setPageLoading(false)
    }
  }

  const handlePurchase = async () => {
    if (!isConnected) {
      openWalletModal()
      return
    }

    if (!window.ethereum) {
      alert('Please install MetaMask to make purchases')
      return
    }

    setPurchasing(true)
    
    try {
      const provider = new window.ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate tx time

      await fetch('/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          objectId: object.id,
          buyerAddress: account,
          txHash: `0x${Math.random().toString(16).slice(2)}`
        })
      })

      setPurchased(true)
    } catch (error) {
      console.error('Purchase failed:', error)
      alert('Purchase failed. Please try again.')
    } finally {
      setPurchasing(false)
    }
  }

  if (pageLoading) {
    return (
      <div className="pt-24 pb-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-square bg-slate rounded-2xl" />
            <div className="space-y-6">
              <div className="h-10 bg-slate rounded w-3/4" />
              <div className="h-6 bg-slate rounded w-1/4" />
              <div className="h-24 bg-slate rounded" />
              <div className="h-16 bg-slate rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // --- بداية التعديل على منطقة الخطأ ---
  if (!object) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <div className="text-center px-4 max-w-md">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-6"
          >
            <div className="w-20 h-20 bg-glow/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-glow/20">
              <HiRefresh className="w-10 h-10 text-glow animate-spin-slow" />
            </div>
            <h2 className="text-3xl font-bold mb-3 font-display">Syncing Asset...</h2>
            <p className="text-mist mb-8">
              We've received your asset! We are currently indexing it to the market. This usually takes a few seconds.
            </p>
          </motion.div>

          <div className="flex flex-col gap-4">
            <button 
              onClick={() => { setPageLoading(true); fetchObject(); }}
              className="w-full py-4 bg-gradient-to-r from-glow to-cyan rounded-xl font-bold text-white shadow-lg shadow-glow/20 hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              <HiRefresh className="w-5 h-5" />
              Check Availability
            </button>
            <Link to="/explore" className="text-mist hover:text-white transition-colors py-2">
              Back to Explore
            </Link>
          </div>
        </div>
      </div>
    )
  }
  // --- نهاية التعديل على منطقة الخطأ ---

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 text-mist hover:text-white mb-8 transition-colors"
        >
          <HiArrowLeft className="w-5 h-5" />
          Back to Explore
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Model3DViewer 
              modelUrl={object.modelUrl} 
              className="aspect-square"
            />
            
            <div className="flex gap-3 mt-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-glow">
                <img 
                  src={object.thumbnailUrl} 
                  alt={object.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-20 h-20 rounded-xl bg-slate border border-white/10 flex items-center justify-center text-mist">
                3D
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-glow/10 text-glow capitalize">
              {object.category}
            </span>

            <h1 className="font-display text-4xl sm:text-5xl font-bold">
              {object.name}
            </h1>

            {object.creator && (
              <Link 
                to={`/profile/${object.creatorAddress}`}
                className="inline-flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-glow to-cyan flex items-center justify-center">
                  <span className="text-sm font-bold">
                    {object.creator.username?.charAt(0).toUpperCase() || 'C'}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-mist">Creator</p>
                  <p className="font-medium group-hover:text-glow transition-colors">
                    {object.creator.username}
                  </p>
                </div>
              </Link>
            )}

            <div className="flex gap-6 py-4 border-y border-white/10">
              <div className="flex items-center gap-2 text-mist">
                <HiEye className="w-5 h-5" />
                <span>{object.views} views</span>
              </div>
              <div className="flex items-center gap-2 text-mist">
                <HiShoppingCart className="w-5 h-5" />
                <span>{object.purchases} sold</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-mist leading-relaxed">
                {object.description}
              </p>
            </div>

            <div className="glass rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-mist">Current Price</span>
                <div className="flex items-center gap-3">
                  <FaEthereum className="w-6 h-6 text-cyan" />
                  <span className="text-3xl font-bold">{object.price} ETH</span>
                </div>
              </div>
              <p className="text-right text-mist text-sm">
                ≈ ${(parseFloat(object.price) * 2200).toFixed(2)} USD
              </p>

              {purchased ? (
                <button
                  className="w-full py-4 rounded-xl font-semibold bg-lime/20 text-lime flex items-center justify-center gap-2"
                >
                  <HiDownload className="w-5 h-5" />
                  Download Asset
                </button>
              ) : (
                <button
                  onClick={handlePurchase}
                  disabled={purchasing}
                  className="w-full py-4 rounded-xl font-semibold bg-gradient-to-r from-glow via-purple-500 to-cyan text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {purchasing ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Processing...
                    </span>
                  ) : isConnected ? (
                    'Buy Now'
                  ) : (
                    'Connect Wallet to Buy'
                  )}
                </button>
              )}

              <div className="flex gap-3">
                <button className="flex-1 py-3 rounded-xl font-medium border border-white/10 hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
                  <HiHeart className="w-5 h-5" />
                  Favorite
                </button>
                <button className="flex-1 py-3 rounded-xl font-medium border border-white/10 hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
                  <HiShare className="w-5 h-5" />
                  Share
                </button>
              </div>
            </div>

            <div className="glass rounded-2xl divide-y divide-white/10">
              <details className="group">
                <summary className="flex items-center justify-between p-4 cursor-pointer">
                  <span className="font-medium">File Details</span>
                  <span className="text-mist group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-4 pb-4 text-mist space-y-2">
                  <div className="flex justify-between">
                    <span>Format</span>
                    <span>GLB / GLTF</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Polygons</span>
                    <span>~50,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Textures</span>
                    <span>4K PBR</span>
                  </div>
                </div>
              </details>
              <details className="group">
                <summary className="flex items-center justify-between p-4 cursor-pointer">
                  <span className="font-medium">License</span>
                  <span className="text-mist group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-4 pb-4 text-mist">
                  <p>Commercial use allowed. Attribution appreciated but not required.</p>
                </div>
              </details>
            </div>
          </motion.div>
        </div>
      </div>

      <WalletModal
        isOpen={showWalletModal}
        onClose={closeWalletModal}
        onConnect={connectWithWallet}
        error={error}
        loading={walletLoading}
        onClearError={clearError}
      />
    </div>
  )
            }
