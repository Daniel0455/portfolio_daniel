"use client"
export default function Projet(){
    let projets = [
        {
            titre: "Portfolio",
            couleur: "rgb(52, 152, 219)",
            desc: "Application web qui me représente en tant que développeur web, mais surtout pour démontrer ma capacité de développer une interface interactive et innovante",
            techno: ['Next.js', 'CSS', 'fontAwesome']
        },
        {
            titre: "StageTracker Pro",
            couleur: "rgb(46, 204, 113)",
            desc: "Une application web de suivi de stage dans une entreprise pour faciliter l'évaluation et la communication avec les stagiaires.",
            techno: ['Next.js', 'Express.js', 'PostgreSQL', 'Tailwindcss', 'MDB']
        },
        {
            titre: "TechRent",
            couleur: "rgb(155, 89, 182)",
            desc: "une application web de gestion de ventes des apareils éléctroniques",
            techno: ['Next.js', 'Express.js', 'MySQL']
        },
        {
            titre: "Recette",
            couleur: "rgb(230, 126, 34)",
            desc: "Une interface d'application web statique d'apprentissage de cuisine en ligne",
            techno: ['HTML', 'CSS', 'JavaScript']
        },
        {
            titre: "Cite vitrine de l'EMIT",
            couleur: "rgb(231, 76, 60)",
            desc: "Une application web statique qui représente l'EMIT(Ecole de Management et d'Innovation Technologique) et ces activités",
            techno: ['HTML', 'CSS', 'JavaScript']
        },
        {
            titre: "MusicPlayer",
            couleur: "rgb(241, 196, 15)",
            desc: "Application web de lecteur audio statique",
            techno: ['HTML', 'CSS', 'JavaScript']
        },

    ]
    return(
        <div>
            <p className="soustitre">Mes <label className="daniel">Projets</label></p>
            <p className="pgris intropro">
                Découvrez une sélection de mes réalisations qui démontrent mes compétences et ma passion pour le développement web.
            </p>
            <div className="ligne"></div>
            <div className="containerprojet">
                {projets.map((projet) => (
                    <div className="cardprojet" key={projet.titre} style={{padding: '20px', margin: '20px', borderRadius: '20px', border: '2px solid rgba(128, 128, 128, 0.253)', width:'300px', backdropFilter: 'blur(3px)'}}>
                        <i className='fas fa-laptop-code' style={{fontSize:'35px', color: projet.couleur}}></i>
                        <p className="pnoir">{projet.titre}</p>
                        <p className="pgris">{projet.desc}</p>
                        {
                            projet.techno.map((tech,index) =>(
                                <label key={index} style={{backgroundColor: 'rgba(128, 128, 128, 0.253)', borderRadius: '20px', padding: '3px', paddingLeft: '10px',paddingRight: '10px', margin: '5px', fontSize: '12px'}}>
                                    {tech}
                                </label>
                            ))
                        }
                    </div>
                ))}
            </div>
        </div>
    )
}