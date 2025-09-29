import { info } from "console";
import { MDBBtn, MDBInput, MDBCard, MDBCardBody, MDBTypography } from "mdb-react-ui-kit";
import { ModalProps } from "mdb-react-ui-kit/dist/types/free/components/Modal/types";
import { useState } from "react";

type Props = ModalProps & {
    onSuccess?: () => void;
};

export default function FormEnc({ onClose, onSuccess }: Props) {
  // États
    const [username, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [mdp, setMdp] = useState("");
    const [confmdp, setConfMdp] = useState("");
    const [message, setMessage] = useState(false);
    const [infomdp, setInfoMdp] = useState(false);


    //API
    // CORRECTION: Fonction corrigée pour ajouter un encadreur avec meilleure gestion d'erreurs
    async function ajouterEncadreur(nom: string, email: string, mdp: string) {
        try {
        const response = await fetch("http://localhost:3000/api/admins/ajouter", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ nom, email, mdp }),
        })

        const data = await response.json()

        if (response.ok && data.succes) {
            console.log("Encadreur ajouté avec succès:", data.encadreur)
            return { success: true, data: data.encadreur }
        } else {
            console.warn("Échec de l'ajout:", data.message || "Erreur inconnue")
            return { success: false, error: data.message || "Erreur inconnue" }
        }
        } catch (error) {
        console.error("Erreur réseau ou serveur:", error)
        return { success: false, error: "Erreur de connexion au serveur" }
        }
    }

    // Fonction pour ajouter un compte communication
    async function ajouterCommunication(nom: string, email: string, mdp: string) {
        try {
        const response = await fetch("http://localhost:3000/api/admins/ajouter-communication", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ nom, email, mdp }),
        })

        const data = await response.json()

        if (response.ok && data.succes) {
            console.log("Compte communication ajouté avec succès:", data.communication)
            return { success: true, data: data.communication }
        } else {
            console.warn("Échec de l'ajout:", data.message || "Erreur inconnue")
            return { success: false, error: data.message || "Erreur inconnue" }
        }
        } catch (error) {
        console.error("Erreur réseau ou serveur:", error)
        return { success: false, error: "Erreur de connexion au serveur" }
        }
    }


    // Fonction d'ajout encadreur
    const ajouterEnc = async () => {
        setMessage(false);
        setInfoMdp(false);
        if (username === "" || email === "" || mdp === "" || confmdp === "") {
            setMessage(true);
            setInfoMdp(false)
        }
        else if(mdp != confmdp){
            setMessage(false);
            setInfoMdp(true);
        }
        else {
            const result = await ajouterEncadreur(username, email, mdp);
            if (result.success) {
                alert("Ajout de nouvel encadreur réussit")
                onClose?.(); // Ferme le modal si l'ajout est réussi
                onSuccess?.(); //Mise à jour du tableau
            } else {
                // Affiche un message d'erreur si nécessaire
                alert(result.error);
            }
        }

    };

    return (
        <div
        className="position-fixed top-50 start-50 translate-middle"
        style={{ zIndex: 1050, width: "100%", maxWidth: "500px"}}
        >
        <MDBCard className="shadow rounded">
            <MDBCardBody className="px-4 py-4">
            <MDBTypography tag="h5" className="text-center mb-4 fw-bold">
                Nouvel encadreur
            </MDBTypography>

            <MDBInput
                label="Nom utilisateur"
                type="text"
                className="mb-3"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
            />

            <MDBInput
                label="Email"
                type="email"
                className="mb-3"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <MDBInput
                label="Mot de passe"
                type="password"
                className="mb-3"
                value={mdp}
                onChange={(e) => setMdp(e.target.value)}
            />

            <MDBInput
                label="Confirmation mot de passe"
                type="password"
                className="mb-3"
                value={confmdp}
                onChange={(e) => setConfMdp(e.target.value)}
            />

            {message && (
                <div className="text-danger text-center mb-3">
                Tous les champs sont obligatoires
                </div>
            )}

            {infomdp && (
                <div className="text-danger text-center mb-3">
                Les deux mots de passes doivent être égaux
                </div>
            )}

            <div className="d-flex justify-content-end mt-3">
                <MDBBtn color="danger" className="me-2" onClick={onClose}>
                Annuler
                </MDBBtn>
                <MDBBtn onClick={ajouterEnc}>Ajouter</MDBBtn>
            </div>
            </MDBCardBody>
        </MDBCard>
        </div>
    );
}
