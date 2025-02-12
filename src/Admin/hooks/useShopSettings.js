import { useState, useEffect } from 'react';

export const useShopSettings = () => {
  const [shopSettings, setShopSettings] = useState({
    shopName: '',
    shopAddress: '',
    shopContact: '',
    profilePicture: null,
  });

  useEffect(() => {
    // Load shop settings from localStorage when the component mounts
    const savedSettings = localStorage.getItem('shopSettings');
    if (savedSettings) {
      setShopSettings(JSON.parse(savedSettings));
    }
  }, []);

  const updateShopSettings = (newSettings) => {
    const updatedSettings = { ...shopSettings, ...newSettings };
    setShopSettings(updatedSettings);
    // Save updated settings to localStorage
    localStorage.setItem('shopSettings', JSON.stringify(updatedSettings));
  };

  return { shopSettings, updateShopSettings };
};