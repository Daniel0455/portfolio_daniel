import { useEffect, useState } from "react";

export default function NavBar() {
    const [pageActu, setPageActu] = useState("");
    const [menuOpen, setMenuOpen] = useState(false); // état pour toggle

    const boutons = [
        { label: "Accueil", value: "accueilportfoliodaniel" },
        { label: "A propos", value: "aproposportfoliodaniel" },
        { label: "Compétances", value: "competancesportfoliodaniel" },
        { label: "Outils", value: "outilssportfoliodaniel" },
        { label: "Mes projets", value: "projetsportfoliodaniel" },
        { label: "Contact", value: "contactportfoliodaniel" },
    ];

    useEffect(() => {
        const storedPage = localStorage.getItem("pageActu");
        if (!storedPage) {
            localStorage.setItem("pageActu", "accueilportfoliodaniel");
            setPageActu("accueilportfoliodaniel");
        } else {
            setPageActu(storedPage);
        }
    }, []);

    const handleClick = (value) => {
        localStorage.setItem("pageActu", value);
        setPageActu(value);
        setMenuOpen(false); // fermer le menu après clic sur mobile
    };

    return (
        <nav className="nav">
            <div className={`nav-buttons ${menuOpen ? "open" : ""}`}>
                {boutons.map((btn) => (
                    <button
                        key={btn.value}
                        className="button type1"
                        style={{
                            backgroundColor:
                                pageActu === btn.value ? "rgb(255, 0, 157)" : "initial",
                        }}
                        onClick={() => handleClick(btn.value)}
                    >
                        <span className="btn-txt">{btn.label}</span>
                    </button>
                ))}
            </div>
            <button
                className="toggle"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                Menu
            </button>
        </nav>
    );
}
