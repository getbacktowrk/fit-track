import React, { useState } from "react";
import { Authenticator, View, Heading, Text, useTheme } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css'; 

import VueSeance from "./views/VueSeance";
import VueProgrammes from "./views/VueProgrammes";
import VueAccueil from "./views/VueAccueil";
import VueStats from "./views/VueStats";
import VueSeanceExecutionLive from "./views/VueSeanceExecutionLive"; 

const styleBoutonNav = { padding: "10px 15px", cursor: "pointer", fontWeight: "bold", border: "none", borderRadius: "8px", backgroundColor: "transparent", color: "#d1d5db" };
const styleBoutonNavActif = { ...styleBoutonNav, backgroundColor: "#3b82f6", color: "white" };

// --- 1. AJOUT DES COMPOSANTS PERSONNALISÉS POUR LA PAGE DE CONNEXION ---
const formComponents = {
  Header() {
    return (
      <View textAlign="center" padding="2rem">
        {/* On utilise directement le code couleur HTML #ff5722 */}
        <Heading level={2} color="#0f1118" fontWeight="bold">
          Fit-Track 💪
        </Heading>
        <Text fontSize="1.1rem" marginTop="0.5rem" color="#555">
          Dépasse tes limites. <br/> Enregistre chaque séance.
        </Text>
      </View>
    );
  },
  Footer() {
    return (
      <View textAlign="center" padding="1.5rem">
        <Text color="#888" fontSize="0.9rem">
          &copy; 2026 Fit-Track - Ce n'est que le début !
        </Text>
      </View>
    );
  }
};
// -----------------------------------------------------------------------

export default function App() {
  const [vueActive, setVueActive] = useState("accueil");
  const [panier, setPanier] = useState([]);
  const [seanceEnCours, setSeanceEnCours] = useState(null);

  const ajouterAuPanier = (exerciceClique) => {
    setPanier([...panier, {...exerciceClique, series: 4, reps: 12}]);
  };

  const modifierExoPanier = (id, nouvellesSeries, nouvellesReps) => {
    setPanier(panier.map(exo =>
        exo.id === id ? {...exo, series: nouvellesSeries, reps: nouvellesReps} : exo
    ));
  };

  return (
    // --- 2. ON INJECTE LE DESIGN ICI (components={formComponents}) ---
    <Authenticator components={formComponents}>
      {({ signOut, user }) => (
        <>
          {/* L'AFFICHAGE 75/25 S'AFFICHE ICI S'IL Y A UNE SÉANCE */}
          {seanceEnCours && (
            <VueSeanceExecutionLive 
              seance={seanceEnCours} 
              onTerminer={() => {
                setSeanceEnCours(null);
                setVueActive("stats"); 
              }}
              onAbandonner={() => setSeanceEnCours(null)}
            />
          )}

          <div style={{ fontFamily: "sans-serif", maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>
            <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 30px", backgroundColor: "#1f2937", color: "white", borderRadius: "10px", marginBottom: "30px" }}>
              <h1 style={{ margin: 0, fontSize: "24px" }}>FIT TRACK</h1>
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => setVueActive("accueil")} style={vueActive === "accueil" ? styleBoutonNavActif : styleBoutonNav}>Accueil</button>
                <button onClick={() => setVueActive("seance")} style={vueActive === "seance" ? styleBoutonNavActif : styleBoutonNav}>+ Créer</button>
                <button onClick={() => setVueActive("programmes")} style={vueActive === "programmes" ? styleBoutonNavActif : styleBoutonNav}>Programmes</button>
                <button onClick={() => setVueActive("stats")} style={vueActive === "stats" ? styleBoutonNavActif : styleBoutonNav}>Stats</button>
                
                {/* TON BOUTON DÉCONNEXION FONCTIONNE TOUJOURS */}
                <button onClick={signOut} style={{ ...styleBoutonNav, backgroundColor: "#ef4444", color: "white" }}>Déconnexion</button>
              </div>
            </nav>

            <main>
              {vueActive === "accueil" && <VueAccueil panier={panier} ajouterAuPanier={ajouterAuPanier} />}
              {vueActive === "seance" && <VueSeance panier={panier} modifierExoPanier={modifierExoPanier} viderPanier={() => setPanier([])} />}
              
              {/* BRANCHEMENT FINAL */}
              {vueActive === "programmes" && (
                <VueProgrammes onLancerSeance={(prog) => setSeanceEnCours(prog)} />
              )}
              
              {vueActive === "stats" && <VueStats />}
            </main>
          </div>
        </>
      )}
    </Authenticator>
  );
}