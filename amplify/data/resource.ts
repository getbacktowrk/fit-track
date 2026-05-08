import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  
  // 1. LES PROGRAMMES
  Programme: a.model({
    nom: a.string().required(),
    description: a.string(),
    // On peut stocker un simple tableau de texte avec les IDs des séances
    seancesIds: a.string().array(), 
  }).authorization((allow) => [allow.owner()]), // "allow.owner()" garantit que seul le créateur voit ses données

  // 2. LES SÉANCES (Templates d'entraînement)
  Seance: a.model({
    nom: a.string().required(),
    description: a.string(),
    // On utilise a.json() pour stocker facilement la liste de vos exercices venant de l'API externe.
    // Exemple de ce qu'on y mettra : [{ idApi: "123", nom: "Bench Press", sets: 4, reps: 8 }]
    exercices: a.json(), 
  }).authorization((allow) => [allow.owner()]),

  // 3. L'HISTORIQUE ET LE FEEDBACK (Pour vos statistiques !)
  SessionLog: a.model({
    seanceId: a.string(), // Pour lier l'historique à la séance d'origine
    nomSeance: a.string(), 
    date: a.datetime().required(),
    // C'est ICI que la magie opère pour les stats. 
    // On y stockera : [{ idApi: "123", bodyPart: "Pectorals", feedback: "vert" }, ...]
    exercicesLogs: a.json(), 
    dureeEnMinutes: a.integer(),
  }).authorization((allow) => [allow.owner()]),

});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    // On s'assure que l'accès à la base de données nécessite d'être connecté
    defaultAuthorizationMode: 'userPool', 
  },
});