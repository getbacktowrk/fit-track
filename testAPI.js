import React, { useEffect } from "react";

export default function App() {
  useEffect(() => {
    // Remplacez le lien entre les guillemets par celui que vous voulez tester
    fetch("https://exercisedb.dev/api/v1/exercises?limit=5")
      .then(reponse => reponse.json())
      .then(donnees => {
        console.log("🔥 TEST DE L'API RÉUSSI ! Voici les données :");
        console.log(donnees);
      })
      .catch(erreur => console.log("Oups, l'API ne marche pas :", erreur));
  }, []);

  return <h1>Regardez la console de votre navigateur (F12) !</h1>;
}