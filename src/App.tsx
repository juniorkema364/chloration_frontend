import React, { useEffect , useState } from 'react';
import { Loader, Calendar , Trash2  ,  Eye  ,  User ,  MapPin ,  Plus  , Droplet , ArrowLeft ,  Layers , LogOut, AlertCircle, CheckCircle } from 'lucide-react';
import { useWaterStore } from './stores/useUserStore';
import { LoginPage } from './pages/Login';
import { Dashboard } from './pages/Dashboard';



const ForagesPage = () => {
  const {
    forages,
    showForageForm,
    loading,
    user,
    owner , 
    setShowForageForm,
    setSelectedForage,
    setCurrentPage,
    fetchForages,
    createForage,
    deleteForage,
    fetchAnalyses,
    clearError
  } = useWaterStore();

  const [formData, setFormData] = useState({
    forageId: '',
    name: '',
    location: '',
    depth: '',
    owner: '',
    status: 'active',
    serviceDate: ''
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchForages();
    clearError();
  }, [fetchForages, clearError]);

  // Validation du formulaire
  const validateForm = () => {
    const errors = {};

    if (!formData.forageId.trim()) {
      errors.forageId = 'ID Forage requis';
    }
    if (!formData.name.trim()) {
      errors.name = 'Nom requis';
    }
    if (!formData.location.trim()) {
      errors.location = 'Localisation requise';
    }
    if (!formData.depth || isNaN(formData.depth) || parseFloat(formData.depth) <= 0) {
      errors.depth = 'Profondeur valide requise (> 0)';
    }
    if (!formData.owner.trim()) {
      errors.owner = 'Propriétaire requis';
    }
    if (!formData.serviceDate) {
      errors.serviceDate = 'Date requise';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
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
        serviceDate: ''
      });
      setFormErrors({});
      setShowForageForm(false);
    }
  };

  const handleDelete = async (forageId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce forage ? Cette action est irréversible.')) {
      await deleteForage(forageId);
    }
  };

  const handleViewAnalyses = async (forage) => {
    setSelectedForage(forage);
    await fetchAnalyses(forage.id);
    setCurrentPage('analyses');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
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
        <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-blue-200">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Ajouter un nouveau forage</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Première ligne */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ID Forage */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ID Forage *
                </label>
                <input
                  type="text"
                  name="forageId"
                  placeholder="Ex: F001"
                  value={formData.forageId}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition ${
                    formErrors.forageId ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={loading}
                />
                {formErrors.forageId && (
                  <p className="text-red-600 text-sm mt-1">{formErrors.forageId}</p>
                )}
              </div>

              {/* Nom */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Ex: Forage Principal"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition ${
                    formErrors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={loading}
                />
                {formErrors.name && (
                  <p className="text-red-600 text-sm mt-1">{formErrors.name}</p>
                )}
              </div>
            </div>

            {/* Deuxième ligne */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Localisation */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Localisation *
                </label>
                <input
                  type="text"
                  name="location"
                  placeholder="Ex: Brazzaville"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition ${
                    formErrors.location ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={loading}
                />
                {formErrors.location && (
                  <p className="text-red-600 text-sm mt-1">{formErrors.location}</p>
                )}
              </div>

              {/* Profondeur */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Profondeur (m) *
                </label>
                <input
                  type="number"
                  name="depth"
                  placeholder="Ex: 45"
                  step="0.1"
                  value={formData.depth}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition ${
                    formErrors.depth ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={loading}
                />
                {formErrors.depth && (
                  <p className="text-red-600 text-sm mt-1">{formErrors.depth}</p>
                )}
              </div>
            </div>

            {/* Troisième ligne */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Propriétaire */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Propriétaire *
                </label>
                <input
                  type="text"
                  name="owner"
                  placeholder="Ex: Ville de Brazzaville"
                  value={formData.owner}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition ${
                    formErrors.owner ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={loading}
                />
                {formErrors.owner && (
                  <p className="text-red-600 text-sm mt-1">{formErrors.owner}</p>
                )}
              </div>

              {/* Date de mise en service */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date de mise en service *
                </label>
                <input
                  type="date"
                  name="serviceDate"
                  value={formData.serviceDate}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition ${
                    formErrors.serviceDate ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={loading}
                />
                {formErrors.serviceDate && (
                  <p className="text-red-600 text-sm mt-1">{formErrors.serviceDate}</p>
                )}
              </div>
            </div>

            {/* Statut */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Statut
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                disabled={loading}
              >
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
              </select>
            </div>

            {/* Boutons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition"
              >
                {loading && <Loader className="animate-spin" size={20} />}
                {loading ? 'Création en cours...' : 'Créer le forage'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForageForm(false);
                  setFormData({
                    forageId: '',
                    name: '',
                    location: '',
                    depth: '',
                    owner: '',
                    status: 'active',
                    serviceDate: ''
                  });
                  setFormErrors({});
                }}
                className="flex-1 border-2 border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-3 rounded-lg transition"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste des forages */}
      {loading && !showForageForm ? (
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-3">
            <Loader className="animate-spin text-blue-600" size={40} />
            <p className="text-gray-600 font-medium">Chargement des forages...</p>
          </div>
        </div>
      ) : forages.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow-md text-center">
          <Layers className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600 text-lg">Aucun forage créé pour le moment</p>
          <p className="text-gray-500 mt-2">Cliquez sur "Nouveau Forage" pour en créer un</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...forages].map(forage => (
            <div
              key={forage.id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-blue-600"
            >
              {/* En-tête de la carte */}
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex-1">{forage.name}</h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    forage.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {forage.status === 'active' ? '✓ Actif' : '✗ Inactif'}
                </span>
              </div>

              {/* Détails */}
              <div className="space-y-3 mb-4">
                <p className="text-gray-600 flex items-center gap-2">
                  <span className="font-semibold text-gray-800">ID:</span>
                  <span className="font-mono text-sm">{forage.forageId}</span>
                </p>

                <p className="text-gray-600 flex items-center gap-2">
                  <MapPin size={16} className="text-blue-600 flex-shrink-0" />
                  {forage.location}
                </p>

                <p className="text-gray-600 flex items-center gap-2">
                  <Layers size={16} className="text-blue-600 flex-shrink-0" />
                  <span>Profondeur: <strong>{forage.depth} m</strong></span>
                </p>

                <p className="text-gray-600 flex items-center gap-2">
                  <User size={16} className="text-blue-600 flex-shrink-0" />
                  {forage.owner}
                </p>

                <p className="text-gray-600 flex items-center gap-2">
                  <Calendar size={16} className="text-blue-600 flex-shrink-0" />
                  {new Date(forage.serviceDate).toLocaleDateString('fr-FR')}
                </p>
              </div>

              {/* Créateur */}
              <div className="border-t pt-3 mb-4">
                <p className="text-xs text-gray-500">
                  Créé par: <strong>{forage.User?.firstName} {forage.User?.lastName}</strong>
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(forage.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleViewAnalyses(forage)}
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2 transition"
                >
                  <Eye size={16} />
                  <span className="hidden sm:inline">Analyses</span>
                </button>
                <button
                  onClick={() => handleDelete(forage.id)}
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const AnalysesPage = () => {
  const {
    selectedForage,
    analyses,
    showAnalysisForm,
    loading,
    user,
    owner , 
    setShowAnalysisForm,
    setCurrentPage,
    createAnalysis,
    deleteAnalysis,
    fetchAnalyses,
    clearError
  } = useWaterStore();

  const [formData, setFormData] = useState({
    turbidity: '',
    color: '',
    odor: '',
    temperature: '',
    flowRate: '',
    pH: '',
    salinity: '',
    conductivity: '',
    nitrates: '',
    nitrites: '',
    iron: '',
    manganese: '',
    eColi: 'false',
    fecalColiformes: 'false',
    enterocoque: 'false',
    parasites: 'false',
    chloreDose: '',
    chloreType: '',
    volumeTraite: '',
    contactTime: '',
    chloreResiduel: '',
    turbidityAfter: '',
    pHAfter: '',
    eColiAfter: 'false'
  });

  const [formErrors, setFormErrors] = useState({});
  const [currentTab, setCurrentTab] = useState('physique');

  useEffect(() => {
    clearError();
  }, [clearError]);

  if (!selectedForage) {
    return (
      <div className="bg-white p-12 rounded-lg shadow-md text-center">
        <Droplet className="mx-auto text-gray-400 mb-4" size={48} />
        <p className="text-gray-600 text-lg">Veuillez sélectionner un forage</p>
        <button
          onClick={() => setCurrentPage('forages')}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg flex items-center justify-center gap-2 mx-auto"
        >
          <ArrowLeft size={16} /> Retour aux Forages
        </button>
      </div>
    );
  }

  const validateForm = () => {
    const errors = {};

    if (!formData.pH || isNaN(formData.pH)) {
      errors.pH = 'pH requis et valide';
    } else if (parseFloat(formData.pH) < 0 || parseFloat(formData.pH) > 14) {
      errors.pH = 'pH doit être entre 0 et 14';
    }

    if (!formData.turbidity || isNaN(formData.turbidity)) {
      errors.turbidity = 'Turbidité requise';
    } else if (parseFloat(formData.turbidity) < 0) {
      errors.turbidity = 'Turbidité doit être positive';
    }

    if (!formData.chloreResiduel || isNaN(formData.chloreResiduel)) {
      errors.chloreResiduel = 'Chlore résiduel requis';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const numericFields = [
      'turbidity', 'temperature', 'flowRate', 'pH', 'salinity',
      'conductivity', 'nitrates', 'nitrites', 'iron', 'manganese',
      'chloreDose', 'volumeTraite', 'contactTime', 'chloreResiduel',
      'turbidityAfter', 'pHAfter'
    ];

    const analysisData = {
      forageId: selectedForage.id,
      ...formData,
      ...numericFields.reduce((acc, field) => ({
        ...acc,
        [field]: formData[field] ? parseFloat(formData[field]) : null
      }), {}),
      eColi: formData.eColi === 'true',
      fecalColiformes: formData.fecalColiformes === 'true',
      enterocoque: formData.enterocoque === 'true',
      parasites: formData.parasites === 'true',
      eColiAfter: formData.eColiAfter === 'true'
    };

    const result = await createAnalysis(analysisData);

    if (result.success) {
      setFormData({
        turbidity: '', color: '', odor: '', temperature: '', flowRate: '',
        pH: '', salinity: '', conductivity: '', nitrates: '', nitrites: '',
        iron: '', manganese: '', eColi: 'false', fecalColiformes: 'false',
        enterocoque: 'false', parasites: 'false', chloreDose: '', chloreType: '',
        volumeTraite: '', contactTime: '', chloreResiduel: '', turbidityAfter: '',
        pHAfter: '', eColiAfter: 'false'
      });
      setFormErrors({});
      setShowAnalysisForm(false);
      setCurrentTab('physique');
      await fetchAnalyses(selectedForage.id);
    }
  };

  const handleDelete = async (analysisId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette analyse ?')) {
      const result = await deleteAnalysis(analysisId);
      if (result.success) {
        await fetchAnalyses(selectedForage.id);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const InputField = ({ label, name, type = 'number', placeholder, required = false, errors }) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && '*'}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={formData[name]}
        onChange={handleInputChange}
        step="0.01"
        disabled={loading}
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition ${
          errors?.[name] ? 'border-red-500 bg-red-50' : 'border-gray-300'
        }`}
      />
      {errors?.[name] && (
        <p className="text-red-600 text-sm mt-1">{errors[name]}</p>
      )}
    </div>
  );

  const SelectField = ({ label, name, options }) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <select
        name={name}
        value={formData[name]}
        onChange={handleInputChange}
        disabled={loading}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
      >
        {[...options].map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <button
            onClick={() => setCurrentPage('forages')}
            className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-2 mb-3 transition"
          >
            <ArrowLeft size={16} /> Retour aux Forages
          </button>
          <h1 className="text-4xl font-bold text-gray-800">Analyses d'Eau</h1>
          <p className="text-gray-600 mt-2">
            Forage: <strong>{selectedForage.name}</strong> ({selectedForage.forageId}) - {selectedForage.location}
          </p>
        </div>
        <button
          onClick={() => {
            setShowAnalysisForm(!showAnalysisForm);
            setFormErrors({});
          }}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition shadow-md hover:shadow-lg"
        >
          <Plus size={20} /> Nouvelle Analyse
        </button>
      </div>

      {/* Formulaire */}
      {showAnalysisForm && (
        <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-green-200">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Nouvelle Analyse d'Eau</h2>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b overflow-x-auto">
            {[
              { id: 'physique', label: 'Physiques' },
              { id: 'chimique', label: 'Chimiques' },
              { id: 'microbiologique', label: 'Microbiologiques' },
              { id: 'traitement', label: 'Traitement' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`px-4 py-2 font-semibold transition whitespace-nowrap ${
                  currentTab === tab.id
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Paramètres Physiques */}
            {currentTab === 'physique' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Turbidité (NTU)" name="turbidity" placeholder="0.00" required errors={formErrors} />
                <InputField label="Température (°C)" name="temperature" placeholder="25.0" />
                <InputField label="Couleur" name="color" type="text" placeholder="Incolore" />
                <InputField label="Odeur" name="odor" type="text" placeholder="Inodore" />
                <InputField label="Débit (L/s)" name="flowRate" placeholder="0.00" />
              </div>
            )}

            {/* Paramètres Chimiques */}
            {currentTab === 'chimique' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="pH" name="pH" placeholder="7.0" required errors={formErrors} />










                
                <InputField label="Salinité (g/L)" name="salinity" placeholder="0.50" />
                <InputField label="Conductivité (µS/cm)" name="conductivity" placeholder="500" />
                <InputField label="Nitrates (mg/L)" name="nitrates" placeholder="25" />
                <InputField label="Nitrites (mg/L)" name="nitrites" placeholder="0.05" />
                <InputField label="Fer (mg/L)" name="iron" placeholder="0.15" />
                <InputField label="Manganèse (mg/L)" name="manganese" placeholder="0.20" />
              </div>
            )}

            {/* Paramètres Microbiologiques */}
            {currentTab === 'microbiologique' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField
                  label="E. coli"
                  name="eColi"
                  options={[
                    { value: 'false', label: 'Non détecté' },
                    { value: 'true', label: 'Détecté' }
                  ]}
                />
                <SelectField
                  label="Coliformes fécaux"
                  name="fecalColiformes"
                  options={[
                    { value: 'false', label: 'Non détectés' },
                    { value: 'true', label: 'Détectés' }
                  ]}
                />
                <SelectField
                  label="Entérocoques"
                  name="enterocoque"
                  options={[
                    { value: 'false', label: 'Non détectés' },
                    { value: 'true', label: 'Détectés' }
                  ]}
                />
                <SelectField
                  label="Parasites"
                  name="parasites"
                  options={[
                    { value: 'false', label: 'Non détectés' },
                    { value: 'true', label: 'Détectés' }
                  ]}
                />
              </div>
            )}

            {/* Traitement */}
            {currentTab === 'traitement' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Dose de chlore (mg/L)" name="chloreDose" placeholder="2.5" />
                <InputField label="Type de chlore" name="chloreType" type="text" placeholder="Hypochlorite de sodium" />
                <InputField label="Volume traité (m³)" name="volumeTraite" placeholder="100" />
                <InputField label="Temps de contact (min)" name="contactTime" placeholder="30" />
                <InputField label="Chlore résiduel (mg/L)" name="chloreResiduel" placeholder="0.5" required errors={formErrors} />
                <InputField label="Turbidité après (NTU)" name="turbidityAfter" placeholder="1.0" />
                <InputField label="pH après" name="pHAfter" placeholder="7.0" />
                <SelectField
                  label="E. coli après traitement"
                  name="eColiAfter"
                  options={[
                    { value: 'false', label: 'Non détecté' },
                    { value: 'true', label: 'Détecté' }
                  ]}
                />
              </div>
            )}

            {/* Boutons */}
            <div className="flex gap-4 pt-6 border-t">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition"
              >
                {loading && <Loader className="animate-spin" size={20} />}
                {loading ? 'Enregistrement...' : 'Analyser et Enregistrer'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAnalysisForm(false);
                  setFormData({
                    turbidity: '', color: '', odor: '', temperature: '', flowRate: '',
                    pH: '', salinity: '', conductivity: '', nitrates: '', nitrites: '',
                    iron: '', manganese: '', eColi: 'false', fecalColiformes: 'false',
                    enterocoque: 'false', parasites: 'false', chloreDose: '', chloreType: '',
                    volumeTraite: '', contactTime: '', chloreResiduel: '', turbidityAfter: '',
                    pHAfter: '', eColiAfter: 'false'
                  });
                  setFormErrors({});
                  setCurrentTab('physique');
                }}
                className="flex-1 border-2 border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-3 rounded-lg transition"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste des analyses */}
      {loading && !showAnalysisForm ? (
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-3">
            <Loader className="animate-spin text-green-600" size={40} />
            <p className="text-gray-600 font-medium">Chargement des analyses...</p>
          </div>
        </div>
      ) : analyses.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow-md text-center">
          <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600 text-lg">Aucune analyse pour ce forage</p>
          <p className="text-gray-500 mt-2">Cliquez sur "Nouvelle Analyse" pour en ajouter une</p>
        </div>
      ) : (
        <div className="space-y-6">
          {[...analyses].map((analysis, idx) => (
            <div
              key={analysis.id}
              className={`border-l-4 bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition ${
                analysis.potable ? 'border-green-600' : 'border-red-600'
              }`}
            >
              {/* En-tête */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Analyse #{analyses.length - idx}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {new Date(analysis.analysisDate).toLocaleString('fr-FR')}
                  </p>
                  <p className="text-gray-500 text-xs">
                    Créée par: {forages.User?.firstName} {forages.User?.lastName}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {analysis.potable ? (
                    <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-bold flex items-center gap-2">
                      <CheckCircle size={16} /> POTABLE
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-800 px-4 py-2 rounded-full font-bold flex items-center gap-2">
                      <AlertCircle size={16} /> NON POTABLE
                    </span>
                  )}
                  <button
                    onClick={() => handleDelete(analysis.id)}
                    disabled={loading}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white p-2 rounded-lg transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Raisons de non-potabilité */}
              {!analysis.potable && analysis.reasons?.length > 0 && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-4">
                  <h4 className="font-bold text-red-800 mb-2 flex items-center gap-2">
                    <AlertCircle size={16} /> Raisons de non-potabilité
                  </h4>
                  <ul className="space-y-1">
                    {analysis.reasons.map((reason, i) => (
                      <li key={i} className="text-red-700 text-sm">
                        • {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Données */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs font-bold text-blue-900">pH</p>
                  <p className="text-lg font-bold text-blue-600">{parseFloat(analysis.pH).toFixed(1)}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs font-bold text-blue-900">Turbidité</p>
                  <p className="text-lg font-bold text-blue-600">{parseFloat(analysis.turbidity).toFixed(2)} NTU</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-xs font-bold text-green-900">Chlore rés.</p>
                  <p className="text-lg font-bold text-green-600">{parseFloat(analysis.chloreResiduel).toFixed(2)} mg/L</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-xs font-bold text-purple-900">Température</p>
                  <p className="text-lg font-bold text-purple-600">{parseFloat(analysis.temperature || 0).toFixed(1)}°C</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <p className="text-xs font-bold text-orange-900">Nitrates</p>
                  <p className="text-lg font-bold text-orange-600">{parseFloat(analysis.nitrates || 0).toFixed(1)} mg/L</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <p className="text-xs font-bold text-orange-900">Salinité</p>
                  <p className="text-lg font-bold text-orange-600">{parseFloat(analysis.salinity || 0).toFixed(2)} g/L</p>
                </div>
                <div className={`p-3 rounded-lg ${analysis.eColi ? 'bg-red-50' : 'bg-green-50'}`}>
                  <p className="text-xs font-bold">E. coli</p>
                  <p className="text-lg">{analysis.eColi ? '❌' : '✓'}</p>
                </div>
                <div className={`p-3 rounded-lg ${analysis.eColiAfter ? 'bg-red-50' : 'bg-green-50'}`}>
                  <p className="text-xs font-bold">E. coli après</p>
                  <p className="text-lg">{analysis.eColiAfter ? '❌' : '✓'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 
// Main App
export default function App() {
  const {
    isAuthenticated,
    currentPage,
    setCurrentPage,
    verifyToken,
    logout,
    error,
    successMessage,
    clearError,
    clearSuccessMessage,
    authLoading
  } = useWaterStore();

  // Vérifier le token au chargement
  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  // Auto-hide messages
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => clearError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => clearSuccessMessage(), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, clearSuccessMessage]);

  // Page de connexion si non authentifié
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Page protégée
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          {/* Navigation Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage('dashboard')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                currentPage === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentPage('forages')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                currentPage === 'forages'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Forages
            </button>
            <button
              onClick={() => setCurrentPage('analyses')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                currentPage === 'analyses'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Analyses
            </button>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition shadow-md hover:shadow-lg"
          >
            <LogOut size={16} /> Déconnexion
          </button>
        </div>
      </nav>

      {/* Messages d'erreur */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="border-l-4 border-red-600 bg-red-50 p-4 rounded-lg flex items-center gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
            <div>
              <p className="text-red-800 font-semibold">Erreur</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Messages de succès */}
      {successMessage && (
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="border-l-4 border-green-600 bg-green-50 p-4 rounded-lg flex items-center gap-3">
            <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
            <p className="text-green-800 font-semibold">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {authLoading && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-40">
          <div className="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center gap-3">
            <Loader className="animate-spin text-blue-600" size={40} />
            <p className="text-gray-700 font-medium">Traitement en cours...</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'forages' && <ForagesPage />}
        {currentPage === 'analyses' && <AnalysesPage />}
      </div>
    </div>
  );
}