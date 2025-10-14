"use client"
export default function Outil(){
    let outils = [
        {
            nom: "Visual Studio Code"
        },
        {
            nom: "Microsoft Visual Studio"
        },
        {
            nom: "Windows"
        },
        {
            nom: "git"
        }
    ]
    return(
        <>
            <div className="containerOutil">
                <p className="titre">Outils</p>
                <div className="containerOutilMain">
                    {outils.map((outil) =>(
                        <div key={outil.nom}>
                            <p>{outil.nom}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}