'use client';

import { useState, useEffect } from 'react';

interface PresenceData {
  status: 'present' | 'absent';
  lastChecked: string;
  currentNetwork: string;
  isCompanyNetwork: boolean;
}

interface PresenceHistory {
  date: string;
  arrivalTime: string;
  departureTime?: string;
  totalHours?: string;
}

export default function PresenceTracker(): React.JSX.Element {
  const [presence, setPresence] = useState<PresenceData>({
    status: 'absent',
    lastChecked: '',
    currentNetwork: '',
    isCompanyNetwork: false
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<PresenceHistory[]>([]);

  // Mock function to simulate network detection
  const detectNetwork = async (): Promise<PresenceData> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock network detection logic
    const mockNetworks = [
      { ssid: 'TechCorp-WiFi', ip: '192.168.1.45', isCompany: true },
      { ssid: 'TechCorp-Guest', ip: '192.168.2.12', isCompany: true },
      { ssid: 'Home-WiFi', ip: '10.0.0.15', isCompany: false },
      { ssid: 'Mobile-Hotspot', ip: '172.16.0.8', isCompany: false }
    ];

    // Randomly select a network to simulate different scenarios
    const randomNetwork = mockNetworks[Math.floor(Math.random() * mockNetworks.length)];
    
    // Additional logic: consider 192.168.*.* as company network
    const isCompanyIP = randomNetwork.ip.startsWith('192.168.');
    const isCompanyNetwork = randomNetwork.isCompany || isCompanyIP;

    return {
      status: isCompanyNetwork ? 'present' : 'absent',
      lastChecked: new Date().toLocaleTimeString('fr-FR'),
      currentNetwork: `${randomNetwork.ssid} (${randomNetwork.ip})`,
      isCompanyNetwork
    };
  };

  // Initialize presence check on component mount
  useEffect(() => {
    checkPresence();
    generateMockHistory();
  }, []);

  const checkPresence = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const newPresence = await detectNetwork();
      setPresence(newPresence);
      
      // Store in localStorage for persistence
      localStorage.setItem('lastPresenceCheck', JSON.stringify(newPresence));
    } catch (error) {
      console.error('Erreur lors de la vérification de présence:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockHistory = (): void => {
    const today = new Date();
    const mockHistory: PresenceHistory[] = [];

    // Generate history for the last 5 days
    for (let i = 4; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const arrivalHour = 8 + Math.floor(Math.random() * 2); // 8-9h
      const arrivalMinute = Math.floor(Math.random() * 60);
      const departureHour = 17 + Math.floor(Math.random() * 2); // 17-18h
      const departureMinute = Math.floor(Math.random() * 60);
      
      const arrivalTime = `${arrivalHour.toString().padStart(2, '0')}:${arrivalMinute.toString().padStart(2, '0')}`;
      const departureTime = i === 0 ? undefined : `${departureHour.toString().padStart(2, '0')}:${departureMinute.toString().padStart(2, '0')}`;
      
      // Calculate total hours
      let totalHours = '';
      if (departureTime) {
        const arrival = new Date(`2024-01-01 ${arrivalTime}`);
        const departure = new Date(`2024-01-01 ${departureTime}`);
        const diffMs = departure.getTime() - arrival.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        totalHours = `${diffHours}h${diffMinutes.toString().padStart(2, '0')}`;
      }

      mockHistory.push({
        date: date.toLocaleDateString('fr-FR', { 
          weekday: 'short', 
          day: 'numeric', 
          month: 'short' 
        }),
        arrivalTime,
        departureTime,
        totalHours
      });
    }

    setHistory(mockHistory);
  };

  const getStatusColor = (status: string): string => {
    return status === 'present' 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-red-100 text-red-800 border-red-200';
  };

  const getStatusIcon = (status: string): React.JSX.Element => {
    if (status === 'present') {
      return (
        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  };

  return (
    <div className="space-y-6">
      {/* Current Status Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Suivi de Présence</h3>
          <button
            onClick={checkPresence}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Vérification...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Rafraîchir
              </>
            )}
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className={`flex items-center px-3 py-2 rounded-lg border ${getStatusColor(presence.status)}`}>
            {getStatusIcon(presence.status)}
            <span className="ml-2 font-medium capitalize">
              {presence.status === 'present' ? 'Présent' : 'Absent'}
            </span>
          </div>
          
          {presence.lastChecked && (
            <div className="text-sm text-gray-500">
              Dernière vérification: {presence.lastChecked}
            </div>
          )}
        </div>

        {presence.currentNetwork && (
          <div className="mt-3 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Réseau détecté:</span> {presence.currentNetwork}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {presence.isCompanyNetwork ? '✓ Réseau de l\'entreprise' : '✗ Réseau externe'}
            </p>
          </div>
        )}
      </div>

      {/* Presence History */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Historique des présences</h4>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Arrivée
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Départ
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {history.map((day, index) => (
                <tr key={index} className={index === 0 ? 'bg-blue-50' : ''}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {day.date}
                    {index === 0 && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        Aujourd'hui
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {day.arrivalTime}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {day.departureTime || (
                      <span className="text-orange-600 font-medium">En cours</span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {day.totalHours || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
