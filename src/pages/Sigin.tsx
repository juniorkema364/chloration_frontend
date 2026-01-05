
import {useState} from "react"
import { Navigate } from "react-router-dom";

import {useUserStore} from "../stores/useUserStore"
export default function Sigin() {
	

	const [formData , setFormData] = useState({
		"first_name" : "" , 
		"last_name" : "" , 
		"email" : "" , 
		"password" : "" , 

	}); 

	const {loading , signup} = useUserStore(); 

	const handleSubmit = (e : any) => {
		e.preventDefault(); 
		signup(formData)
    Navigate('/')
	} 

	return(
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
      
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        
     
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Inscription</h1>
          <p className="text-gray-500 mt-2">
            Entrez vos informations pour continuer
          </p>
        </div>

        {/* Formulaire */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          
          {/* Nom */}
          <div className = "flex gap-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom
            </label>
            <input
              type="text"
              value = {formData.first_name}
              onChange={(e) => setFormData({...formData  , first_name : e.target.value})}
              placeholder="Votre email"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            />
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prenom
            </label>
            <input
              type="text"
              value={formData.last_name}
              onChange={(e) => setFormData({...formData , last_name : e.target.value})}
              placeholder="Votre email"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            />
          </div>

          {/* Prénom */}
           <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData , email : e.target.value})}
              placeholder="Votre prénom"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData , password : e.target.value})}
              placeholder="Votre prénom"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            />
          </div>

          {/* Bouton */}
          <button
        
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition transform hover:scale-[1.02]"
          >
            {loading ? "...Chargement" : "S'inscrire"  }
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          © {new Date().getFullYear()} • Design moderne
        </div>

      </div>
    </div>
		)
	
}