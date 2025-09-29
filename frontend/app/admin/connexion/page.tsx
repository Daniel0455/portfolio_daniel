"use client";

import { MDBContainer, MDBInput, MDBBtn, MDBCard, MDBCardBody, MDBTypography } from "mdb-react-ui-kit";
import { useState } from "react";
import { useRouter } from "next/navigation";
import SpinnerLoad from "@/components/spinner";

export default function Login() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [messageErreur, setMessageErreur] = useState(false);
    const [controlChamp, setControlChamps] = useState(false);
    const [spinner, setSpinner] = useState(false);

    const connexion = async () => {
    // Traitement
    setControlChamps(false);
    setMessageErreur(false);
    if(username==="" || password==="")
    {
        setControlChamps(true);
        setMessageErreur(false);
    }
    else{
        setSpinner(true);
        setControlChamps(false);
        const res = await fetch("http://localhost:3000/api/admins/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ nom_utilisateur: username, mdp: password }),
        })
        console.log("Login avec:", username, password);

        const data = await res.json()

        if (res.ok) {
        const nomAdmin = data.admin.nom_utilisateur;
        const idAdmin = data.admin.id_admin;
        router.replace("dashboard");
        localStorage.setItem("id_admin", data.admin.id_admin);
        } else {
            setSpinner(false);
            setMessageErreur(true);
        }
    }
    };
    const retour = () =>{
        setSpinner(true);
        router.replace("/");
    }

    return (
        <MDBContainer fluid className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <MDBCard className="shadow p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <MDBCardBody>
            <MDBTypography tag="h3" className="text-center mb-4 fw-bold">
                Connexion
            </MDBTypography>

            <MDBInput
                label="Nom d'utilisateur"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mb-4"
            />

            <MDBInput
                label="Mot de passe"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mb-4"
            />
            {controlChamp && (
                <p className="text-danger">Tous les champs sont obligatoires</p>
            )}
            {messageErreur && (
                <p className="text-danger">Nom utilisateur ou mot de passe incorrect</p>
            )}
            <MDBBtn onClick={connexion} style={{width: "fit-content"}}>
                Se connecter
            </MDBBtn><br/>
            <MDBBtn className="my-2" color="secondary" onClick={retour} style={{width: "fit-content"}}>
                Annuler
            </MDBBtn>
        </MDBCardBody>
        </MDBCard>
        {spinner && (
            <SpinnerLoad />
        )}
    </MDBContainer>
    );
}
