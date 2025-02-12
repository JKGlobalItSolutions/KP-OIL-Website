'use client'

import React, { useState, useEffect } from 'react'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { db, storage } from '../firebase/firebase'
import { useProfile } from './ProfileContext'

export default function ShopSettings() {
  const { profilePicture, setProfilePicture } = useProfile();
  const [shopData, setShopData] = useState({
    name: '',
    address: '',
    contact: '',
    profilePicture: profilePicture
  })
  const [newProfilePicture, setNewProfilePicture] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const docRef = doc(db, 'ShopSettings', 'shopProfile')
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          setShopData(docSnap.data())
        }
      } catch (error) {
        console.error('Error fetching shop data:', error)
      }
    }

    fetchShopData()
  }, [])

  const handleProfilePictureChange = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewProfilePicture({
          file: file,
          preview: reader.result
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      let updatedShopData = { ...shopData }

      if (newProfilePicture) {
        if (shopData.profilePicture && shopData.profilePicture !== '/placeholder.svg') {
          const oldImageRef = ref(storage, shopData.profilePicture)
          await deleteObject(oldImageRef)
        }

        const storageRef = ref(storage, `profilePictures/${Date.now()}_${newProfilePicture.file.name}`)
        await uploadBytes(storageRef, newProfilePicture.file)
        const downloadURL = await getDownloadURL(storageRef)
        
        updatedShopData.profilePicture = downloadURL
        setProfilePicture(downloadURL)
      }

      const docRef = doc(db, 'ShopSettings', 'shopProfile')
      await setDoc(docRef, updatedShopData)

      setShopData(updatedShopData)
      setNewProfilePicture(null)
      alert('Shop settings updated successfully!')
    } catch (error) {
      console.error('Error updating shop settings:', error)
      alert('Error updating shop settings. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const styles = {
    container: {
      maxWidth: '1000px',
      margin: '10px',
      padding: '1rem',
      '@media (max-width: 1024px)': {
        maxWidth: '100%',
        margin: 0,
        padding: 0,
        border: 'none',
        borderRadius: 0,
      },
    },
    title: {
      color: '#B22222',
      textAlign: 'center',
      fontSize: '2.5rem',
      marginBottom: '2rem',
      '@media (max-width: 768px)': {
        fontSize: '2rem',
        marginBottom: '1rem',
      },
      '@media (max-width: 1024px)': {
        fontSize: '1.8rem',
        marginBottom: '0.8rem',
      },
    },
    profileContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '2rem',
    },
    profilePicture: {
      width: '150px',
      height: '150px',
      border: '2px solid #B22222',
      borderRadius: '50%',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8f9fa',
      marginBottom: '1rem',
      '@media (max-width: 768px)': {
        width: '120px',
        height: '120px',
      },
      '@media (max-width: 1024px)': {
        width: '100px',
        height: '100px',
      },
    },
    profileImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    profileIcon: {
      width: '60%',
      height: '60%',
      color: '#B22222',
    },
    uploadLabel: {
      color: '#B22222',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    hiddenInput: {
      display: 'none',
    },
    button: {
      width: '100%',
      padding: '0.75rem',
      backgroundColor: '#B22222',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '1rem',
      cursor: 'pointer',
      '@media (max-width: 768px)': {
        padding: '0.5rem',
        fontSize: '0.9rem',
      },
      '@media (max-width: 1024px)': {
        fontSize: '0.85rem',
      },
    },
    responsiveInput: {
      '@media (max-width: 768px)': {
        fontSize: '0.9rem',
      },
    },
  }

  return (
    <div className="col-12" style={{
      border: window.innerWidth > 1024 ? "2px solid #A41E19" : "none",
      padding: window.innerWidth <= 1024 ? '0.5rem' : '2rem',
      borderRadius: window.innerWidth > 1024 ? '8px' : '0',
    }}>
      <div className="row">
        <div className="col-12">
          <h1 className='d-none d-lg-block ' style={styles.title}>Shop Settings</h1>
          <h1 className='text-center d-lg-none ' style={{color:"#A41E19"}} >Shop Settings</h1>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="row justify-content-center">
          <div className="col-12 col-md-6">
            <div style={styles.profileContainer}>
              <div style={styles.profilePicture}>
                {newProfilePicture ? (
                  <img src={newProfilePicture.preview} alt="New Profile" style={styles.profileImage} />
                ) : shopData.profilePicture === '/placeholder.svg' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={styles.profileIcon}>
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                ) : (
                  <img src={shopData.profilePicture} alt="Profile" style={styles.profileImage} />
                )}
              </div>
              <label htmlFor="profilePicture" style={styles.uploadLabel}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                  <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
                </svg>
                Upload Profile Picture
              </label>
              <input
                id="profilePicture"
                type="file"
                accept="image/*"
                style={styles.hiddenInput}
                onChange={handleProfilePictureChange}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12 col-lg-12 col-md-12 mb-3">
            <label htmlFor="shopName" className="form-label">Shop Name</label>
            <input
              type="text"
              className="form-control"
              id="shopName"
              placeholder="Enter shop name"
              value={shopData.name}
              onChange={(e) => setShopData(prev => ({ ...prev, name: e.target.value }))}
              disabled={isLoading}
              style={styles.responsiveInput}
            />
          </div>
          <div className="col-12 col-md-12 col-lg-12 mb-3">
            <label htmlFor="shopContact" className="form-label">Shop Contact</label>
            <input
              type="text"
              className="form-control"
              id="shopContact"
              placeholder="Enter shop contact"
              value={shopData.contact}
              onChange={(e) => setShopData(prev => ({ ...prev, contact: e.target.value }))}
              disabled={isLoading}
              style={styles.responsiveInput}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-12 mb-3">
            <label htmlFor="shopAddress" className="form-label">Shop Address</label>
            <input
              type="text"
              className="form-control"
              id="shopAddress"
              placeholder="Enter shop address"
              value={shopData.address}
              onChange={(e) => setShopData(prev => ({ ...prev, address: e.target.value }))}
              disabled={isLoading}
              style={styles.responsiveInput}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <button
              type="submit"
              style={styles.button}
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update Settings'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

