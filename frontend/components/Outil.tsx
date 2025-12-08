"use client"
export default function Outil() {
    const outils = [
        { nom: "NextJS", note: 5 },
        { nom: "Tailwind CSS", note: 5 },
        { nom: "Bootstrap", note: 5 },
        { nom: "ExpressJS", note: 4 },
        { nom: "Git&GitHub", note: 4 },
        { nom: "Figma", note: 3 },
        { nom: "Node.js", note: 4 },
        { nom: "Visual Studio Code", note: 6 },
        { nom: "Photoshop", note: 5 },
        { nom: "FontAwesome", note: 6 },
    ];

    return (
        <div>
            <p className="soustitre">
                Mes <label className="daniel">Outils</label>
            </p>
            <p className="pgris intropro">
                Les technologies et outils dont j’ai des connaissances pour créer des solutions web performantes.
            </p>
            <div className="ligne"></div>

            <div className="containerprojet" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
                {outils.map((outil) => (
                    <div
                        key={outil.nom}
                        style={{
                            padding: "20px",
                            margin: "20px",
                            borderRadius: "20px",
                            border: "2px solid rgba(128, 128, 128, 0.253)",
                            width: "250px",
                            backdropFilter: "blur(3px)",
                            textAlign: "center"
                        }}
                    >
                        <p style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "10px" }}>{outil.nom}</p>
                        <div style={{ display: "flex", justifyContent: "center", gap: "5px" }}>
                            {[...Array(6)].map((_, i) => (
                                <i
                                    key={i}
                                    className={i < outil.note ? "fas fa-star" : "far fa-star"}
                                    style={{
                                        color: i < outil.note ? "gold" : "transparent",
                                        WebkitTextStroke: "1px gold",
                                        fontSize: "20px",
                                    }}
                                ></i>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
