import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiPencil, HiCheck, HiX, HiCube, HiShoppingCart, HiCurrencyDollar } from 'react-icons/hi'
import { FaEthereum } from 'react-icons/fa'
import { useWallet } from '../context/WalletContext'
import ObjectCard from '../components/ObjectCard'

export default function Profile() {
  const { address } = useParams()
  const { account, user: currentUser, updateUser } = useWallet()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('created')
  const [purchases, setPurchases] = useState([])
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({ username: '', bio: '' })

  const isOwner = account?.toLowerCase() === address?.toLowerCase()

  useEffect(() => {
    fetchProfile()
    if (isOwner) {
      fetchPurchases()
    }
  }, [address, isOwner])

  const fetchProfile = async () => {
    try {
      const res = await fetch(`/api/users/${address}`)
      if (!res.ok) throw new Error('Not found')
      const data = await res.json()
      setProfile(data)
      setEditForm({ username: data.username, bio: data.bio || '' })
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPurchases = async () => {
    try {
      const res = await fetch(`/api/purchases/${address}`)
      const data = await res.json()
      setPurchases(data)
    } catch (error) {
      console.error('Failed to fetch purchases:', error)
    }
  }

  const handleSaveProfile = async () => {
    try {
      const res = await fetch(`/api/users/${address}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      })
      const data = await res.json()
      setProfile(prev => ({ ...prev, ...data }))
      updateUser(data)
      setEditing(false)
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
  }

  const formatAddress = (addr) => `${addr.slice(0, 6)}...${addr.slice(-4)}`

  if (loading) {
    return (
      <div className="pt-24 pb-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-24 h-24 rounded-full bg-slate" />
              <div className="space-y-3">
                <div className="h-8 w-48 bg-slate rounded" />
                <div className="h-4 w-32 bg-slate rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Profile Not Found</h2>
          <Link to="/explore" className="text-glow hover:underline">
            Back to Explore
          </Link>
        </div>
      </div>
    )
  }

  const stats = [
    { label: 'Created', value: profile.objects?.length || 0, icon: HiCube },
    { label: 'Sales', value: profile.objects?.reduce((sum, o) => sum + (o.purchases || 0), 0) || 0, icon: HiShoppingCart },
    { label: 'Volume', value: `${(profile.objects?.reduce((sum, o) => sum + (o.purchases || 0) * parseFloat(o.price || 0), 0) || 0).toFixed(2)} ETH`, icon: HiCurrencyDollar },
  ]

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-glow via-cyan to-lime flex items-center justify-center text-4xl font-bold">
              {profile.username?.charAt(0).toUpperCase() || 'U'}
            </div>

            {/* Info */}
            <div className="flex-1">
              {editing ? (
                <div className="space-y-4 max-w-md">
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full px-4 py-2 bg-slate border border-white/10 rounded-xl text-white focus:outline-none focus:border-glow/50"
                    placeholder="Username"
                  />
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                    className="w-full px-4 py-2 bg-slate border border-white/10 rounded-xl text-white focus:outline-none focus:border-glow/50 resize-none"
                    placeholder="Tell us about yourself..."
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveProfile}
                      className="px-4 py-2 rounded-lg bg-glow text-white font-medium flex items-center gap-2"
                    >
                      <HiCheck className="w-4 h-4" />
                      Save
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="px-4 py-2 rounded-lg bg-slate text-mist font-medium flex items-center gap-2"
                    >
                      <HiX className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4 mb-2">
                    <h1 className="font-display text-3xl font-bold">{profile.username}</h1>
                    {isOwner && (
                      <button
                        onClick={() => setEditing(true)}
                        className="p-2 rounded-lg bg-slate hover:bg-steel transition-colors"
                      >
                        <HiPencil className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-mist flex items-center gap-2 mb-4">
                    <FaEthereum className="w-4 h-4" />
                    {formatAddress(profile.address)}
                  </p>
                  {profile.bio && (
                    <p className="text-mist max-w-xl">{profile.bio}</p>
                  )}
                </>
              )}
            </div>

            {/* Stats */}
            <div className="flex gap-6 md:gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <stat.icon className="w-6 h-6 mx-auto mb-2 text-mist" />
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-mist">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-white/10">
          <button
            onClick={() => setActiveTab('created')}
            className={`pb-4 px-2 font-medium transition-colors relative ${
              activeTab === 'created' ? 'text-white' : 'text-mist hover:text-white'
            }`}
          >
            Created
            {activeTab === 'created' && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-glow"
              />
            )}
          </button>
          {isOwner && (
            <button
              onClick={() => setActiveTab('purchased')}
              className={`pb-4 px-2 font-medium transition-colors relative ${
                activeTab === 'purchased' ? 'text-white' : 'text-mist hover:text-white'
              }`}
            >
              Purchased
              {activeTab === 'purchased' && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-glow"
                />
              )}
            </button>
          )}
        </div>

        {/* Tab Content */}
        {activeTab === 'created' && (
          <div>
            {profile.objects?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {profile.objects.map((obj, i) => (
                  <ObjectCard key={obj.id} object={obj} index={i} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 glass rounded-2xl">
                <HiCube className="w-16 h-16 mx-auto text-mist mb-4" />
                <h3 className="text-xl font-semibold mb-2">No assets yet</h3>
                <p className="text-mist mb-6">
                  {isOwner ? "Start creating and upload your first 3D asset!" : "This creator hasn't uploaded any assets yet."}
                </p>
                {isOwner && (
                  <Link
                    to="/upload"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-glow to-cyan text-white"
                  >
                    Create Asset
                  </Link>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'purchased' && isOwner && (
          <div>
            {purchases.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {purchases.map((purchase, i) => (
                  purchase.object && <ObjectCard key={purchase.id} object={purchase.object} index={i} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 glass rounded-2xl">
                <HiShoppingCart className="w-16 h-16 mx-auto text-mist mb-4" />
                <h3 className="text-xl font-semibold mb-2">No purchases yet</h3>
                <p className="text-mist mb-6">
                  Explore the marketplace and find your first 3D asset!
                </p>
                <Link
                  to="/explore"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-glow to-cyan text-white"
                >
                  Explore Assets
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

