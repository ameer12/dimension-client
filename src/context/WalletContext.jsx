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
    const savedAccount = localStorage.getItem('walletAccount')
    const savedUser = localStorage.getItem('walletUser')
    const savedWallet = localStorage.getItem('connectedWallet')
    const savedFullname = localStorage.getItem('fullname')

    if (savedAccount && savedUser) {
      setAccount(savedAccount)
      setUser(JSON.parse(savedUser))
      if (savedWallet) setConnectedWallet(savedWallet)
      if (savedFullname) setFullname(savedFullname)
    }
  }, [])

  const openWalletModal = () => {
    setError(null)
    const savedUserId = localStorage.getItem('userId')
    if (!savedUserId) {
      setShowFullnameModal(true)
    } else {
      const savedFullname = localStorage.getItem('fullname')
      if (savedFullname) setFullname(savedFullname)
      setShowWalletModal(true)
    }
  }

  const closeWalletModal = () => {
    setShowWalletModal(false)
  }

  const closeFullnameModal = () => {
    setShowFullnameModal(false)
  }

  const handleFullnameSubmit = async (name) => {
    try {
      setLoading(true)
      setError(null)

      const mockUserId = 'user_' + Math.random().toString(36).substr(2, 9)
      
      setFullname(name)
      localStorage.setItem('fullname', name)
      localStorage.setItem('userId', mockUserId)
      
      setShowFullnameModal(false)
      setShowWalletModal(true)
    } catch (err) {
      console.error('Submit error:', err)
      setShowFullnameModal(false)
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
      setError(`${wallet.name} is not available.`)
      return false
    }

    setLoading(true)
    setError(null)

    try {
      const ethersProvider = new ethers.BrowserProvider(provider)
      const accounts = await ethersProvider.send('eth_requestAccounts', [])

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found')
      }

      const address = accounts[0]
      const mockUserData = { 
        address, 
        username: fullname || 'User',
        userId: localStorage.getItem('userId')
      }

      setAccount(address)
      setUser(mockUserData)
      setConnectedWallet(wallet.id)
      
      localStorage.setItem('walletAccount', address)
      localStorage.setItem('walletUser', JSON.stringify(mockUserData))
      localStorage.setItem('connectedWallet', wallet.id)

      closeWalletModal()
      return true
    } catch (err) {
      console.error('Connection error:', err)
      setError(err.message || 'Failed to connect')
      return false
    } finally {
      setLoading(false)
    }
  }

  const disconnect = () => {
    setAccount(null)
    setUser(null)
    setConnectedWallet(null)
    setFullname(null)
    localStorage.clear()
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
  return context
}
