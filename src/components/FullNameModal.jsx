import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { HiX } from 'react-icons/hi'

export default function FullNameModal({ isOpen, onClose, onSubmit }) {
  const [fullname, setFullname] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!fullname.trim()) {
      setError('Please enter your full name')
      return
    }

    if (fullname.trim().length < 2) {
      setError('Full name must be at least 2 characters')
      return
    }

    onSubmit(fullname.trim())
  }

  const handleClose = () => {
    setFullname('')
    setError('')
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-void/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
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
                  <h2 className="text-xl font-semibold">Enter Your Full Name</h2>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <HiX className="w-5 h-5" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                  <div className="mb-4">
                    <label htmlFor="fullname" className="block text-sm font-medium text-mist mb-2">
                      Full Name
                    </label>
                    <input
                      id="fullname"
                      type="text"
                      value={fullname}
                      onChange={(e) => {
                        setFullname(e.target.value)
                        setError('')
                      }}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-xl bg-slate border border-white/10 focus:border-glow/50 focus:outline-none text-white placeholder-mist transition-colors"
                      autoFocus
                    />
                    {error && (
                      <p className="mt-2 text-sm text-red-400">{error}</p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="flex-1 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-mist hover:text-white transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-glow via-cyan to-lime text-void font-semibold hover:opacity-90 transition-opacity"
                    >
                      Continue
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}

