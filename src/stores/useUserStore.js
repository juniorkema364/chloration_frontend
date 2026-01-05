// // src/store/useWaterStore.js
// import { create } from 'zustand';
// import { devtools, persist } from 'zustand/middleware';
// import axiosClient from '../lib/axios';

// export const useWaterStore = create(
//   devtools(
//     persist(
//       (set, get) => ({
//         // ========== AUTH STATE ==========
//         user: null,
//         token: null,
//         isAuthenticated: false,
//         authLoading: false,
//         authError: null,

//         // ========== UI STATE ==========
//         currentPage: 'dashboard',
//         showForageForm: false,
//         showAnalysisForm: false,

//         // ========== DATA STATE ==========
//         forages: [],
//         analyses: [],
//         selectedForage: null,
//         stats: null,

//         // ========== LOADING & ERROR STATE ==========
//         loading: false,
//         error: null,
//         successMessage: null,

//         // ========== AUTH ACTIONS ==========
//         login: async (email, password) => {
//           set({ authLoading: true, authError: null });
//           try {
//             const response = await axiosClient.post('/auth/login', { email, password });
            
//             localStorage.setItem('token', response.data.token);
//             localStorage.setItem('user', JSON.stringify(response.data.user));

//             set({
//               user: response.data.user,
//               token: response.data.token,
//               isAuthenticated: true,
//               authLoading: false,
//               authError: null
//             });

//             return { success: true, message: 'Connexion réussie' };
//           } catch (error) {
//             const errorMsg = error.message || 'Erreur lors de la connexion';
//             set({ authError: errorMsg, authLoading: false });
//             console.error('Login error:', errorMsg);
//             return { success: false, message: errorMsg };
//           }
//         },

//         register: async (firstName, lastName, email, password, confirmPassword) => {
//           set({ authLoading: true, authError: null });
//           try {
//             if (password !== confirmPassword) {
//               throw new Error('Les mots de passe ne correspondent pas');
//             }
//             if (password.length < 8) {
//               throw new Error('Le mot de passe doit contenir au moins 8 caractères');
//             }

//             const response = await axiosClient.post('/auth/register', {
//               firstName,
//               lastName,
//               email,
//               password,
//               confirmPassword
//             });

//             localStorage.setItem('token', response.data.token);
//             localStorage.setItem('user', JSON.stringify(response.data.user));

//             set({
//               user: response.data.user,
//               token: response.data.token,
//               isAuthenticated: true,
//               authLoading: false,
//               authError: null
//             });

//             return { success: true, message: 'Inscription réussie' };
//           } catch (error) {
//             const errorMsg = error.message || 'Erreur lors de l\'inscription';
//             set({ authError: errorMsg, authLoading: false });
//             console.error('Register error:', errorMsg);
//             return { success: false, message: errorMsg };
//           }
//         },

//         verifyToken: async () => {
//           const token = localStorage.getItem('token');
//           const user = localStorage.getItem('user');

//           if (!token || !user) {
//             set({ isAuthenticated: false });
//             return false;
//           }

//           try {
//             await axiosClient.get('/auth/verify');
//             set({
//               token,
//               user: JSON.parse(user),
//               isAuthenticated: true
//             });
//             return true;
//           } catch (error) {
//             localStorage.removeItem('token');
//             localStorage.removeItem('user');
//             set({ isAuthenticated: false, token: null, user: null });
//             console.error('Token verification failed:', error.message);
//             return false;
//           }
//         },

//         logout: () => {
//           localStorage.removeItem('token');
//           localStorage.removeItem('user');
//           set({
//             user: null,
//             token: null,
//             isAuthenticated: false,
//             forages: [],
//             analyses: [],
//             selectedForage: null,
//             stats: null,
//             currentPage: 'dashboard'
//           });
//         },

//         clearAuthError: () => set({ authError: null }),

//         // ========== UI ACTIONS ==========
//         setCurrentPage: (page) => set({ currentPage: page }),
//         setShowForageForm: (show) => set({ showForageForm: show }),
//         setShowAnalysisForm: (show) => set({ showAnalysisForm: show }),
//         setSelectedForage: (forage) => set({ selectedForage: forage }),
//         clearError: () => set({ error: null }),
//         clearSuccessMessage: () => set({ successMessage: null }),

//         // ========== FORAGE ACTIONS ==========
//         fetchForages: async () => {
//           set({ loading: true, error: null });
//           try {
//             const response = await axiosClient.get('/forages');
//             set({ forages: response.data, loading: false });
//             return { success: true };
//           } catch (error) {
//             const errorMsg = error.message || 'Erreur lors du chargement des forages';
//             set({ error: errorMsg, loading: false });
//             console.error('Fetch forages error:', errorMsg);
//             return { success: false, message: errorMsg };
//           }
//         },

//         createForage: async (forageData) => {
//           set({ loading: true, error: null });
//           try {
//             const response = await axiosClient.post('/forages', {
//               ...forageData,
//               depth: parseFloat(forageData.depth),
//               serviceDate: new Date(forageData.serviceDate)
//             });

//             set((state) => ({
//               forages: [...state.forages, response.data],
//               showForageForm: false,
//               loading: false,
//               successMessage: 'Forage créé avec succès'
//             }));

//             setTimeout(() => set({ successMessage: null }), 3000);
//             return { success: true, message: 'Forage créé avec succès' };
//           } catch (error) {
//             const errorMsg = error.message || 'Erreur lors de la création du forage';
//             set({ error: errorMsg, loading: false });
//             console.error('Create forage error:', errorMsg);
//             return { success: false, message: errorMsg };
//           }
//         },

//         deleteForage: async (forageId) => {
//           set({ loading: true, error: null });
//           try {
//             await axiosClient.delete(`/forages/${forageId}`);
            
//             set((state) => ({
//               forages: state.forages.filter(f => f.id !== forageId),
//               selectedForage: state.selectedForage?.id === forageId ? null : state.selectedForage,
//               loading: false,
//               successMessage: 'Forage supprimé avec succès'
//             }));

//             await get().fetchStats();
//             setTimeout(() => set({ successMessage: null }), 3000);
//             return { success: true, message: 'Forage supprimé' };
//           } catch (error) {
//             const errorMsg = error.message || 'Erreur lors de la suppression du forage';
//             set({ error: errorMsg, loading: false });
//             console.error('Delete forage error:', errorMsg);
//             return { success: false, message: errorMsg };
//           }
//         },

//         // ========== ANALYSIS ACTIONS ==========
//         fetchAnalyses: async (forageId) => {
//           set({ loading: true, error: null });
//           try {
//             const response = await axiosClient.get(`/analyses/${forageId}`);
//             set({ analyses: response.data, loading: false });
//             return { success: true };
//           } catch (error) {
//             const errorMsg = error.message || 'Erreur lors du chargement des analyses';
//             set({ error: errorMsg, loading: false });
//             console.error('Fetch analyses error:', errorMsg);
//             return { success: false, message: errorMsg };
//           }
//         },

//         createAnalysis: async (analysisData) => {
//           set({ loading: true, error: null });
//           try {
//             const response = await axiosClient.post('/analyses', analysisData);

//             set((state) => ({
//               analyses: [...state.analyses, response.data],
//               showAnalysisForm: false,
//               loading: false,
//               successMessage: `Analyse créée - Statut: ${response.data.potable ? 'POTABLE ✓' : 'NON POTABLE ✗'}`
//             }));

//             await get().fetchStats();
//             setTimeout(() => set({ successMessage: null }), 4000);
//             return { success: true, message: 'Analyse créée avec succès' };
//           } catch (error) {
//             const errorMsg = error.message || 'Erreur lors de la création de l\'analyse';
//             set({ error: errorMsg, loading: false });
//             console.error('Create analysis error:', errorMsg);
//             return { success: false, message: errorMsg };
//           }
//         },

//         deleteAnalysis: async (analysisId) => {
//           set({ loading: true, error: null });
//           try {
//             await axiosClient.delete(`/analyses/${analysisId}`);
            
//             set((state) => ({
//               analyses: state.analyses.filter(a => a.id !== analysisId),
//               loading: false,
//               successMessage: 'Analyse supprimée avec succès'
//             }));

//             await get().fetchStats();
//             setTimeout(() => set({ successMessage: null }), 3000);
//             return { success: true, message: 'Analyse supprimée' };
//           } catch (error) {
//             const errorMsg = error.message || 'Erreur lors de la suppression de l\'analyse';
//             set({ error: errorMsg, loading: false });
//             console.error('Delete analysis error:', errorMsg);
//             return { success: false, message: errorMsg };
//           }
//         },

//         // ========== STATS ACTIONS ==========
//         fetchStats: async () => {
//           try {
//             const response = await axiosClient.get('/dashboard-stats');
//             set({ stats: response.data });
//             return { success: true };
//           } catch (error) {
//             console.error('Fetch stats error:', error.message);
//             return { success: false };
//           }
//         }
//       }),
//       {
//         name: 'water-store',
//         partialize: (state) => ({
//           user: state.user,
//           token: state.token,
//           isAuthenticated: state.isAuthenticated,
//           currentPage: state.currentPage
//         })
//       }
//     ),
//     { name: 'WaterStore' }
//   )
// );// import { create } from "zustand";
// // import axios from "../lib/axios";
// // import { devtools, persist } from 'zustand/middleware';

// // import { toast } from "react-hot-toast";

// // export const useUserStore = create((set, get) => ({
// // 	user: null,
// // 	loading: false,
// // 	checkingAuth: true,

// // 	signup: async ({ first_name , last_name, email, password }) => {
// // 		set({ loading: true });

		 
// // 		try {
// // 			const res = await axios.post("/register", { first_name , last_name, email, password });
// // 			set({ user: res.data, loading: false });
// // 			toast.succes(res.data.message)
// // 		} catch (error) {
// // 			set({ loading: false });
// // 			console.error("Erreur console " , error)
// // 			toast.error(
// // 				  error.response?.data?.message ??
// // 				  error.response?.data?.error ??
// // 				  'Une erreur vient de survenir'
// // 				)

// // 		}
// // 	},
// // 	login: async ({email , password}) => {
// // 		set({ loading: true });

// // 		try {
// // 			const res = await axios.post("/login", { email, password } , {withCredentials : true });

// // 			set({ user: res.data, loading: false });
// // 			toast.success(res.data.message)
// // 		} catch (error) {
// // 			set({ loading: false });
// // 			console.error(error)
// // 			toast.error(error.response?.data?.error ?? error.response?.data?.message ?? "Une erreur vient de survenir")
// // 		}
// // 	},

// // 	logout: async () => {
// // 		try {
// // 			await axios.post("/logout");
// // 			set({ user: null });
// // 		} catch (error) {
// // 			toast.error(error.response?.data?.message || "An error occurred during logout");
// // 		}
// // 	},

// // 	checkAuth: async () => {
// // 		set({ checkingAuth: true });
// // 		try {
// // 			const response = await axios.get("/profile" , {
// //         withCredentials : true , 
// //       });
// // 			set({ user: response.data, checkingAuth: false });
// // 		} catch (error) {
// // 			console.log(error.message);
// // 			set({ checkingAuth: false, user: null });
// // 		}
// // 	},

// // 	refreshToken: async () => {
// // 		// Prevent multiple simultaneous refresh attempts
// // 		if (get().checkingAuth) return;

// // 		set({ checkingAuth: true });
// // 		try {
// // 			const response = await axios.post("/refresh-token");
// // 			set({ checkingAuth: false });
// // 			return response.data;
// // 		} catch (error) {
// // 			set({ user: null, checkingAuth: false });
// // 			throw error;
// // 		}
// // 	},
// // }));

 

 

 
// // export const useWaterStore = create(
// //   devtools(
// //     persist(
// //       (set, get) => ({
// //         // État
// //         currentPage: 'dashboard',
// //         forages: [],
// //         analyses: [],
// //         selectedForage: null,
// //         showForageForm: false,
// //         showAnalysisForm: false,
// //         stats: null,
// //         loading: false,
// //         error: null,

// //         // Actions de navigation
// //         setCurrentPage: (page) => set({ currentPage: page }),
// //         setShowForageForm: (show) => set({ showForageForm: show }),
// //         setShowAnalysisForm: (show) => set({ showAnalysisForm: show }),
// //         setSelectedForage: (forage) => set({ selectedForage: forage }),

// //         // Récupérer tous les forages
// //         fetchForages: async () => {
// //           set({ loading: true, error: null });
// //           try {
// //             const response = await axios.get(`/forages`);
// //             set({ forages: response.data, loading: false });
// //           } catch (error) {
// //             set({ error: error.message, loading: false });
// //           }
// //         },

// //         // Créer un forage
// //         createForage: async (forageData) => {
// //           set({ loading: true, error: null });
// //           try {
// //             const response = await axios.post(`/forages`, {
// //               ...forageData,
// //               depth: parseFloat(forageData.depth),
// //               serviceDate: new Date(forageData.serviceDate)
// //             });
            
// //             const forages = get().forages;
// //             set({ 
// //               forages: [...forages, response.data],
// //               showForageForm: false,
// //               loading: false 
// //             });
// //             return response.data;
// //           } catch (error) {
// //             set({ error: error.message, loading: false });
// //             throw error;
// //           }
// //         },

// //         // Récupérer les analyses d'un forage
// //         fetchAnalyses: async (forageId) => {
// //           set({ loading: true, error: null });
// //           try {
// //             const response = await axios.get(`/analyses/${forageId}`);
// //             set({ analyses: response.data, loading: false });
// //           } catch (error) {
// //             set({ error: error.message, loading: false });
// //           }
// //         },

// //         // Créer une analyse
// //         createAnalysis: async (analysisData) => {
// //           set({ loading: true, error: null });
// //           try {
// //             const response = await axios.post(`/analyses`, analysisData);
            
// //             const analyses = get().analyses;
// //             set({ 
// //               analyses: [...analyses, response.data],
// //               showAnalysisForm: false,
// //               loading: false 
// //             });
            
// //             // Rafraîchir les stats
// //             get().fetchStats();
            
// //             return response.data;
// //           } catch (error) {
// //             set({ error: error.message, loading: false });
// //             throw error;
// //           }
// //         },

// //         // Récupérer les statistiques
// //         fetchStats: async () => {
// //           try {
// //             const response = await axios.get(`/dashboard-stats`);
// //             set({ stats: response.data });
// //           } catch (error) {
// //             set({ error: error.message });
// //           }
// //         },

// //         // Supprimer un forage
// //         deleteForage: async (forageId) => {
// //           set({ loading: true, error: null });
// //           try {
// //             await axios.delete(`/forages/${forageId}`);
// //             const forages = get().forages.filter(f => f.id !== forageId);
// //             set({ forages, loading: false });
// //             get().fetchStats();
// //           } catch (error) {
// //             set({ error: error.message, loading: false });
// //             throw error;
// //           }
// //         },

// //         // Supprimer une analyse
// //         deleteAnalysis: async (analysisId) => {
// //           set({ loading: true, error: null });
// //           try {
// //             await axios.delete(`/analyses/${analysisId}`);
// //             const analyses = get().analyses.filter(a => a.id !== analysisId);
// //             set({ analyses, loading: false });
// //             get().fetchStats();
// //           } catch (error) {
// //             set({ error: error.message, loading: false });
// //             throw error;
// //           }
// //         },

// //         // Effacer l'erreur
// //         clearError: () => set({ error: null })
// //       }),
// //       {
// //         name: 'water-store',
// //         partialize: (state) => ({
// //           currentPage: state.currentPage,
// //           selectedForage: state.selectedForage
// //         })
// //       }
// //     ),
// //     { name: 'WaterStore' }
// //   )
// // );
// // // TODO: Implement the axios interceptors for refreshing access token

// // // Axios interceptor for token refresh
// // let refreshPromise = null;

// // axios.interceptors.response.use(
// // 	(response) => response,
// // 	async (error) => {
// // 		const originalRequest = error.config;
// // 		if (error.response?.status === 401 && !originalRequest._retry) {
// // 			originalRequest._retry = true;

// // 			try {
// // 				// If a refresh is already in progress, wait for it to complete
// // 				if (refreshPromise) {
// // 					await refreshPromise;
// // 					return axios(originalRequest);
// // 				}

// // 				// Start a new refresh process
// // 				refreshPromise = useUserStore.getState().refreshToken();
// // 				await refreshPromise;
// // 				refreshPromise = null;

// // 				return axios(originalRequest);
// // 			} catch (refreshError) {
// // 				// If refresh fails, redirect to login or handle as needed
// // 				useUserStore.getState().logout();
// // 				return Promise.reject(refreshError);
// // 			}
// // 		}
// // 		return Promise.reject(error);
// // 	}
// // );
// // src/store/useWaterStore.js
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import axiosClient from '../lib/axios';

export const useWaterStore = create(
  devtools(
    persist(
      (set, get) => ({
        // ========== AUTH STATE ==========
        user: null,
        token: null,
        isAuthenticated: false,
        authLoading: false,
        authError: null,

        // ========== UI STATE ==========
        currentPage: 'dashboard',
        showForageForm: false,
        showAnalysisForm: false,

        // ========== DATA STATE ==========
        forages: [],
        analyses: [],
        selectedForage: null,
        stats: null,

        // ========== LOADING & ERROR STATE ==========
        loading: false,
        error: null,
        successMessage: null,

        // ========== AUTH ACTIONS ==========
        login: async (email, password) => {
          set({ authLoading: true, authError: null });
          try {
            const response = await axiosClient.post('/auth/login', { email, password });
            
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            set({
              user: response.data.user,
              token: response.data.token,
              isAuthenticated: true,
              authLoading: false,
              authError: null
            });

            return { success: true, message: 'Connexion réussie' };
          } catch (error) {
            const errorMsg = error.message || 'Erreur lors de la connexion';
            set({ authError: errorMsg, authLoading: false });
            console.error('Login error:', errorMsg);
            return { success: false, message: errorMsg };
          }
        },

        register: async (firstName, lastName, email, password, confirmPassword) => {
          set({ authLoading: true, authError: null });
          try {
            if (password !== confirmPassword) {
              throw new Error('Les mots de passe ne correspondent pas');
            }
            if (password.length < 8) {
              throw new Error('Le mot de passe doit contenir au moins 8 caractères');
            }

            const response = await axiosClient.post('/auth/register', {
              firstName,
              lastName,
              email,
              password,
              confirmPassword
            });

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            set({
              user: response.data.user,
              token: response.data.token,
              isAuthenticated: true,
              authLoading: false,
              authError: null
            });

            return { success: true, message: 'Inscription réussie' };
          } catch (error) {
            const errorMsg = error.message || 'Erreur lors de l\'inscription';
            set({ authError: errorMsg, authLoading: false });
            console.error('Register error:', errorMsg);
            return { success: false, message: errorMsg };
          }
        },

        verifyToken: async () => {
          const token = localStorage.getItem('token');
          const user = localStorage.getItem('user');

          if (!token || !user) {
            set({ isAuthenticated: false });
            return false;
          }

          try {
            await axiosClient.get('/auth/verify');
            set({
              token,
              user: JSON.parse(user),
              isAuthenticated: true
            });
            return true;
          } catch (error) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            set({ isAuthenticated: false, token: null, user: null });
            console.error('Token verification failed:', error.message);
            return false;
          }
        },

        logout: () => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            forages: [],
            analyses: [],
            selectedForage: null,
            stats: null,
            currentPage: 'dashboard'
          });
        },

        clearAuthError: () => set({ authError: null }),

        // ========== UI ACTIONS ==========
        setCurrentPage: (page) => set({ currentPage: page }),
        setShowForageForm: (show) => set({ showForageForm: show }),
        setShowAnalysisForm: (show) => set({ showAnalysisForm: show }),
        setSelectedForage: (forage) => set({ selectedForage: forage }),
        clearError: () => set({ error: null }),
        clearSuccessMessage: () => set({ successMessage: null }),

        // ========== FORAGE ACTIONS ==========
        fetchForages: async () => {
          set({ loading: true, error: null });
          try {
            const response = await axiosClient.get('/forages');
            set({ forages: response.data, loading: false });
            return { success: true };
          } catch (error) {
            const errorMsg = error.message || 'Erreur lors du chargement des forages';
            set({ error: errorMsg, loading: false });
            console.error('Fetch forages error:', errorMsg);
            return { success: false, message: errorMsg };
          }
        },

        createForage: async (forageData) => {
          set({ loading: true, error: null });
          try {
            const response = await axiosClient.post('/forages', {
              ...forageData,
              depth: parseFloat(forageData.depth),
              serviceDate: new Date(forageData.serviceDate)
            });

            set((state) => ({
              forages: [...state.forages, response.data],
              showForageForm: false,
              loading: false,
              successMessage: 'Forage créé avec succès'
            }));

            setTimeout(() => set({ successMessage: null }), 3000);
            return { success: true, message: 'Forage créé avec succès' };
          } catch (error) {
            const errorMsg = error.message || 'Erreur lors de la création du forage';
            set({ error: errorMsg, loading: false });
            console.error('Create forage error:', errorMsg);
            console.error('Erreur lors de la creation de forages' , error )
            return { success: false, message: errorMsg };
          }
        },

        deleteForage: async (forageId) => {
          set({ loading: true, error: null });
          try {
            await axiosClient.delete(`/forages/${forageId}`);
            
            set((state) => ({
              forages: state.forages.filter(f => f.id !== forageId),
              selectedForage: state.selectedForage?.id === forageId ? null : state.selectedForage,
              loading: false,
              successMessage: 'Forage supprimé avec succès'
            }));

            await get().fetchStats();
            setTimeout(() => set({ successMessage: null }), 3000);
            return { success: true, message: 'Forage supprimé' };
          } catch (error) {
            const errorMsg = error.message || 'Erreur lors de la suppression du forage';
            set({ error: errorMsg, loading: false });
            console.error('Delete forage error:', errorMsg);
            return { success: false, message: errorMsg };
          }
        },

        // ========== ANALYSIS ACTIONS ==========
        fetchAnalyses: async (forageId) => {
          set({ loading: true, error: null });
          try {
            const response = await axiosClient.get(`/analyses/${forageId}`);
            set({ analyses: response.data, loading: false });
            return { success: true };
          } catch (error) {
            const errorMsg = error.message || 'Erreur lors du chargement des analyses';
            set({ error: errorMsg, loading: false });
            console.error('Fetch analyses error:', errorMsg);
            return { success: false, message: errorMsg };
          }
        },

        createAnalysis: async (analysisData) => {
          set({ loading: true, error: null });
          try {
            const response = await axiosClient.post('/analyses', analysisData);

            set((state) => ({
              analyses: [...state.analyses, response.data],
              showAnalysisForm: false,
              loading: false,
              successMessage: `Analyse créée - Statut: ${response.data.potable ? 'POTABLE ✓' : 'NON POTABLE ✗'}`
            }));

            await get().fetchStats();
            setTimeout(() => set({ successMessage: null }), 4000);
            return { success: true, message: 'Analyse créée avec succès' };
          } catch (error) {
            const errorMsg = error.message || 'Erreur lors de la création de l\'analyse';
            set({ error: errorMsg, loading: false });
            console.error('Create analysis error:', errorMsg);
            return { success: false, message: errorMsg };
          }
        },

        deleteAnalysis: async (analysisId) => {
          set({ loading: true, error: null });
          try {
            await axiosClient.delete(`/analyses/${analysisId}`);
            
            set((state) => ({
              analyses: state.analyses.filter(a => a.id !== analysisId),
              loading: false,
              successMessage: 'Analyse supprimée avec succès'
            }));

            await get().fetchStats();
            setTimeout(() => set({ successMessage: null }), 3000);
            return { success: true, message: 'Analyse supprimée' };
          } catch (error) {
            const errorMsg = error.message || 'Erreur lors de la suppression de l\'analyse';
            set({ error: errorMsg, loading: false });
            console.error('Delete analysis error:', errorMsg);
            return { success: false, message: errorMsg };
          }
        },

        // ========== STATS ACTIONS ==========
        fetchStats: async () => {
          try {
            const response = await axiosClient.get('/dashboard-stats');
            set({ stats: response.data });
            return { success: true };
          } catch (error) {
            console.error('Fetch stats error:', error.message);
            return { success: false };
          }
        }
      }),
      {
        name: 'water-store',
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
          currentPage: state.currentPage
        })
      }
    ),
    { name: 'WaterStore' }
  )
);


