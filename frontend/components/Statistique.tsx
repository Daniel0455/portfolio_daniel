"use client"
export default function Statistique(){
    let cardStat = [
        {titre: "Projets réalisés", icon: "fa-solid fa-diagram-project", fond: "rgba(25, 93, 252, 0.05)", couleur: "rgba(25, 93, 252)", couleur2: "rgb(97, 144, 255)", valeur: "7+"},
        {titre: "Collaborations", icon: "fa-solid fa-people-group", fond: "rgb(152, 19, 251, 0.05)", couleur: "rgb(152, 19, 251)",couleur2: "rgb(196, 118, 255)", valeur: "5+"},
        {titre: "Outils utilisés", icon: "fa-solid fa-wrench", fond: "rgba(255, 166, 0, 0.05)", couleur: "rgba(255, 166, 0)",couleur2: "rgb(255, 205, 111)", valeur: "10+"},
        {titre: "Langages connus", icon: "fa-solid fa-code", fond: "rgba(0, 128, 0, 0.05)", couleur: "rgba(0, 128, 0)",couleur2: "rgb(111, 250, 111)", valeur: "10+"},
    ]
    return(
        <div className="containerstat">
            <p className="soustitre">A Propos de <label className="daniel">Moi</label></p>
            <div className="ligne"></div>
            <div className="containerprofil">
                <div className="cpgauche">
                    <p className="pnoir">
                        Razafindranaivo Aimé Daniel Johnston
                    </p>
                    <p className="pgris">
                        Développeur web passionné avec plusieurs années d'expérience dans la création d'applications web modernes et performantes. Je me spécialise dans le développement frontend avec une expertise approfondie en React, TypeScript et les technologies web modernes.
                    </p>
                    <p className="pgris">
                        Mon parcours m'a permis de travailler sur des projets variés, allant de sites vitrines élégants à des applications web complexes. Je crois fermement que le code doit être à la fois fonctionnel et esthétique.
                    </p>
                    <p className="pgris">
                        Toujours en quête d'apprentissage, je reste à jour avec les dernières tendances et technologies du développement web. Mon objectif est de créer des expériences utilisateur exceptionnelles qui allient design innovant et performance optimale.
                    </p>
                </div>
                <div className="cpdroit csdroit">
                    {cardStat.map((card) => (
                        <div className='statcard' key={card.titre} style={{backgroundColor: card.fond, width: '250px', textAlign: 'center', padding: '20px', borderRadius: '10px', margin: '20px', border: '1px solid '+card.couleur}}>
                            <i
                                className={card.icon}
                                style={{
                                width: "60px",
                                height: "60px",
                                borderRadius: "50%",
                                background: "linear-gradient(135deg,"+ card.couleur2+","+ card.couleur+")",
                                color: "white",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "25px",
                                margin: "auto",
                            }}
                            ></i>
                            <p style={{color: card.couleur}}>{card.valeur}</p>
                            <p className="pgris">{card.titre}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}