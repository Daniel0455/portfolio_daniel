"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MDBBtn } from "mdb-react-ui-kit";
import { ModalProps } from "mdb-react-ui-kit/dist/types/free/components/Modal/types";
import SpinnerLoad from "@/components/spinner";

export default function ModalChoixConnexionAccueil({ onClose }: ModalProps) {
    const router = useRouter();
    const [spinner, setSpinner] = useState(false);

    const handleConnexion = async (lien: string) => {
        setSpinner(true);
        await router.replace(lien);
    };

    return (
        <>
            {spinner && <SpinnerLoad />}

            {!spinner && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 9999,
                        padding: "1rem",
                        boxSizing: "border-box",
                    }}
                >
                    <div
                        className="rounded-4 shadow d-flex flex-column"
                        style={{
                            position: "relative",
                            maxWidth: "600px",
                            width: "100%",
                            maxHeight: "80vh",
                            height: "auto",
                            backgroundColor: "#1e1e1e",
                            overflow: "hidden",
                        }}
                    >
                        {/* Header */}
                        <div
                            style={{
                                padding: "1rem",
                                display: "flex",
                                justifyContent: "space-between",
                                borderBottom: "1px solid #333",
                                flexShrink: 0,
                            }}
                        >
                            <h1 className="h5 text-white mb-0">Connexion</h1>
                            <MDBBtn color="secondary" size="sm" onClick={onClose} style={{ width: "fit-content" }}>
                                <i className="fas fa-arrow-left me-2"></i>
                            </MDBBtn>
                        </div>

                        {/* Body (scrollable) */}
                        <div
                            style={{
                                overflowY: "auto",
                                padding: "1.5rem",
                                flexGrow: 1,
                            }}
                        >
                            <div className="row g-4">
                                {[
                                    {
                                        title: "Administrateur",
                                        icon: "fas fa-user-shield",
                                        color: "#0d6efd",
                                        lien: "/admin/connexion",
                                    },
                                    {
                                        title: "Communication",
                                        icon: "fas fa-comment-dots",
                                        color: "#ffc107",
                                        lien: "/communication/login",
                                    },
                                    {
                                        title: "Encadreur",
                                        icon: "fas fa-chalkboard-teacher",
                                        color: "#20c997",
                                        lien: "/encadreur/connexion",
                                    },
                                    {
                                        title: "Stagiaire",
                                        icon: "fas fa-user-graduate",
                                        color: "#dc3545",
                                        lien: "/stagiaire/login",
                                    },
                                ].map((item, index) => (
                                    <div className="col-12 col-sm-6" key={index}>
                                        <div className="card h-100 d-flex justify-content-center align-items-center">
                                            <div
                                                className="card-img-top"
                                                style={{
                                                    fontSize: "50px",
                                                    color: item.color,
                                                    height: "120px",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <i className={item.icon}></i>
                                            </div>
                                            <div className="card-body text-center">
                                                <h5 className="card-title">{item.title}</h5>
                                                <MDBBtn
                                                    color="primary"
                                                    className="w-100"
                                                    onClick={() => handleConnexion(item.lien)}
                                                >
                                                    Connexion
                                                </MDBBtn>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
