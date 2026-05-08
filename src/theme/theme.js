export const styleTitre = {
    boxSizing: "border-box",
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
    padding: "15px 30px", 
    backgroundColor: "#1f2937", 
    color: "white", 
    borderRadius: "10px",
    marginBottom: "30px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    margin: 0
};


export const test = {
    backgroundColor: "#f3f4f6",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "30px",
    textAlign: "left",
    boxSizing: "border-box"
}

// Boutons Catégories muscles
export const styleFiltre = {
    padding: "8px 20px", backgroundColor: "#e5e7eb", color: "#4b5563",
    borderRadius: "20px", fontWeight: "bold", cursor: "pointer",
    border: "2px solid transparent", transition: "all 0.2s"
};
export const styleFiltreActif = { ...styleFiltre, backgroundColor: "#3b82f6", color: "white" };


// Boutons de navigation TOP
export const styleBoutonNav = {
    padding: "10px 15px", backgroundColor: "transparent", color: "white",
    border: "1px solid #4b5563", borderRadius: "5px", cursor: "pointer", fontWeight: "bold"
};

export const styleBoutonNavActif = {
    ...styleBoutonNav, backgroundColor: "#3b82f6", border: "none"
};

export const stylePetitBouton = {
        padding: "8px 15px",
        backgroundColor: "#1f2937",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "14px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        transition: "transform 0.1s"
};