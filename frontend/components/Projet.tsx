"use client"
export default function Projet() {
    let projets = [
        {
            nom: "StageTracker Pro", 
            desc: "Application web de suivi de stage dans une entreprise",
            techno: "NextJS(JavaScript), Express(JavaScript), Taillwindcss(CSS), MDB(CSS)"
        },
        {
            nom: "OptionTech",
            desc: "Application desktop de gestion de vente des appareils éléctroniques",
            techno:"C#"
        },
        {
            nom: "Cite vitrine",
            desc: "Citre vitrine statique de l'EMIT",
            techno: "HTML, CSS"
        },
        {
            nom: "MusicPlayer",
            desc: "Application web statique de lecteur audio",
            techno: "HTML, CSS, JavaScript"
        },
        {
            nom: "Chemin Rapide",
            desc: "Application desktop de recheche de fichier",
            techno: "Python"
        },
        {
            nom: "Recette",
            desc: "Application web statique d'apprentissage de cuisine",
            techno: "HTML, CSS, JavaScript"
        }

    ]
    return(
        <>
            <div className="containerProjet">
                <p className="titre">Mes projets</p>
                <div className="containerProjetMain">
                    {projets.map((projet) => (
                        <div key={projet.nom} className="cardProjet">
                            <p className="projetNom">{projet.nom}</p>
                            <p>{projet.desc}</p>
                            <p>{projet.techno}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}