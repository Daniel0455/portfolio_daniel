"use client";

import { useState } from "react";
import NavBar from "../components/NavBar";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBTypography,
  MDBBtn,
} from "mdb-react-ui-kit";

export default function Home() {
  const [showMore, setShowMore] = useState(false);

  const shortText =
    "Bienvenue sur notre plateforme de suivi de stage, un outil moderne et interactif conçu pour suivre en temps réel les activités des stagiaires.";
  const fullText =
    "Grâce à cette application, les encadreurs peuvent facilement superviser l'avancement des tâches, donner des retours réguliers et évaluer le travail effectué. Elle favorise une communication efficace entre stagiaires et encadrants tout en assurant une traçabilité complète du parcours de stage.";

  return (
    <>
      <NavBar />

      <MDBContainer fluid className="py-5 bg-light text-center">
        {/* Titre principal */}
        <MDBTypography tag="h1" className="display-4 fw-bold mb-4">
          Plateforme de Gestion <span className="text-primary">des Stages</span>
        </MDBTypography>

        {/* Description avec bouton "Lire plus" */}
        <MDBTypography
          tag="p"
          className="lead text-muted mb-3 mx-auto"
          style={{ maxWidth: "700px" }}
        >
          {shortText} {showMore && fullText}
        </MDBTypography>

        <MDBBtn
          outline
          color="primary"
          size="sm"
          className="mb-4"
          style={{ width: "fit-content" }}
          onClick={() => setShowMore(!showMore)}
        >
          {showMore ? "Lire moins" : "Lire plus"}
        </MDBBtn>

        {/* Titre de section */}
        <MDBTypography tag="h2" className="fw-bold mb-4">
          Ce que nous offrons
        </MDBTypography>

        {/* Cartes fonctionnalités */}
        <MDBRow className="justify-content-center gy-4 px-3">
          {[
            {
              text: "Suivi en temps réel",
              icon: "clock",
              color: "success",
              description:
                "Visualisez instantanément l'avancement des stagiaires et recevez des mises à jour en temps réel sur leurs activités.",
            },
            {
              text: "Gestion multi-utilisateurs",
              icon: "users",
              color: "info",
              description:
                "Permet aux encadreurs et aux stagiaires de collaborer efficacement sur la plateforme, avec des permissions adaptées à chaque rôle.",
            },
            {
              text: "Sécurité garantie",
              icon: "shield-alt",
              color: "danger",
              description:
                "Toutes les données sont protégées avec les dernières technologies de sécurité pour assurer la confidentialité et l'intégrité des informations.",
            },
          ].map(({ text, icon, color, description }, index) => (
            <MDBCol md="6" lg="4" key={index}>
              <MDBCard className="text-center shadow-3 h-100 border-0">
                <div
                  className={`bg-${color} text-white rounded-circle d-flex justify-content-center align-items-center mx-auto mt-4`}
                  style={{ width: "70px", height: "70px" }}
                >
                  <MDBIcon fas icon={icon} size="lg" />
                </div>
                <MDBCardBody>
                  <MDBTypography tag="h5" className="fw-semibold mt-3 mb-2">
                    {text}
                  </MDBTypography>
                  <p className="text-muted small">{description}</p>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          ))}
        </MDBRow>
      </MDBContainer>
    </>
  );
}
