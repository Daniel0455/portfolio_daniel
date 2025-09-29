"use client";

import NavBarAdmin from "@/components/NavBarAdmin";
import FormEnc from "@/modals/FormEnc";
import FormCom from "@/modals/FormCom";
import SpinnerLoad from "@/components/spinner";
import {
    MDBBtn,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBTypography,
} from "mdb-react-ui-kit";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
    const router = useRouter();
    const [spinner, setSpinner] = useState(false);
    const [encadreurCount, setEncadreurCount] = useState<number | null>(null);
    const [communicationCount, setCommunicationCount] = useState<number | null>(null);
    const [formEnc, setFormEnc] = useState(false);
    const [formCom, setFormCom] = useState(false);

    const [refreshTrigger, setRefreshTrigger] = useState(false);


    //Fonction de fermeture des formulaires
    const affichageFormEnc = () =>{
        setFormEnc((prev) =>! prev)
    }

    const affichageFormCom = () =>{
        setFormCom((prev) =>!prev)
    }


    const handleSuccess = () => {
        setRefreshTrigger(prev => !prev); // délenche useEffect pour recharger les données
    };



    // Ajout de email dans le type
    const [dernierEncadreur, setDernierEncadreur] = useState<{ nom?: string; email?: string } | null>(null);
    const [derniereComm, setDerniereComm] = useState<{ nom?: string; email?: string } | null>(null);

    const voirPlusEnc = async () => {
        setSpinner(true);
        await router.replace("encadreur");
    };

    const voirPlusCom = async () => {
        setSpinner(true);
        await router.replace("communication");
    };

    const primaryBlue = "#0d6efd";
    const freshGreen = "#22c55e";

    useEffect(() => {
        const fetchEncadreurCount = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/admins/count");
                const data = await response.json();
                setEncadreurCount(data.count);
            } catch (error) {
                console.error("Erreur encadreur count :", error);
            }
        };

        const fetchCommunicationCount = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/admins/count-communication");
                const data = await response.json();
                setCommunicationCount(data.count);
            } catch (error) {
                console.error("Erreur communication count :", error);
            }
        };

        const fetchDernierEncadreur = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/admins/dernier-encadreur");
                const data = await response.json();
                if (data.succes && data.dernierEncadreur) {
                    setDernierEncadreur(data.dernierEncadreur);
                }
            } catch (error) {
                console.error("Erreur dernier encadreur :", error);
            }
        };

        const fetchDerniereCommunication = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/admins/communications/last");
                const data = await response.json();
                if (data) {
                    setDerniereComm(data);
                }
            } catch (error) {
                console.error("Erreur dernière communication :", error);
            }
        };

        fetchEncadreurCount();
        fetchCommunicationCount();
        fetchDernierEncadreur();
        fetchDerniereCommunication();
    }, [refreshTrigger]);

    return (
        <>
            <NavBarAdmin />

            <MDBContainer
                className="mt-5 pt-2"
                style={{ backgroundColor: "#F9FAFB", minHeight: "100vh", paddingBottom: "50px" }}
            >
                {/* Bienvenue */}
                <MDBCard className="shadow-sm mb-4" style={{ backgroundColor: "#FFFFFF" }}>
                    <MDBCardBody className="text-center">
                        <MDBTypography tag="h5" className="mb-2" style={{ color: primaryBlue }}>
                            <i className="fas fa-door-open me-2"></i>
                            Bienvenue sur le tableau de bord administrateur !
                        </MDBTypography>
                        <p className="mb-0" style={{ color: "#212121" }}>
                            <i className="fas fa-quote-left me-2"></i>
                            L’administrateur joue un rôle central dans cette application, assurant la gestion des encadreurs, la supervision des communications et le bon déroulement du suivi de stage.
                        </p>
                    </MDBCardBody>
                </MDBCard>

                {/* Statistiques */}
                <MDBRow className="justify-content-center mb-4">
                    {/* Encadreur */}
                    <MDBCol md="4" className="mb-3">
                        <MDBCard className="text-center shadow" style={{ backgroundColor: primaryBlue, color: "white" }}>
                            <MDBCardBody>
                                <h4><i className="fas fa-user-tie me-2"></i> Encadreur</h4>
                                <p><strong>Nombre :</strong> {encadreurCount ?? "Chargement..."}</p>
                                <div className="progress my-3" style={{ height: "5px" }}>
                                    <div className="progress-bar bg-light" style={{ width: encadreurCount !== null ? `${Math.min(encadreurCount * 10, 100)}%` : "0%" }}></div>
                                </div>
                                <MDBBtn
                                    size="sm"
                                    onClick={voirPlusEnc}
                                    style={{ backgroundColor: "white", color: primaryBlue, fontWeight: "bold" }}
                                >
                                    <i className="fas fa-eye me-1"></i> Voir plus
                                </MDBBtn>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>

                    {/* Communication */}
                    <MDBCol md="4" className="mb-3">
                        <MDBCard className="text-center shadow" style={{ backgroundColor: freshGreen, color: "white" }}>
                            <MDBCardBody>
                                <h4><i className="fas fa-bullhorn me-2"></i> Communication</h4>
                                <p><strong>Nombre :</strong> {communicationCount ?? "Chargement..."}</p>
                                <div className="progress my-3" style={{ height: "5px" }}>
                                    <div className="progress-bar bg-light" style={{ width: communicationCount !== null ? `${Math.min(communicationCount * 10, 100)}%` : "0%" }}></div>
                                </div>
                                <MDBBtn
                                    size="sm"
                                    onClick={voirPlusCom}
                                    style={{ backgroundColor: "white", color: freshGreen, fontWeight: "bold" }}
                                >
                                    <i className="fas fa-eye me-1"></i> Voir plus
                                </MDBBtn>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>

                {/* Actions Rapides */}
                <MDBCard className="mb-4 shadow-sm" style={{ backgroundColor: "#E8F0FE" }}>
                    <MDBCardBody>
                        <h4 className="mb-3" style={{ color: primaryBlue }}>
                            <i className="fas fa-bolt me-2"></i> Actions Rapides
                        </h4>
                        <div className="d-flex flex-wrap gap-3">
                            <MDBBtn
                                onClick={affichageFormEnc}
                                style={{ backgroundColor: primaryBlue, color: "white", width: "fit-content" }}
                            >
                                <i className="fas fa-plus me-2"></i> Ajouter Encadreur
                            </MDBBtn>
                            <MDBBtn
                                onClick={affichageFormCom}
                                style={{ backgroundColor: freshGreen, color: "white", width: "fit-content" }}
                            >
                                <i className="fas fa-plus me-2"></i> Nouvelle Communication
                            </MDBBtn>
                        </div>
                    </MDBCardBody>
                </MDBCard>

                {/* Activités Récentes */}
                <MDBCard className="shadow-sm mb-5" style={{ backgroundColor: "#FFFFFF" }}>
                    <MDBCardBody>
                        <h4 className="mb-3" style={{ color: primaryBlue }}>
                            <i className="fas fa-history me-2"></i> Activités Récentes
                        </h4>
                        <ul className="list-unstyled" style={{ color: "#212121" }}>
                            <li>
                                <i className="fas fa-check-circle text-success me-2"></i>
                                Dernier encadreur enregistré :{" "}
                                <strong>
                                    {dernierEncadreur?.nom ?? "..."} {dernierEncadreur?.email ? `(${dernierEncadreur.email})` : ""}
                                </strong>
                            </li>
                            <li>
                                <i className="fas fa-bullhorn me-2" style={{ color: freshGreen }}></i>
                                Nouvelle communication :{" "}
                                <strong>
                                    {derniereComm?.nom_com
                                        ? `${derniereComm.nom_com} (${derniereComm.email})`
                                        : "..."}
                                </strong>
                            </li>
                        </ul>
                    </MDBCardBody>
                </MDBCard>
            </MDBContainer>

            {spinner && <SpinnerLoad />}
            {formEnc && <FormEnc onClose={affichageFormEnc} onSuccess={handleSuccess}/>}
            {formCom && <FormCom onClose={affichageFormCom} onSuccess={handleSuccess}/>}
        </>
    );
}
