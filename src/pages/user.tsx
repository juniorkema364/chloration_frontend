import React, { useState } from 'react';
import { Droplet, Loader, Mail, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useWaterStore } from '../stores/waterStore';

// Page de Connexion
export const LoginPage = () => {
  const { login, authLoading, authError, clearAuthError } = useWaterStore();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showRegister, setShowRegister] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!formData.email || !formData.password) {
      setLocalError('Veuillez remplir tous les champs');
      return;
    }

    try {
      await login(formData.email, formData.password);
    } catch (error) {
      console.error('Erreur connexion:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-t-lg">
          <div className="flex items-center gap-2 mb-2">
            <Droplet size={32} />
            <h1 className="text-2xl font-bold">WaterCheck</h1>
          </div>
          <CardDescription className="text-blue-100">
            Système de Contrôle de Potabilité d'Eau
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6 space-y-4">
          {(authError || localError) && (
            <Alert className="border-red-600 bg-red-50">
              <AlertDescription className="text-red-700">
                {authError || localError}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              <Input
                type="email"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  clearAuthError();
                  setLocalError('');
                }}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <Input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  clearAuthError();
                  setLocalError('');
                }}
                className="pl-10"
              />
            </div>
          </div>

          <Button
            onClick={handleLogin}
            disabled={authLoading}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {authLoading ? <Loader className="mr-2 animate-spin" size={20} /> : null}
            {authLoading ? 'Connexion...' : 'Se Connecter'}
          </Button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">ou</span>
            </div>
          </div>

          <Button
            onClick={() => setShowRegister(true)}
            variant="outline"
            className="w-full"
          >
            Créer un compte
          </Button>

          {showRegister && (
            <RegisterModal onClose={() => setShowRegister(false)} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Modal d'Inscription
const RegisterModal = ({ onClose }) => {
  const { register, authLoading, authError, clearAuthError } = useWaterStore();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [localError, setLocalError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
      setLocalError('Veuillez remplir tous les champs');
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

    try {
      await register(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.password,
        formData.confirmPassword
      );
      onClose();
    } catch (error) {
      console.error('Erreur inscription:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
          <CardTitle>Créer un compte</CardTitle>
          <CardDescription className="text-green-100">
            Rejoignez notre plateforme de gestion d'eau
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6 space-y-4">
          {(authError || localError) && (
            <Alert className="border-red-600 bg-red-50">
              <AlertDescription className="text-red-700">
                {authError || localError}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Prénom</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={18} />
                <Input
                  placeholder="Jean"
                  value={formData.firstName}
                  onChange={(e) => {
                    setFormData({ ...formData, firstName: e.target.value });
                    clearAuthError();
                    setLocalError('');
                  }}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Nom</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={18} />
                <Input
                  placeholder="Dupont"
                  value={formData.lastName}
                  onChange={(e) => {
                    setFormData({ ...formData, lastName: e.target.value });
                    clearAuthError();
                    setLocalError('');
                  }}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              <Input
                type="email"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  clearAuthError();
                  setLocalError('');
                }}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <Input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  clearAuthError();
                  setLocalError('');
                }}
                className="pl-10"
              />
            </div>
            <p className="text-xs text-gray-500">Au moins 8 caractères</p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Confirmer le mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <Input
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => {
                  setFormData({ ...formData, confirmPassword: e.target.value });
                  clearAuthError();
                  setLocalError('');
                }}
                className="pl-10"
              />
            </div>
          </div>

          <Button
            onClick={handleRegister}
            disabled={authLoading}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {authLoading ? <Loader className="mr-2 animate-spin" size={20} /> : null}
            {authLoading ? 'Création...' : 'Créer le compte'}
          </Button>

          <Button
            onClick={onClose}
            variant="outline"
            className="w-full"
          >
            Retour à la connexion
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};