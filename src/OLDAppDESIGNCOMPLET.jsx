import React, { useState, useEffect } from "react";

// ==========================================
// 0. NOS FAUSSES DONNÉES (Pour tester l'affichage)
// ==========================================
const FAUSSE_BDD = [
  { exerciseId: "m1", name: "Traction (Pull-up)", target: "Dos", gifUrl: "https://placehold.co/400x300?text=Traction" },
  { exerciseId: "m2", name: "Développé Couché", target: "Pectoraux", gifUrl: "https://placehold.co/400x300?text=Dev+Couche" },
  { exerciseId: "m3", name: "Squat", target: "Jambes", gifUrl: "https://placehold.co/400x300?text=Squat" },
  { exerciseId: "m4", name: "Curl Biceps", target: "Bras", gifUrl: "https://placehold.co/400x300?text=Curl" }
];


// ==========================================
// 1. VUE ACCUEIL (Catalogue)
// ==========================================
// Notez qu'elle reçoit "panier" et "ajouterAuPanier" de son parent (App)
const VueAccueil = ({ panier, ajouterAuPanier }) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Catalogue des Exercices</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {FAUSSE_BDD.map((exo) => {
          // On vérifie si l'exercice est déjà dans le panier
          const estDejaAjoute = panier.some(p => p.exerciseId === exo.exerciseId);

          return (
            <div key={exo.exerciseId} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <img src={exo.gifUrl} alt={exo.name} className="w-full h-40 object-cover bg-gray-50" />
              <div className="p-4">
                <h3 className="font-bold text-lg">{exo.name}</h3>
                <p className="text-gray-500 text-sm mb-4">Cible : {exo.target}</p>
                
                <button 
                  onClick={() => ajouterAuPanier(exo)}
                  disabled={estDejaAjoute}
                  className={`w-full py-2 rounded font-bold transition-colors ${
                    estDejaAjoute 
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {estDejaAjoute ? "✓ Dans la séance" : "+ Ajouter"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


// ==========================================
// 2. VUE CRÉATION DE SÉANCE (Le Panier)
// ==========================================
const VueSeance = ({ panier, setPanier, changerVue }) => {
  const [nomSeance, setNomSeance] = useState("");
  // On crée une copie du panier qu'on peut modifier localement avec séries/reps
  const [exercicesAConfigurer, setExercicesAConfigurer] = useState(
    panier.map(exo => ({ ...exo, series: 3, reps: 10 }))
  );

  const mettreAJourParametre = (id, champ, valeur) => {
    setExercicesAConfigurer(prev => prev.map(exo => 
      exo.exerciseId === id ? { ...exo, [champ]: valeur } : exo
    ));
  };

  const sauvegarderSeance = () => {
    if (!nomSeance) return alert("Veuillez entrer un nom de séance !");
    
    const nouvelleSeance = {
      id: Date.now(),
      nom: nomSeance,
      date: new Date().toLocaleDateString(),
      exercices: exercicesAConfigurer
    };

    // 1. On récupère les anciens programmes (ou un tableau vide)
    const historique = JSON.parse(localStorage.getItem("mes_programmes")) || [];
    // 2. On ajoute le nouveau
    historique.push(nouvelleSeance);
    // 3. On sauvegarde le tout
    localStorage.setItem("mes_programmes", JSON.stringify(historique));

    // On vide le panier et on redirige vers l'historique
    setPanier([]);
    changerVue("programmes");
  };

  if (panier.length === 0) {
    return (
      <div className="p-10 text-center text-gray-500">
        <h2 className="text-2xl mb-4">Votre séance est vide</h2>
        <button onClick={() => changerVue("accueil")} className="text-blue-600 underline">
          Retourner au catalogue pour ajouter des exercices
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Configurer ma Séance</h2>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
        <label className="block font-bold mb-2">Nom de la Séance :</label>
        <input 
          type="text" 
          value={nomSeance}
          onChange={(e) => setNomSeance(e.target.value)}
          placeholder="Ex: Pectoraux / Triceps" 
          className="w-full p-3 border rounded-lg bg-gray-50"
        />
      </div>

      <div className="space-y-4 mb-8">
        {exercicesAConfigurer.map(exo => (
          <div key={exo.exerciseId} className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="font-bold">{exo.name}</div>
            <div className="flex gap-4">
              <label className="flex flex-col text-sm text-gray-600">
                Séries
                <input type="number" min="1" value={exo.series} onChange={(e) => mettreAJourParametre(exo.exerciseId, "series", e.target.value)} className="w-16 p-1 border rounded mt-1 text-center" />
              </label>
              <label className="flex flex-col text-sm text-gray-600">
                Reps
                <input type="number" min="1" value={exo.reps} onChange={(e) => mettreAJourParametre(exo.exerciseId, "reps", e.target.value)} className="w-16 p-1 border rounded mt-1 text-center" />
              </label>
            </div>
          </div>
        ))}
      </div>

      <button onClick={sauvegarderSeance} className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-lg transition-colors">
        💾 Sauvegarder ce Programme
      </button>
    </div>
  );
};


// ==========================================
// 3. VUE MES PROGRAMMES (Historique)
// ==========================================
const VueProgrammes = () => {
  const [programmes, setProgrammes] = useState([]);

  // On lit le localStorage quand la vue s'affiche
  useEffect(() => {
    const historique = JSON.parse(localStorage.getItem("mes_programmes")) || [];
    setProgrammes(historique);
  }, []);

  const supprimerProgramme = (id) => {
    const nouveauTableau = programmes.filter(p => p.id !== id);
    setProgrammes(nouveauTableau);
    localStorage.setItem("mes_programmes", JSON.stringify(nouveauTableau));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Mes Programmes Sauvegardés</h2>
      
      {programmes.length === 0 ? (
        <p className="text-gray-500 text-center py-10">Aucun programme sauvegardé pour le moment.</p>
      ) : (
        <div className="grid gap-6">
          {programmes.map(prog => (
            <div key={prog.id} className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{prog.nom}</h3>
                  <span className="text-sm text-gray-500">Créé le {prog.date}</span>
                </div>
                <button onClick={() => supprimerProgramme(prog.id)} className="text-red-500 hover:text-red-700 p-2">
                  🗑️
                </button>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-gray-700 mb-2">{prog.exercices.length} Exercices :</p>
                <ul className="list-disc pl-5 text-gray-600 text-sm">
                  {prog.exercices.map(exo => (
                    <li key={exo.exerciseId}>
                      {exo.name} - {exo.series} séries de {exo.reps} reps
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


// ==========================================
// 4. LE COMPOSANT PRINCIPAL (App / Routeur)
// ==========================================
export default function App() {
  // L'état qui gère l'onglet actif
  const [vueActive, setVueActive] = useState("accueil");
  
  // L'état qui gère le panier (Placé ici pour survivre aux changements d'onglets !)
  const [panier, setPanier] = useState([]);

  const ajouterAuPanier = (exercice) => {
    setPanier([...panier, exercice]);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans pb-10">
      
      {/* NAVBAR */}
      <nav className="bg-gray-900 text-white p-4 shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-extrabold text-blue-400">Fit-Track</h1>
          
          <div className="flex gap-2 sm:gap-4">
            <button 
              onClick={() => setVueActive("accueil")}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${vueActive === "accueil" ? "bg-blue-600" : "hover:bg-gray-800"}`}
            >
              Accueil
            </button>
            <button 
              onClick={() => setVueActive("seance")}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${vueActive === "seance" ? "bg-blue-600" : "hover:bg-gray-800"}`}
            >
              Ma Séance
              {panier.length > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{panier.length}</span>
              )}
            </button>
            <button 
              onClick={() => setVueActive("programmes")}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${vueActive === "programmes" ? "bg-blue-600" : "hover:bg-gray-800"}`}
            >
              Mes Programmes
            </button>
          </div>
        </div>
      </nav>

      {/* ROUTEUR DYNAMIQUE */}
      <main className="max-w-6xl mx-auto mt-6">
        {vueActive === "accueil" && (
          <VueAccueil panier={panier} ajouterAuPanier={ajouterAuPanier} />
        )}
        
        {vueActive === "seance" && (
          <VueSeance panier={panier} setPanier={setPanier} changerVue={setVueActive} />
        )}
        
        {vueActive === "programmes" && (
          <VueProgrammes />
        )}
      </main>

    </div>
  );
}