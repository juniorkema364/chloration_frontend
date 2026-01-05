
// src/pages/Dashboard.jsx
import React, { useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Droplet, Activity, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useWaterStore } from '../stores/useUserStore';

export const Dashboard = () => {
  const {
    stats,
    analyses,
    user,
    loading,
    fetchStats,
    fetchForages,
    setCurrentPage
  } = useWaterStore();

  useEffect(() => {
    const loadData = async () => {
      await fetchForages();
      await fetchStats();
    };
    loadData();
  }, [fetchForages, fetchStats]);

  const chartData = analyses
    .slice(0, 10)
    .reverse()
    .map((a, idx) => ({
      name: `Ana. ${idx + 1}`,
      pH: parseFloat(a.pH),
      turbidity: parseFloat(a.turbidity)
    }));

  const pieData = stats
    ? [
        { name: 'Potable', value: stats.potable },
        { name: 'Non potable', value: stats.nonPotable }
      ]
    : [];

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className={`border-l-4 ${color} bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow`}>
      <p className="text-gray-600 text-sm font-medium">{title}</p>
      <div className="flex items-center justify-between mt-3">
        <p className="text-3xl font-bold">{value || 0}</p>
        <Icon className={`h-8 w-8 ${color.replace('border', 'text')}`} />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-3">
          <Loader className="animate-spin text-blue-600" size={48} />
          <p className="text-gray-600 font-medium">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-8 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Droplet size={40} />
            <div>
              <h1 className="text-4xl font-bold">Système de Contrôle de Potabilité</h1>
              <p className="text-blue-100 text-sm">Gestion intelligente de la qualité d'eau de forage</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-blue-100 text-sm">Bienvenue</p>
            <p className="text-2xl font-bold">{user?.firstName} {user?.lastName}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Forages"
          value={stats?.totalForages}
          icon={Droplet}
          color="border-blue-600"
        />
        <StatCard
          title="Eau Potable"
          value={stats?.potable}
          icon={CheckCircle}
          color="border-green-600"
        />
        <StatCard
          title="Non Potable"
          value={stats?.nonPotable}
          icon={AlertCircle}
          color="border-red-600"
        />
        <StatCard
          title="Total Analyses"
          value={stats?.totalAnalyses}
          icon={Activity}
          color="border-purple-600"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart Paramètres */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2">Évolution des Paramètres</h2>
          <p className="text-gray-600 text-sm mb-4">Tendances pH et Turbidité (10 dernières analyses)</p>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem'
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="pH"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="turbidity"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <p>Pas de données disponibles</p>
            </div>
          )}
        </div>

        {/* Chart Potabilité */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2">Distribution Potabilité</h2>
          <p className="text-gray-600 text-sm mb-4">Ratio eau potable vs non potable</p>
          {stats && stats.totalAnalyses > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <p>Pas de données disponibles</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Actions Rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setCurrentPage('forages')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition shadow-md hover:shadow-lg"
          >
            Gérer les Forages
          </button>
          <button
            onClick={() => setCurrentPage('analyses')}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition shadow-md hover:shadow-lg"
          >
            Voir les Analyses
          </button>
        </div>
      </div>
    </div>
  );
};