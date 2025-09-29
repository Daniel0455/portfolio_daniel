"use client";

import { useEffect, useState } from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBIcon,
} from "mdb-react-ui-kit";
import NavBarEncadreur from "@/components/NavBarEncadreur";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cards = [
    {
      title: "Stagiaires",
      text: "Gérez les stagiaires que vous encadrez actuellement.",
      icon: "user-graduate",
      iconColor: "#ff5722", // orange
    },
    {
      title: "Thèmes",
      text: "Consultez les sujets proposés et attribués.",
      icon: "lightbulb",
      iconColor: "#4caf50", // vert
    },
    {
      title: "Suivi",
      text: "Suivez l'évolution des stagiaires et évaluez leurs progrès.",
      icon: "chart-line",
      iconColor: "#9c27b0", // violet
    },
    {
        title: "Messages",
        text: "Consultez les messages et notifications.",
        icon: "envelope",
        iconColor: "#ff9800", // jaune/orange
    },
    {
        title: "Paramètres",
        text: "Configurez les options et préférences de votre compte.",
        icon: "cog",
        iconColor: "#009688",
    },

    {
        title: "Confidentialité",
  text: "Paramétrez la visibilité de vos données et informations personnelles.",
  icon: "user-secret",
  iconColor: "#3f51b5"
    }

  ];

  return (
    <div>
      <NavBarEncadreur />
      <MDBContainer fluid className="mt-5 p-4">
        <h2 className="mb-4">Tableau de bord - Encadreur</h2>
        <MDBRow className="gy-4">
          {cards.map((item, index) => (
            <MDBCol md="4" key={index}>
              <MDBCard className="h-100">
                <MDBCardBody className="d-flex flex-column">
                  <MDBCardTitle className="d-flex align-items-center" style={{ fontWeight: "bold", color: item.iconColor }}>
                    {mounted && (
                      <MDBIcon
                        icon={item.icon}
                        className="me-2"
                        style={{ color: item.iconColor }}
                      />
                    )}
                    {item.title}
                  </MDBCardTitle>
                  <MDBCardText className="mt-2">{item.text}</MDBCardText>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          ))}
        </MDBRow>
      </MDBContainer>
    </div>
  );
}
