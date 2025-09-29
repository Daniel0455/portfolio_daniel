import { MDBBtn } from "mdb-react-ui-kit"
import { useState } from "react"
import ModalChoixConnexionAccueil from "../modals/ModalChoixConnexionAccueil"

export default function NavBar(){
    const [modalsConnexionAccueil, setModalsConnexionAccueil] = useState(false);

    const afficherModalChoixConnexionAccueil = () => {
        setModalsConnexionAccueil(true);
    }
    const fermerModalChoixConnexionAccueil = () => {
        setModalsConnexionAccueil(false);
    }

    return (
        <>
            <nav
                className="navbar navbar-light bg-light p-3 w-100"
                style={{
                    position: "sticky",
                    top: "0",
                    zIndex: 1000,
                    color: "#333333"  // couleur gris foncé appliquée au texte et SVG via currentColor
                }}
            >
                <svg
                    className="img-fluid mx-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ width: "32px", height: "32px" }}
                >
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                </svg>
                <span className="logo-text" style={{ color: "#333333", fontWeight: "bold" }}>
                    StageTracker Pro
                </span>
                <MDBBtn
                    color="primary"
                    className="ms-auto"
                    style={{ width: "fit-content" }}
                    onClick={afficherModalChoixConnexionAccueil}
                >
                    Connexion
                </MDBBtn>
            </nav>

            {/* Modals */}
            {modalsConnexionAccueil && (
                <ModalChoixConnexionAccueil onClose={fermerModalChoixConnexionAccueil} />
            )}
        </>
    )
}
