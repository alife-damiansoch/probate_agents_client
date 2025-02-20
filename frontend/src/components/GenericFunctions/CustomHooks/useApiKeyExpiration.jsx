import { useEffect, useState } from 'react';
import apiEventEmitter from '../../../utils/eventEmitter';

const useApiKeyExpiration = () => {
  const [expirationTime, setExpirationTime] = useState(null);

  useEffect(() => {
    // ✅ Listen for API key expiration updates
    const handleExpirationUpdate = (newExpiration) => {
      console.log('API Key Expiration Updated:', newExpiration);
      setExpirationTime(new Date(newExpiration));
    };

    apiEventEmitter.on('apiKeyExpirationUpdated', handleExpirationUpdate);

    return () => {
      apiEventEmitter.off('apiKeyExpirationUpdated', handleExpirationUpdate);
    };
  }, []);

  return expirationTime;
};

export default useApiKeyExpiration;
