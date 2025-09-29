'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { useAuth, useStagiaireProfile, useStagiairePassword } from '../../../../services/useStagiaireAPI';

export default function Settings(): React.JSX.Element {
  const { user } = useAuth();
  const { profile, loading, error, success, saveProfile, setProfile } = useStagiaireProfile(user?.id);
  const [editProfile, setEditProfile] = useState<any>(null);
  const { loading: pwdLoading, error: pwdError, success: pwdSuccess, changePassword } = useStagiairePassword(user?.id);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Synchronise l'état local avec le profil chargé
  useEffect(() => {
    if (profile) setEditProfile(profile);
  }, [profile]);

  const handleProfileChange = (field: string, value: string): void => {
    setEditProfile((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (editProfile) saveProfile(editProfile);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return;
    changePassword(oldPassword, newPassword);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Paramètres du compte</h1>
            <p className="mt-2 text-gray-600">Gérez vos informations personnelles</p>
          </div>
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Informations personnelles</h2>
              {error && <div className="text-red-600 mb-2">{error}</div>}
              {success && <div className="text-green-600 mb-2">{success}</div>}
              {loading && <div className="text-blue-600 mb-2">Chargement...</div>}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input type="text" value={editProfile?.nom || ''} onChange={e => handleProfileChange('nom', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                  <input type="text" value={editProfile?.prenom || ''} onChange={e => handleProfileChange('prenom', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Établissement</label>
                  <input type="text" value={editProfile?.etab || ''} onChange={e => handleProfileChange('etab', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mention</label>
                  <input type="text" value={editProfile?.mention || ''} onChange={e => handleProfileChange('mention', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
                  <input type="text" value={editProfile?.niveau || ''} onChange={e => handleProfileChange('niveau', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value={editProfile?.email || ''} onChange={e => handleProfileChange('email', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
              </div>
              <div className="mt-6">
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">Sauvegarder les modifications</button>
              </div>
            </div>
          </form>
          {/* Formulaire changement de mot de passe */}
          <form onSubmit={handlePasswordChange} className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-lg mx-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Changer le mot de passe</h2>
            {pwdError && <div className="text-red-600 mb-2">{pwdError}</div>}
            {pwdSuccess && <div className="text-green-600 mb-2">{pwdSuccess}</div>}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Ancien mot de passe</label>
              <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le nouveau mot de passe</label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
              {newPassword && confirmPassword && newPassword !== confirmPassword && (
                <div className="text-red-500 text-xs mt-1">Les mots de passe ne correspondent pas.</div>
              )}
            </div>
            <button type="submit" disabled={pwdLoading || !oldPassword || !newPassword || newPassword !== confirmPassword} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 disabled:opacity-50">{pwdLoading ? 'Changement...' : 'Changer le mot de passe'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
