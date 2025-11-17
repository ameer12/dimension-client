import { createContext, useContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'

const WalletContext = createContext()

export function WalletProvider({ children }) {
  const [account, setAccount] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showFullnameModal, setShowFullnameModal] = useState(false)
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [connectedWallet, setConnectedWallet] = useState(null)
  const [fullname, setFullname] = useState(null)

  useEffect(() => {
    // Check if already connected
    const savedAccount = localStorage.getItem('walletAccount')
    const savedUser = localStorage.getItem('walletUser')
    const savedWallet = localStorage.getItem('connectedWallet')
    const savedFullname = localStorage.getItem('fullname')
    
    if (savedAccount && savedUser) {
      setAccount(savedAccount)
      setUser(JSON.parse(savedUser))
      if (savedWallet) {
        setConnectedWallet(savedWallet)
      }
      if (savedFullname) {
        setFullname(savedFullname)
      }
    }
  }, [])
  
  useEffect(() => {
    // Check if we have a userId from previous fullname submission
    const savedUserId = localStorage.getItem('userId')
    const savedFullname = localStorage.getItem('fullname')
    if (savedUserId && savedFullname) {
      setFullname(savedFullname)
    }
  }, [])

  const openWalletModal = () => {
    setError(null) // Clear any previous errors
    // Show fullname modal first if userId is not set
    const savedUserId = localStorage.getItem('userId')
    if (!savedUserId) {
      setShowFullnameModal(true)
    } else {
      const savedFullname = localStorage.getItem('fullname')
      if (savedFullname) {
        setFullname(savedFullname)
      }
      setShowWalletModal(true)
    }
  }

  const closeWalletModal = () => {
    setShowWalletModal(false)
    // Don't clear error immediately so user can see it
  }

  const closeFullnameModal = () => {
    setShowFullnameModal(false)
  }

  const handleFullnameSubmit = async (name) => {
    try {
      setLoading(true)
      setError(null)
      
      // Save fullname to MongoDB
      const res = await fetch('/api/auth/fullname', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullname: name })
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to save fullname')
      }

      const { userId, fullname: savedFullname } = await res.json()
      
      setFullname(savedFullname)
      localStorage.setItem('fullname', savedFullname)
      localStorage.setItem('userId', userId)
      setShowFullnameModal(false)
      setShowWalletModal(true)
    } catch (err) {
      console.error('Save fullname error:', err)
      setError(err.message || 'Failed to save fullname')
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => {
    setError(null)
  }

  const connectWithWallet = async (wallet) => {
    const provider = wallet.getProvider()
    
    if (!provider) {
      setError(`${wallet.name} is not available. Please install it first.`)
      return false
    }

    setLoading(true)
    setError(null)

    try {
      console.log(`Connecting to ${wallet.name}...`)
      
      // Create ethers provider from the specific wallet provider
      const ethersProvider = new ethers.BrowserProvider(provider)
      
      // Request accounts - this triggers the wallet popup
      console.log('Requesting accounts...')
      const accounts = await ethersProvider.send('eth_requestAccounts', [])
      
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts returned from wallet')
      }
      
      const address = accounts[0]
      console.log('Got address:', address)

      // Get ETH balance (for reference, total balance check happens on server)
      console.log('Getting ETH balance...')
      const balance = await ethersProvider.getBalance(address)
      const balanceInEth = ethers.formatEther(balance)
      console.log('ETH Balance:', balanceInEth, 'ETH')

      // Get nonce from server
      console.log('Getting nonce from server...')
      const nonceRes = await fetch(`/api/auth/nonce/${address}`)
      if (!nonceRes.ok) {
        throw new Error('Failed to get authentication nonce from server')
      }
      const { nonce } = await nonceRes.json()
      console.log('Got nonce')

      // Sign message
      console.log('Requesting signature...')
      const signer = await ethersProvider.getSigner()
      const signature = await signer.signMessage(nonce)
      console.log('Got signature')

      // Verify with server - send wallet type, balance, and userId
      console.log('Verifying with server...')
      const userId = localStorage.getItem('userId')
      if (!userId) {
        throw new Error('User ID not found. Please enter your full name first.')
      }
      
      const verifyRes = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          address, 
          signature,
          walletType: wallet.name, // Use wallet display name for consistency
          balance: balanceInEth,
          userId
        })
      })

      if (!verifyRes.ok) {
        const errorData = await verifyRes.json().catch(() => ({}))
        throw new Error(errorData.error || 'Authentication failed')
      }

      const { user: userData, token } = await verifyRes.json()
      console.log('Authenticated successfully!')

      // Close modal on success
      closeWalletModal()

      setAccount(address)
      setUser(userData)
      setConnectedWallet(wallet.id)
      localStorage.setItem('walletAccount', address)
      localStorage.setItem('walletUser', JSON.stringify(userData))
      localStorage.setItem('authToken', token)
      localStorage.setItem('connectedWallet', wallet.id)

      return true
    } catch (err) {
      console.error('Connection error:', err)
      
      // Handle user rejection
      if (err.code === 4001 || err.message?.includes('rejected') || err.message?.includes('denied')) {
        setError('Connection request was rejected')
      } else {
        setError(err.message || 'Failed to connect wallet')
      }
      return false
    } finally {
      setLoading(false)
    }
  }

  const disconnect = () => {
    setAccount(null)
    setUser(null)
    setConnectedWallet(null)
    setError(null)
    setFullname(null)
    localStorage.removeItem('walletAccount')
    localStorage.removeItem('walletUser')
    localStorage.removeItem('authToken')
    localStorage.removeItem('connectedWallet')
    localStorage.removeItem('fullname')
    localStorage.removeItem('userId')
  }

  const updateUser = (updates) => {
    const newUser = { ...user, ...updates }
    setUser(newUser)
    localStorage.setItem('walletUser', JSON.stringify(newUser))
  }

  const value = {
    account,
    user,
    loading,
    error,
    connectedWallet,
    showFullnameModal,
    showWalletModal,
    openWalletModal,
    closeWalletModal,
    closeFullnameModal,
    handleFullnameSubmit,
    clearError,
    connectWithWallet,
    disconnect,
    updateUser,
    isConnected: !!account
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}
