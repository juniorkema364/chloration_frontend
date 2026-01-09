import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Loader, Calendar, Trash2, Eye, User, MapPin, Plus, Layers } from 'lucide-react';
import { useWaterStore, Forage, CreateForagePayload } from './stores/useUserStore';

interface FormErrors {
  forageId?: string;
  name?: string;
  location?: string;
  depth?: string;
  owner?: string;
  serviceDate?: string;
}

export const ForagesPage: React.FC = () => {
  const {
    forages,
    showForageForm,
    loading,
    setShowForageForm,
    setSelectedForage,
    setCurrentPage,
    fetchForages,
    createForage,
    deleteForage,
    fetchAnalyses,
    clearError,
  } = useWaterStore();

  const [formData, setFormData] = useState<CreateForagePayload>({
    forageId: '',
    name: '',
    location: '',
    depth: '',
    owner: '',
    status: 'active',
    serviceDate: '',
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});

  useEffect(() => {
    fetchForages();
    clearError();
  }, [fetchForages, clearError]);

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    if (!formData.forageId.trim()) errors.forageId = 'ID Forage requis';
    if (!formData.name.trim()) errors.name = 'Nom requis';
    if (!formData.location.trim()) errors.location = 'Localisation requise';
    if (!formData.depth || isNaN(Number(formData.depth)) || Number(formData.depth) <= 0)
      errors.depth = 'Profondeur valide requise (> 0)';
    if (!formData.owner.trim()) errors.owner = 'Propriétaire requis';
    if (!formData.serviceDate) errors.serviceDate = 'Date requise';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    const result = await createForage(formData);
    if (result.success) {
      setFormData({
        forageId: '',
        name: '',
        location: '',
        depth: '',
        owner: '',
        status: 'active',
        serviceDate: '',
      });
      setFormErrors({});
      setShowForageForm(false);
    }
  };

  const handleDelete = async (forageId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce forage ? Cette action est irréversible.')) {
      await deleteForage(forageId);
    }
  };

  const handleViewAnalyses = async (forage: Forage) => {
    setSelectedForage(forage);
    await fetchAnalyses(forage.id);
    setCurrentPage('analyses');
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Gestion des Forages</h1>
          <p className="text-gray-600 mt-2">Créez et gérez vos sources d'eau souterraine</p>
        </div>
        <button
          onClick={() => {
            setShowForageForm(!showForageForm);
            setFormErrors({});
          }}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition shadow-md hover:shadow-lg"
        >
          <Plus size={20} /> Nouveau Forage
        </button>
      </div>

      {/* Formulaire */}
      {showForageForm && (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg border-2 border-blue-200 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">ID Forage *</label>
              <input
                type="text"
                name="forageId"
                value={formData.forageId}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg ${
                  formErrors.forageId ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              />
              {formErrors.forageId && <p className="text-red-600 text-sm mt-1">{formErrors.forageId}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nom *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg ${
                  formErrors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              />
              {formErrors.name && <p className="text-red-600 text-sm mt-1">{formErrors.name}</p>}
            </div>
          </div>
          {/* Ajoute les autres champs typés de la même manière */}
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-bold"
          >
            {loading ? 'Création en cours...' : 'Créer le forage'}
          </button>
        </form>
      )}

      {/* Liste des forages */}
      {loading && !showForageForm ? (
        <div className="flex justify-center py-16">
          <Loader className="animate-spin text-blue-600" size={40} />
        </div>
      ) : forages.length === 0 ? (
        <p className="text-center text-gray-600">Aucun forage créé</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forages.map(forage => (
            <div key={forage.id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-600">
              <h3 className="text-xl font-bold">{forage.name}</h3>
              <p>ID: {forage.forageId}</p>
              <p>Localisation: {forage.location}</p>
              <p>Profondeur: {forage.depth} m</p>
              <p>Propriétaire: {forage.owner}</p>
              <button onClick={() => handleViewAnalyses(forage)}>Voir Analyses</button>
              <button onClick={() => handleDelete(forage.id)}>Supprimer</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
