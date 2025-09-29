"use client";

import {
    MDBContainer,
    MDBInput,
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBTypography,
} from "mdb-react-ui-kit";
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
        setControlChamps(false);
        setMessageErreur(false);

        if (username === "" || password === "") {
        setControlChamps(true);
        return;
        }

        setSpinner(true);
        localStorage.setItem('pageActu','dashboard')

        try {
        const res = await fetch("http://localhost:3000/api/encadreurs/login", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ nom_utilisateur: username, mdp: password }),
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem("id_encadreur", data.encadreur.id_enc);
            router.replace("dashboard");
        } else {
            setMessageErreur(true);
        }
        } catch (error) {
        console.error("Erreur connexion :", error);
        setMessageErreur(true);
        } finally {
        setSpinner(false);
        }
    };

    const retour = () => {
        setSpinner(true);
        router.replace("/");
    };

    return (
        <MDBContainer
        fluid
        className="d-flex justify-content-center align-items-center vh-100 bg-light"
        >
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

            <div className="d-flex flex-column align-items-center">
            <MDBBtn
                className="btn-connexion my-2"
                onClick={connexion}
                style={{width:"fit-content"}}>
                Se connecter
            </MDBBtn>
            <MDBBtn
                className="btn-annuler my-2"
                style={{width:"fit-content"}}
                color="secondary"
                onClick={retour}
            >
                Annuler
            </MDBBtn>
            </div>
        </MDBCardBody>
        </MDBCard>

        {spinner && <SpinnerLoad />}

        <style jsx>{`
        .btn-connexion {
            width: 250px;
        }
        .btn-annuler {
            width: 200px;
        }
        `}</style>
    </MDBContainer>
    );
}
