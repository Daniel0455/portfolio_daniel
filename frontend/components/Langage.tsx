"use client"
export default function Langage() {
    let langages = [
        {
            nom: "JavaScript",
            couleur: "rgb(240, 219, 79)",
            fond: "rgb(240, 219, 79, 0.1)"
        },
        {
            nom: "HTML",
            couleur: "rgb(227, 79, 38)",
            fond: "rgb(227, 79, 38, 0.1)"
        },
        {
            nom: "CSS",
            couleur: "rgb(38, 77, 228)",
            fond: "rgb(38, 77, 228, 0.1)"
        },
        {
            nom: "SQL",
            couleur: "rgb(0, 122, 204)",
            fond: "rgb(0, 122, 204, 0.1)"
        },
    ]
    return(
        <div className="containerlangage">
            <p className="soustitre">Mes <label className="daniel">Langages</label></p>
            <p className="intropro">Les langages de programmation que j'utilise pour donner vie à mes projets.</p>
            <div className="ligne"></div>
            <div className="containerprojet">
                {langages.map((langage) => (
                    <div className="cardprojet" key={langage.nom} style={{padding: '20px', margin: '20px', borderRadius: '20px', border: '2px solid rgba(128, 128, 128, 0.253)', width:'150px', backdropFilter: 'blur(3px)', backgroundColor: langage.fond}}>
                        <i
                        className="fas fa-code"
                        style={{
                            color: 'white',
                            backgroundColor: langage.couleur,
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: '50%',
                            fontSize: '18px',
                        }}
                        ></i>
                        <p>{langage.nom}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}