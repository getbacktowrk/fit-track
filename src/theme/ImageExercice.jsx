import React, { useState } from 'react';

export const ImageExercice = ({ src, alt, style }) => {
    const [erreur, setErreur] = useState(false);

    // Image par défaut si le GIF ne charge pas (un beau placeholder fitness)
    const fallbackImage = "https://placehold.co/400x400/1e293b/bef264?text=Pas+de+GIF+disponible";

    return (
        <div style={{ ...style, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1e293b' }}>
            <img
                src={erreur ? fallbackImage : src}
                alt={alt}
                onError={() => setErreur(true)}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    opacity: erreur ? 0.5 : 1
                }}
            />
        </div>
    );
};