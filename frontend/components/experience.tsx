"use client"
export default function Experience(){
    let experiences = [
        {
            nom: "Code Show Off 1.0",
            desc: "Deuxième place"
        },
        {
            nom: "EmiHack",
            desc: "Participant"
        },
        {
            nom: "Informatique bureautique",
            desc: "Formé en informatique dureautique (Multi-sérvice et internet)"
        }
    ]
    return(
        <>
            <div className="containerExperience">
                <p className="titre">Experiences</p>
                <div className="containerExperienceMain">
                    {experiences.map((experience) => (
                        <div key={experience.nom}>
                            <p>{experience.nom}</p>
                            <p>{experience.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}