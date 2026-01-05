import React, { useEffect } from 'react';
import {Navigate} from "react-router-dom"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Plus, Eye, AlertCircle, CheckCircle, Droplet, Trash2, Activity, Loader , LogOut } from 'lucide-react';
import { Button } from '@/components/components/ui/button';
import { Input } from '@/components/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/components/ui/avatar";
import { useWaterStore  , useUserStore} from '../stores/useUserStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/components/ui/dropdown-menu";

// Dashboard Component
const Dashboard = () => {
  const { stats, analyses, fetchStats, fetchForages } = useWaterStore();


  useEffect(() => {
    fetchStats();
    fetchForages();
    console.log("Les analyses" , analyses)
  }, [fetchStats, fetchForages]);

  const chartData = [...analyses].slice(0, 10).reverse().map((a, idx) => ({
    name: `Ana. ${idx + 1}`,
    pH: parseFloat(a.pH),
    turbidity: parseFloat(a.turbidity),
  }));

  const pieData = stats ? [
    { name: 'Potable', value: stats.potable },
    { name: 'Non potable', value: stats.nonPotable }
  ] : [];

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <Card className={`border-l-4 ${color} hover:shadow-lg transition-shadow`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div className="text-3xl font-bold">{value || 0}</div>
        <Icon className={`h-8 w-8 ${color.replace('border', 'text')}`} />
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-8 rounded-lg">
        <div className="flex items-center gap-3">
          <Droplet size={40} />
          <div>
            <h1 className="text-4xl font-bold">Système de Contrôle de Potabilité</h1>
            <p className="text-blue-100">Gestion intelligente de la qualité d'eau de forage</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Forages" value={stats?.totalForages} icon={Droplet} color="border-blue-600" />
        <StatCard title="Eau Potable" value={stats?.potable} icon={CheckCircle} color="border-green-600" />
        <StatCard title="Non Potable" value={stats?.nonPotable} icon={AlertCircle} color="border-red-600" />
        <StatCard title="Total Analyses" value={stats?.totalAnalyses} icon={Activity} color="border-purple-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Évolution des Paramètres</CardTitle>
            <CardDescription>Tendances pH et Turbidité (10 dernières analyses)</CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="pH" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="turbidity" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : <p className="text-center text-gray-500">Pas de données disponibles</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribution Potabilité</CardTitle>
            <CardDescription>Ratio eau potable vs non potable</CardDescription>
          </CardHeader>
          <CardContent>
            {stats && stats.totalAnalyses > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={80} fill="#8884d8" dataKey="value">
                    <Cell fill="#10b981" />
                    <Cell fill="#ef4444" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : <p className="text-center text-gray-500">Pas de données disponibles</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Forages Page Component
const ForagesPage = () => {
  const { forages, showForageForm, setShowForageForm, createForage, deleteForage, setCurrentPage, setSelectedForage, fetchAnalyses, loading } = useWaterStore();
  const [formData, setFormData] = React.useState({
    forageId: '', name: '', location: '', depth: '', owner: '', status: 'active', serviceDate: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createForage(formData);
      setFormData({ forageId: '', name: '', location: '', depth: '', owner: '', status: 'active', serviceDate: '' });
    } catch (error) {
      console.error('Erreur création forage:', error);
    }
  };

  const handleDelete = async (forageId) => {
    if (window.confirm('Êtes-vous sûr de supprimer ce forage ?')) {
      try {
        await deleteForage(forageId);
      } catch (error) {
        console.error('Erreur suppression:', error);
      }
    }
  };

  const handleViewAnalyses = (forage) => {
    setSelectedForage(forage);
    fetchAnalyses(forage.id);
    setCurrentPage('analyses');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Forages</h1>
          <p className="text-gray-600">Créez et gérez vos sources d'eau souterraine</p>
        </div>
        <Button onClick={() => setShowForageForm(!showForageForm)} className="bg-blue-600 hover:bg-blue-700">
          <Plus size={20} className="mr-2" /> Nouveau Forage
        </Button>
      </div>

      <Dialog open={showForageForm} onOpenChange={setShowForageForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau forage</DialogTitle>
            <DialogDescription>Remplissez les informations du forage</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="ID Forage" value={formData.forageId} onChange={(e) => setFormData({...formData, forageId: e.target.value})} />
              <Input placeholder="Nom" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              <Input placeholder="Localisation" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
              <Input type="number" placeholder="Profondeur (m)" value={formData.depth} onChange={(e) => setFormData({...formData, depth: e.target.value})} />
              <Input type="date" value={formData.serviceDate} onChange={(e) => setFormData({...formData, serviceDate: e.target.value})} />
              <Input placeholder="Propriétaire" value={formData.owner} onChange={(e) => setFormData({...formData, owner: e.target.value})} />
            </div>
            <Button onClick={handleSubmit} disabled={loading} className="w-full bg-green-600 hover:bg-green-700">
              {loading ? <Loader className="mr-2 animate-spin" size={20} /> : null}
              Créer le forage
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {forages.map(forage => (
          <Card key={forage.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{forage.name}</CardTitle>
                <Badge variant={forage.status === 'active' ? 'default' : 'secondary'}>
                  {forage.status === 'active' ? '✓ Actif' : '✗ Inactif'}
                </Badge>
              </div>
              <CardDescription>ID: {forage.forageId}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm"><strong>Localisation:</strong> {forage.location}</p>
              <p className="text-sm"><strong>Profondeur:</strong> {forage.depth} m</p>
              <p className="text-sm"><strong>Propriétaire:</strong> {forage.owner}</p>
              <div className="flex gap-2 pt-4">
                <Button onClick={() => handleViewAnalyses(forage)} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <Eye size={16} className="mr-2" /> Analyses
                </Button>
                <Button onClick={() => handleDelete(forage.id)} variant="destructive" size="sm">
                  <Trash2 size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Analyses Page Component
const AnalysesPage = () => {
  const { selectedForage, analyses, showAnalysisForm, setShowAnalysisForm, createAnalysis, deleteAnalysis, loading } = useWaterStore();
  const [formData, setFormData] = React.useState({
    turbidity: '', color: '', odor: '', temperature: '', flowRate: '',
    pH: '', salinity: '', conductivity: '', nitrates: '', nitrites: '', iron: '', manganese: '',
    eColi: 'false', fecalColiformes: 'false', enterocoque: 'false', parasites: 'false',
    chloreDose: '', chloreType: '', volumeTraite: '', contactTime: '', chloreResiduel: '',
    turbidityAfter: '', pHAfter: '', eColiAfter: 'false'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numericFields = ['turbidity', 'temperature', 'flowRate', 'pH', 'salinity', 
                          'conductivity', 'nitrates', 'nitrites', 'iron', 'manganese',
                          'chloreDose', 'volumeTraite', 'contactTime', 'chloreResiduel',
                          'turbidityAfter', 'pHAfter'];
    
    const analysisData = {
      forageId: selectedForage.id,
      ...formData,
      ...numericFields.reduce((acc, field) => ({
        ...acc,
        [field]: parseFloat(formData[field]) || 0
      }), {}),
      eColi: formData.eColi === 'true',
      fecalColiformes: formData.fecalColiformes === 'true',
      enterocoque: formData.enterocoque === 'true',
      parasites: formData.parasites === 'true',
      eColiAfter: formData.eColiAfter === 'true'
    };

    try {
      await createAnalysis(analysisData);
      setFormData({
        turbidity: '', color: '', odor: '', temperature: '', flowRate: '',
        pH: '', salinity: '', conductivity: '', nitrates: '', nitrites: '', iron: '', manganese: '',
        eColi: 'false', fecalColiformes: 'false', enterocoque: 'false', parasites: 'false',
        chloreDose: '', chloreType: '', volumeTraite: '', contactTime: '', chloreResiduel: '',
        turbidityAfter: '', pHAfter: '', eColiAfter: 'false'
      });
    } catch (error) {
      console.error('Erreur création analyse:', error);
    }
  };

  const handleDelete = async (analysisId) => {
    if (window.confirm('Êtes-vous sûr de supprimer cette analyse ?')) {
      try {
        await deleteAnalysis(analysisId);
      } catch (error) {
        console.error('Erreur suppression:', error);
      }
    }
  };

  if (!selectedForage) return <div className="text-center py-8">Sélectionnez un forage pour voir les analyses</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analyses d'Eau</h1>
        <p className="text-gray-600">Forage: <strong>{selectedForage.name}</strong> ({selectedForage.forageId}) - {selectedForage.location}</p>
      </div>

      <Button onClick={() => setShowAnalysisForm(!showAnalysisForm)} className="bg-green-600 hover:bg-green-700">
        <Plus size={20} className="mr-2" /> Nouvelle Analyse
      </Button>

      <Dialog open={showAnalysisForm} onOpenChange={setShowAnalysisForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nouvelle analyse d'eau</DialogTitle>
            <DialogDescription>Saisissez tous les paramètres de l'analyse</DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <Tabs defaultValue="physique" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="physique">Physiques</TabsTrigger>
                <TabsTrigger value="chimique">Chimiques</TabsTrigger>
                <TabsTrigger value="microbiologique">Microbiologiques</TabsTrigger>
                <TabsTrigger value="traitement">Traitement</TabsTrigger>
              </TabsList>

              <TabsContent value="physique" className="space-y-4 mt-4">
                <Input type="number" step="0.01" placeholder="Turbidité (NTU)" value={formData.turbidity} onChange={(e) => setFormData({...formData, turbidity: e.target.value})} />
                <Input placeholder="Couleur" value={formData.color} onChange={(e) => setFormData({...formData, color: e.target.value})} />
                <Input placeholder="Odeur" value={formData.odor} onChange={(e) => setFormData({...formData, odor: e.target.value})} />
                <Input type="number" step="0.1" placeholder="Température (°C)" value={formData.temperature} onChange={(e) => setFormData({...formData, temperature: e.target.value})} />
                <Input type="number" step="0.1" placeholder="Débit (L/s)" value={formData.flowRate} onChange={(e) => setFormData({...formData, flowRate: e.target.value})} />
              </TabsContent>

              <TabsContent value="chimique" className="space-y-4 mt-4">
                <Input type="number" step="0.1" placeholder="pH" value={formData.pH} onChange={(e) => setFormData({...formData, pH: e.target.value})} />
                <Input type="number" step="0.01" placeholder="Salinité (g/L)" value={formData.salinity} onChange={(e) => setFormData({...formData, salinity: e.target.value})} />
                <Input type="number" step="0.1" placeholder="Conductivité (µS/cm)" value={formData.conductivity} onChange={(e) => setFormData({...formData, conductivity: e.target.value})} />
                <Input type="number" step="0.1" placeholder="Nitrates (mg/L)" value={formData.nitrates} onChange={(e) => setFormData({...formData, nitrates: e.target.value})} />
                <Input type="number" step="0.01" placeholder="Nitrites (mg/L)" value={formData.nitrites} onChange={(e) => setFormData({...formData, nitrites: e.target.value})} />
                <Input type="number" step="0.01" placeholder="Fer (mg/L)" value={formData.iron} onChange={(e) => setFormData({...formData, iron: e.target.value})} />
                <Input type="number" step="0.01" placeholder="Manganèse (mg/L)" value={formData.manganese} onChange={(e) => setFormData({...formData, manganese: e.target.value})} />
              </TabsContent>

              <TabsContent value="microbiologique" className="space-y-4 mt-4">
                <Select value={formData.eColi} onValueChange={(value) => setFormData({...formData, eColi: value})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">E. coli: Non détecté</SelectItem>
                    <SelectItem value="true">E. coli: Détecté</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={formData.fecalColiformes} onValueChange={(value) => setFormData({...formData, fecalColiformes: value})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">Coliformes fécaux: Non</SelectItem>
                    <SelectItem value="true">Coliformes fécaux: Oui</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={formData.enterocoque} onValueChange={(value) => setFormData({...formData, enterocoque: value})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">Entérocoques: Non</SelectItem>
                    <SelectItem value="true">Entérocoques: Oui</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={formData.parasites} onValueChange={(value) => setFormData({...formData, parasites: value})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">Parasites: Non</SelectItem>
                    <SelectItem value="true">Parasites: Oui</SelectItem>
                  </SelectContent>
                </Select>
              </TabsContent>

              <TabsContent value="traitement" className="space-y-4 mt-4">
                <Input type="number" step="0.01" placeholder="Dose de chlore (mg/L)" value={formData.chloreDose} onChange={(e) => setFormData({...formData, chloreDose: e.target.value})} />
                <Input placeholder="Type de chlore" value={formData.chloreType} onChange={(e) => setFormData({...formData, chloreType: e.target.value})} />
                <Input type="number" step="0.1" placeholder="Volume traité (m³)" value={formData.volumeTraite} onChange={(e) => setFormData({...formData, volumeTraite: e.target.value})} />
                <Input type="number" step="0.1" placeholder="Temps de contact (min)" value={formData.contactTime} onChange={(e) => setFormData({...formData, contactTime: e.target.value})} />
                <Input type="number" step="0.01" placeholder="Chlore résiduel (mg/L)" value={formData.chloreResiduel} onChange={(e) => setFormData({...formData, chloreResiduel: e.target.value})} />
                <Input type="number" step="0.01" placeholder="Turbidité après (NTU)" value={formData.turbidityAfter} onChange={(e) => setFormData({...formData, turbidityAfter: e.target.value})} />
                <Input type="number" step="0.1" placeholder="pH après" value={formData.pHAfter} onChange={(e) => setFormData({...formData, pHAfter: e.target.value})} />
                <Select value={formData.eColiAfter} onValueChange={(value) => setFormData({...formData, eColiAfter: value})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">E. coli après: Non</SelectItem>
                    <SelectItem value="true">E. coli après: Oui</SelectItem>
                  </SelectContent>
                </Select>
              </TabsContent>
            </Tabs>

            <Button onClick={handleSubmit} disabled={loading} className="w-full bg-green-600 hover:bg-green-700">
              {loading ? <Loader className="mr-2 animate-spin" size={20} /> : null}
              Analyser et Enregistrer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="space-y-4">
        {analyses.map((analysis, idx) => (
          <Card key={analysis.id} className={`border-l-4 ${analysis.potable ? 'border-green-600' : 'border-red-600'}`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Analyse #{analyses.length - idx}</CardTitle>
                  <CardDescription>{new Date(analysis.analysisDate).toLocaleString('fr-FR')}</CardDescription>
                </div>
                <div className="flex gap-2">
                  {analysis.potable ? (
                    <Badge className="bg-green-600"><CheckCircle size={16} className="mr-1" /> POTABLE</Badge>
                  ) : (
                    <Badge className="bg-red-600"><AlertCircle size={16} className="mr-1" /> NON POTABLE</Badge>
                  )}
                  <Button onClick={() => handleDelete(analysis.id)} variant="ghost" size="sm">
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {!analysis.potable && analysis.reasons?.length > 0 && (
                <Alert className="border-red-600 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertTitle className="text-red-800">Raisons de non-potabilité</AlertTitle>
                  <AlertDescription className="text-red-800">
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      {analysis.reasons.map((reason, i) => <li key={i}>{reason}</li>)}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div className="p-2 bg-blue-50 rounded text-sm"><strong className="text-xs text-gray-600">pH</strong><div className="text-lg font-bold">{parseFloat(analysis.pH).toFixed(1)}</div></div>
                <div className="p-2 bg-blue-50 rounded text-sm"><strong className="text-xs text-gray-600">Turbidité</strong><div className="text-lg font-bold">{parseFloat(analysis.turbidity).toFixed(2)} NTU</div></div>
                <div className="p-2 bg-green-50 rounded text-sm"><strong className="text-xs text-gray-600">Chlore rés.</strong><div className="text-lg font-bold">{parseFloat(analysis.chloreResiduel).toFixed(2)} mg/L</div></div>
                <div className="p-2 bg-purple-50 rounded text-sm"><strong className="text-xs text-gray-600">Température</strong><div className="text-lg font-bold">{parseFloat(analysis.temperature).toFixed(1)}°C</div></div>
                <div className="p-2 bg-orange-50 rounded text-sm"><strong className="text-xs text-gray-600">Nitrates</strong><div className="text-lg font-bold">{parseFloat(analysis.nitrates).toFixed(1)} mg/L</div></div>
                <div className="p-2 bg-orange-50 rounded text-sm"><strong className="text-xs text-gray-600">Salinité</strong><div className="text-lg font-bold">{parseFloat(analysis.salinity).toFixed(2)} g/L</div></div>
                <div className={`p-2 rounded text-sm ${analysis.eColi ? 'bg-red-50' : 'bg-green-50'}`}><strong className="text-xs">E. coli</strong><div className="text-lg">{analysis.eColi ? '❌' : '✓'}</div></div>
                <div className={`p-2 rounded text-sm ${analysis.eColiAfter ? 'bg-red-50' : 'bg-green-50'}`}><strong className="text-xs">E. coli après</strong><div className="text-lg">{analysis.eColiAfter ? '❌' : '✓'}</div></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// App Principal
const WaterQualityApp = () => {
  const { currentPage, setCurrentPage, fetchForages, fetchStats, error, clearError } = useWaterStore();

  const {user , logout} = useUserStore();

  const handleLogout = async (e : any) => {
    e.preventDefault(); 
    await logout(); 
    Navigate('/login')
  }  
  useEffect(() => {
    fetchForages();
    fetchStats();
  }, [fetchForages, fetchStats]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => clearError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  return (
   <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex gap-2">
          <Button onClick={() => setCurrentPage('dashboard')} variant={currentPage === 'dashboard' ? 'default' : 'ghost'}>
            Dashboard
          </Button>
          <Button onClick={() => setCurrentPage('forages')} variant={currentPage === 'forages' ? 'default' : 'ghost'}>
            Forages
          </Button>
          <Button onClick={() => setCurrentPage('analyses')} variant={currentPage === 'analyses' ? 'default' : 'ghost'}>
            Analyses
          </Button>
          <div className="justify-between">
                <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 outline-none">
          <Avatar>
            <AvatarImage src={user?.avatar} alt={user?.first_name} />
            <AvatarFallback>
              {user?.first_name?.[0]}
              {user?.last_name?.[0]}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-xs text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="text-red-600 cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

          </div>
                 </div>
      </nav>

      {error && (
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Alert className="border-red-600 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800">Erreur</AlertTitle>
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'forages' && <ForagesPage />}
        {currentPage === 'analyses' && <AnalysesPage />}
      </div>
    </div>
  );
};

export default WaterQualityApp;