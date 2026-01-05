// src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { Droplet, Loader, Mail, Lock } from 'lucide-react';
import { useWaterStore } from '../stores/useUserStore';

export const LoginPage = () => {
  const { login, authLoading, authError, clearAuthError, setCurrentPage } = useWaterStore();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [localError, setLocalError] = useState('');
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    clearAuthError();
  }, [clearAuthError]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLocalError('');

    // Validation
    if (!formData.email || !formData.password) {
      setLocalError('Veuillez remplir tous les champs');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setLocalError('Email invalide');
      return;
    }

    // Appel API
    const result = await login(formData.email, formData.password);

    if (result.success) {
      setCurrentPage('dashboard');
      setFormData({ email: '', password: '' });
    } else {
      setLocalError(result.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setLocalError('');
    clearAuthError();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-8 rounded-t-lg">
          <div className="flex items-center gap-3 mb-3">
            <Droplet size={32} />
            <h1 className="text-2xl font-bold">WaterCheck</h1>
          </div>
          <p className="text-blue-100">Système de Contrôle de Potabilité d'Eau</p>
        </div>

        {/* Content */}
        <div className="p-8 space-y-4">
          {/* Erreur d'authentification */}
          {authError && (
            <div className="border-l-4 border-red-600 bg-red-50 p-4 rounded">
              <p className="text-red-700 text-sm font-medium">{authError}</p>
            </div>
          )}

          {/* Erreur locale */}
          {localError && (
            <div className="border-l-4 border-orange-600 bg-orange-50 p-4 rounded">
              <p className="text-orange-700 text-sm font-medium">{localError}</p>
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="email"
                  name="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                  disabled={authLoading}
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                  disabled={authLoading}
                />
              </div>
            </div>

            {/* Bouton Connexion */}
            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2 transition"
            >
              {authLoading && <Loader className="animate-spin" size={20} />}
              {authLoading ? 'Connexion en cours...' : 'Se Connecter'}
            </button>
          </form>

          {/* Séparateur */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">ou</span>
            </div>
          </div>

          {/* Bouton Inscription */}
          <button
            type="button"
            onClick={() => setShowRegister(true)}
            className="w-full border-2 border-blue-600 hover:bg-blue-50 text-blue-600 font-bold py-2 rounded-lg transition"
          >
            Créer un compte
          </button>
        </div>

        {/* Footer */}
         
      </div>

      {/* Modal d'inscription */}
      {showRegister && (
        <RegisterModal onClose={() => setShowRegister(false)} />
      )}
    </div>
  );
};

// Register Modal Component
const RegisterModal = ({ onClose }) => {
  const { register, authLoading, authError, clearAuthError, setCurrentPage } = useWaterStore();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    clearAuthError();
  }, [clearAuthError]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLocalError('');

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
      setLocalError('Veuillez remplir tous les champs');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setLocalError('Email invalide');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 8) {
      setLocalError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    // Appel API
    const result = await register(
      formData.firstName,
      formData.lastName,
      formData.email,
      formData.password,
      formData.confirmPassword
    );

    if (result.success) {
      setCurrentPage('dashboard');
      onClose();
    } else {
      setLocalError(result.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setLocalError('');
    clearAuthError();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-8 rounded-t-lg">
          <h2 className="text-2xl font-bold">Créer un compte</h2>
          <p className="text-green-100 text-sm">Rejoignez notre plateforme</p>
        </div>

        {/* Content */}
        <div className="p-8 space-y-4 max-h-96 overflow-y-auto">
          {/* Erreurs */}
          {authError && (
            <div className="border-l-4 border-red-600 bg-red-50 p-4 rounded">
              <p className="text-red-700 text-sm font-medium">{authError}</p>
            </div>
          )}

          {localError && (
            <div className="border-l-4 border-orange-600 bg-orange-50 p-4 rounded">
              <p className="text-orange-700 text-sm font-medium">{localError}</p>
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="Jean"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  disabled={authLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Dupont"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  disabled={authLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                disabled={authLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                disabled={authLoading}
              />
              <p className="text-xs text-gray-500 mt-1">Min 8 caractères</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirmer le mot de passe</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                disabled={authLoading}
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2 transition"
            >
              {authLoading && <Loader className="animate-spin" size={20} />}
              {authLoading ? 'Création en cours...' : 'Créer le compte'}
            </button>
          </form>

          <button
            type="button"
            onClick={onClose}
            className="w-full border-2 border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-2 rounded-lg transition"
          >
            Retour à la connexion
          </button>
        </div>
      </div>
    </div>
  );
};