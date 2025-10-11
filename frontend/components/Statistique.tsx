"use client"
export default function Statistique(){
    let donnees = [
        {label: "Projets", nombre: "+12"},
        {label: "Coolaboration", nombre: "+05"},
        {label: "Langages connus", nombre: "+07"},
        {label: "Outils utilisés", nombre: "+05"}
    ]
    return(
        <>
            <div className="containerStatistique">
                <p className="titre">A propos de moi</p>
                <div className="containerStatistiqueMain">
                    <div>
                        <p className="containerDescStatistique">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Debitis dignissimos ab ullam voluptatibus. Ipsa, neque. Facilis ipsum odit animi eaque nulla! Eum culpa enim, aut suscipit assumenda magni incidunt saepe.</p>
                    </div>
                    <div className="containerCard">
                        {donnees.map((donnee) =>(
                            <div key={donnee.label} className="cardStatistique">
                                <p>{donnee.nombre}</p>
                                <p>{donnee.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}