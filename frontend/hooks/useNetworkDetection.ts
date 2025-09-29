import { useState, useEffect } from 'react';

export interface NetworkInfo {
  ssid: string;
  bssid: string;
  ipAddress: string;
  isCompanyNetwork: boolean;
  isLocalhost?: boolean;
  isOnline?: boolean;
  connectionType?: string;
  lastUpdated?: Date;
  error?: string;
}

interface UseNetworkDetectionProps {
  onCompanyNetworkDetected?: (networkInfo: NetworkInfo) => void;
}

export const useNetworkDetection = (props?: UseNetworkDetectionProps): NetworkInfo => {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo>({
    ssid: '',
    bssid: '',
    ipAddress: '',
    isCompanyNetwork: false,
  });

  useEffect(() => {
    let isMounted = true;
    
    const detectNetwork = async () => {
      if (!isMounted) return;
      
      try {
        let ssid = '';
        let bssid = '';
        let ipAddress = '';
        
        // 1. Essayer de détecter via l'API NetworkInformation (Chrome uniquement en HTTPS)
        // @ts-ignore - L'API NetworkInformation n'est pas encore standardisée
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        
        if (connection) {
          // Détection du type de connexion (wifi, cellular, etc.)
          const connectionType = connection.type || connection.effectiveType;
          
          // Si on est en WiFi, on peut essayer de détecter le SSID (uniquement sur certaines plateformes)
          if (connectionType === 'wifi' && 'getWiFiInformation' in connection) {
            try {
              // @ts-ignore
              const wifiInfo = await connection.getWiFiInformation();
              if (isMounted && wifiInfo) {
                ssid = wifiInfo.ssid || '';
                bssid = wifiInfo.bssid || '';
              }
            } catch (e) {
              console.debug('Impossible de détecter les informations Wi-Fi (fonctionnalité non supportée):', e);
            }
          }
        }

        // 2. Détection de l'adresse IP locale via WebRTC (fonctionne dans la plupart des navigateurs)
        try {
          // @ts-ignore - L'API RTCPeerConnection est disponible dans la plupart des navigateurs
          const pc = new RTCPeerConnection({ iceServers: [] });
          pc.createDataChannel('');
          const sdp = await pc.createOffer();
          
          if (sdp?.sdp) {
            const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/;
            const ipMatch = sdp.sdp.match(ipRegex);
            if (ipMatch && isMounted) {
              ipAddress = ipMatch[0];
            }
          }
          pc.close();
        } catch (e) {
          console.debug('Impossible de détecter l\'adresse IP locale via WebRTC:', e);
          
          // En cas d'échec, essayer une méthode alternative
          try {
            // Vérifier si la méthode alternative est disponible
            // @ts-ignore - Méthode expérimentale non typée
            if (window.RTCPeerConnection && typeof window.RTCPeerConnection.getLocalIPs === 'function') {
              // @ts-ignore - Méthode alternative pour certains navigateurs
              const addresses = await window.RTCPeerConnection.getLocalIPs();
              if (Array.isArray(addresses) && addresses.length > 0 && isMounted) {
                ipAddress = String(addresses[0]); // S'assurer que c'est une chaîne
                console.debug('[Network] Adresse IP détectée via méthode alternative:', ipAddress);
              }
            } else {
              console.debug('[Network] Méthode alternative de détection IP non disponible');
            }
          } catch (e) {
            console.debug('[Network] Méthode alternative de détection IP échouée:', e);
          }
        }

        if (!isMounted) return;

        // 3. Vérifier si on est en développement (localhost)
        const isLocalhost = window.location.hostname === 'localhost' || 
                          window.location.hostname === '127.0.0.1' || 
                          window.location.hostname === '::1' ||
                          ipAddress === '127.0.0.1' || 
                          ipAddress === '::1' ||
                          ipAddress === '::ffff:127.0.0.1';

        // 4. Détecter si on est sur le réseau de l'entreprise
        const companyNetworkDetected = isCompanyNetwork(ipAddress, ssid) || isLocalhost;

        // 5. Mettre à jour l'état avec les informations collectées
        const newNetworkInfo = {
          ssid,
          bssid,
          ipAddress,
          isCompanyNetwork: companyNetworkDetected,
          isLocalhost,
          lastUpdated: new Date(),
          connectionType: connection?.type || connection?.effectiveType || 'unknown',
          error: undefined
        };

        if (isMounted) {
          setNetworkInfo(prev => {
            // Ne pas mettre à jour si rien n'a changé (évite les re-rendus inutiles)
            if (JSON.stringify(prev) === JSON.stringify(newNetworkInfo)) {
              return prev;
            }
            return newNetworkInfo;
          });

          // 6. Si on est sur le réseau de l'entreprise, déclencher le callback
          if (companyNetworkDetected && props?.onCompanyNetworkDetected) {
            console.log('[Network] Réseau entreprise détecté, enregistrement de la présence...', newNetworkInfo);
            props.onCompanyNetworkDetected(newNetworkInfo);
          }
        }
      } catch (error) {
        console.error('[Network] Erreur lors de la détection du réseau:', error);
        if (isMounted) {
          setNetworkInfo(prev => ({
            ...prev,
            error: 'Impossible de détecter les informations réseau',
            lastUpdated: new Date()
          }));
        }
      }
    };

    // Détection initiale
    detectNetwork();

    // Vérification périodique (toutes les 5 minutes)
    const intervalId = setInterval(detectNetwork, 5 * 60 * 1000);

    // Écouter les changements de connexion réseau
    const handleOnline = () => {
      console.log('[Network] Connexion réseau rétablie, vérification...');
      detectNetwork();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', () => {
      console.log('[Network] Hors ligne');
      if (isMounted) {
        setNetworkInfo(prev => ({
          ...prev,
          isOnline: false,
          lastUpdated: new Date()
        }));
      }
    });

    // Nettoyage
    return () => {
      isMounted = false;
      clearInterval(intervalId);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', () => {});
    };
  }, [props?.onCompanyNetworkDetected]); // Utilisation de la propriété props

  return networkInfo;
};

// Fonction pour vérifier si on est sur le réseau de l'entreprise
const isCompanyNetwork = (ip?: string, ssid?: string): boolean => {
  // Vérifier le SSID
  if (ssid && ssid.toLowerCase().includes('itdc mada')) {
    return true;
  }
  
  // Vérifier l'IP locale (192.168.1.x, 10.0.0.x, 172.16.x.x)
  if (ip) {
    const ipParts = ip.split('.').map(Number);
    
    // 192.168.1.x
    if (ipParts[0] === 192 && ipParts[1] === 168 && ipParts[2] === 1) {
      return true;
    }
    
    // 10.0.0.x
    if (ipParts[0] === 10) {
      return true;
    }
    
    // 172.16.x.x - 172.31.x.x
    if (ipParts[0] === 172 && ipParts[1] >= 16 && ipParts[1] <= 31) {
      return true;
    }
  }
  
  return false;
};

export default useNetworkDetection;
