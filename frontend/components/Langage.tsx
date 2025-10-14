"use client"
export default function Langage(){
    let langages = [
        {
            nom: "HTML"
        },
        {
            nom: "CSS"
        },
        {
            nom: "JavaScript"
        },
        {
            nom: "C#"
        },
        {
            nom: "Java"
        }
    ]
    return(
        <>
        <div className="containerLangage">
            <p className="titre">Langages connnus</p>
            <div className="containerLangageMain">
                {langages.map((langage) => (
                    <div key={langage.nom}>
                        <p>{langage.nom}</p>
                    </div>
                ))}
            </div>
        </div>
        </>
    )
}