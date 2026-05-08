import React, { useState } from "react";

const styleCadreGlobal = { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", padding: "20px", boxSizing: "border-box", fontFamily: "sans-serif" };
const styleBoiteConnexion = { backgroundColor: "white", padding: "40px", borderRadius: "12px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", width: "100%", maxWidth: "400px", border: "1px solid #e5e7eb" };
const styleTitre = { margin: "0 0 25px 0", color: "#1f2937", textAlign: "center", fontSize: "24px" };
const styleInput = { width: "100%", padding: "12px", marginBottom: "15px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "16px", boxSizing: "border-box", outline: "none" };
const styleBoutonPrincipal = { width: "100%", padding: "14px", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "8px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", transition: "background-color 0.2s" };
const styleTexteBascule = { textAlign: "center", marginTop: "20px", fontSize: "14px", color: "#6b7280" };
const styleLien = { color: "#3b82f6", cursor: "pointer", fontWeight: "bold", textDecoration: "underline" };

export default function VueLogin({ onLoginReussi }) {
    // État pour savoir si on affiche le formulaire de Connexion ou d'Inscription
    const [estModeInscription, setEstModeInscription] = useState(false);
    
    // États pour les champs du formulaire
    const [email, setEmail] = useState("");
    const [motDePasse, setMotDePasse] = useState("");
    const [erreur, setErreur] = useState("");

    // Fonction simulée pour la soumission du formulaire
    const gererSoumission = (e) => {
        e.preventDefault(); // Empêche la page de se recharger
        setErreur("");

        if (!email || !motDePasse) {
            setErreur("Veuillez remplir tous les champs.");
            return;
        }

        if (motDePasse.length < 6) {
            setErreur("Le mot de passe doit contenir au moins 6 caractères.");
            return;
        }

        // 🚨 POUR L'INSTANT : C'est une fausse connexion !
        // Plus tard, c'est ici qu'on appellera AWS Amplify (Auth.signIn ou Auth.signUp)
        console.log(`Tentative de ${estModeInscription ? 'Création de compte' : 'Connexion'} avec :`, email);
        
        // On simule une réussite immédiate et on prévient le composant parent (App.jsx)
        onLoginReussi({ email: email, id: "user-123" });
    };

    return (
        <div style={styleCadreGlobal}>
            
            
            <div style={styleBoiteConnexion}>

                <h1 style={{ margin: 0, fontSize: "48px", color: "#1c2855", textAlign:"center" }}>FIT TRACK</h1>
                
                
                <h2 style={styleTitre}>
                    {estModeInscription ? "Créer un compte 🏋️‍♀️" : "Bon retour ! 💪"}
                </h2>

                {/* Affichage des messages d'erreur */}
                {erreur && (
                    <div style={{ backgroundColor: "#fee2e2", color: "#ef4444", padding: "10px", borderRadius: "6px", marginBottom: "15px", fontSize: "14px", textAlign: "center", border: "1px solid #fca5a5" }}>
                        {erreur}
                    </div>
                )}

                <form onSubmit={gererSoumission}>
                    <input 
                        type="email" 
                        placeholder="Adresse email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styleInput}
                    />
                    
                    <input 
                        type="password" 
                        placeholder="Mot de passe" 
                        value={motDePasse}
                        onChange={(e) => setMotDePasse(e.target.value)}
                        style={styleInput}
                    />

                    <button 
                        type="submit" 
                        style={styleBoutonPrincipal}
                        onMouseOver={(e) => e.target.style.backgroundColor = "#2563eb"}
                        onMouseOut={(e) => e.target.style.backgroundColor = "#3b82f6"}
                    >
                        {estModeInscription ? "M'inscrire" : "Se connecter"}
                    </button>
                </form>

                {/* Bascule Connexion <-> Inscription */}
                <div style={styleTexteBascule}>
                    {estModeInscription ? (
                        <>Déjà un compte ? <span style={styleLien} onClick={() => setEstModeInscription(false)}>Connectez-vous</span></>
                    ) : (
                        <>Pas encore de compte ? <span style={styleLien} onClick={() => setEstModeInscription(true)}>Inscrivez-vous</span></>
                    )}
                </div>

            </div>
        </div>
    );
}