"use client";

import NavBarEncadreur from "../../../components/NavBarEncadreur";
import SpinnerLoad from "@/components/spinner";
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBBtn,
  MDBIcon,
  MDBInput,
  MDBProgress,
  MDBProgressBar,
  MDBTooltip,
} from "mdb-react-ui-kit";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Stagiaire {
  id: number;
  nom: string;
  prenom: string;
  filiere: string;
  temps: number | null;
  technique: number | null;
  equipe: number | null;
  autonomie: number | null;
  discipline: number | null;
}

interface Presence {
  date: string;
  etat: "present" | "absent";
}

export default function Home() {
  const [stagiaires, setStagiaires] = useState<Stagiaire[]>([]);
  const [recherche, setRecherche] = useState("");
  const [presencesParStagiaire, setPresencesParStagiaire] = useState<
    Record<number, Presence[]>
  >({});
  const [spinner, setSpinner] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:3000/api/encadreurs/stagiaires")
      .then((res) => res.json())
      .then((data) => {
        const stagiairesAvecPresence: Stagiaire[] = data.map((s: any) => ({
          id: s.id_stagiaire,
          nom: s.nom,
          prenom: s.prenom,
          filiere: s.etab,
          temps: s.temps,
          technique: s.technique,
          equipe: s.equipe,
          autonomie: s.autonomie,
          discipline: s.discipline,
        }));
        setStagiaires(stagiairesAvecPresence);

        stagiairesAvecPresence.forEach((s) =>
          fetchPresenceParStagiaire(s.id)
        );
      })
      .catch((err) => console.error("Erreur récupération stagiaires :", err));
  }, []);

  const fetchPresenceParStagiaire = async (id_stagiaire: number) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/encadreurs/presence-toutes/${id_stagiaire}`
      );
      if (!response.ok) throw new Error("Erreur API présence");
      const data: Presence[] = await response.json();
      setPresencesParStagiaire((prev) => ({ ...prev, [id_stagiaire]: data }));
    } catch (error) {
      console.error("Erreur récupération présence :", error);
      setPresencesParStagiaire((prev) => ({ ...prev, [id_stagiaire]: [] }));
    }
  };

  function calculTauxPresence(presences: Presence[]): number {
    if (presences.length === 0) return 0;
    const nbPresents = presences.filter((p) => p.etat === "present").length;
    return Math.round((nbPresents / presences.length) * 100);
  }

  const openPresencePage = (stagiaire: Stagiaire) => {
    setSpinner(true);
    setTimeout(() => {
      router.replace(`presence?id_stagiaire=${stagiaire.id}`);
      localStorage.setItem("pageActu", "presence");
    }, 100);
  };

  const openBulletinPage = (stagiaire: Stagiaire) => {
    setSpinner(true);
    setTimeout(() => {
      router.replace(`bulletin?id_stagiaire=${stagiaire.id}`);
      localStorage.setItem("pageActu", "note");
    }, 100);
  };

  const stagiairesFiltres = stagiaires.filter((s) =>
    (s.nom + " " + s.prenom).toLowerCase().includes(recherche.toLowerCase())
  );

  function hasNoNotes(s: Stagiaire): boolean {
    return (
      s.temps === null &&
      s.technique === null &&
      s.equipe === null &&
      s.autonomie === null &&
      s.discipline === null
    );
  }

  return (
    <>
      <NavBarEncadreur />
      <MDBContainer className="mt-4" style={{ backgroundColor: "white" }}>
        <h2 style={{ color: "black" }}>Suivi et évaluation des stagiaires</h2>
        <MDBCard className="shadow-3">
          <MDBCardBody>
            <MDBCardTitle>Liste des stagiaires encadrés</MDBCardTitle>
            <MDBInput
              label="Recherche par nom ou prénom"
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              className="mb-3"
              type="search"
              size="md"
            />
            <div style={{ maxHeight: "400px", overflowY: "auto" }}>
              <MDBTable responsive hover align="middle">
                <MDBTableHead>
                  <tr>
                    <th>#</th>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>Filière</th>
                    <th>Taux de présence</th>
                    <th>Actions</th>
                  </tr>
                </MDBTableHead>
                <MDBTableBody>
                  {stagiairesFiltres.map((s, index) => {
                    const presences = presencesParStagiaire[s.id] || [];
                    const tauxPresence = calculTauxPresence(presences);
                    return (
                      <tr key={s.id}>
                        <td>{index + 1}</td>
                        <td>{s.nom}</td>
                        <td>{s.prenom}</td>
                        <td>{s.filiere}</td>
                        <td>
                          <MDBProgress height="15">
                            <MDBProgressBar
                              width={tauxPresence}
                              valuemin={0}
                              valuemax={100}
                            >
                              {tauxPresence}%
                            </MDBProgressBar>
                          </MDBProgress>
                        </td>
                        <td>
                          {/* BOUTON PRÉSENCE */}
                          <MDBBtn
                            color="success"
                            size="sm"
                            className="me-2 position-relative"
                            style={{
                              backgroundColor: "#28a745",
                              border: "none",
                              borderRadius: "6px",
                              padding: "5px 12px",
                              fontSize: "14px",
                              fontWeight: "500",
                              width: "120px"
                            }}
                            onClick={() => openPresencePage(s)}
                          >
                            <MDBIcon fas icon="check" className="me-1" />
                            Présence
                          </MDBBtn>

                          {/* BOUTON NOTE AVEC ICÔNE DE MARQUAGE */}
                          <div style={{ display: "inline-block", position: "relative" }}>
                            <MDBBtn
                              color="info"
                              size="sm"
                              style={{
                                backgroundColor: "#17a2b8",
                                border: "none",
                                borderRadius: "6px",
                                padding: "5px 12px",
                                fontSize: "14px",
                                fontWeight: "500",
                                width: "120px",
                                position: "relative"
                              }}
                              onClick={() => openBulletinPage(s)}
                            >
                              <MDBIcon fas icon="file-alt" className="me-1" />
                              Note
                            </MDBBtn>

                            {hasNoNotes(s) && (
                              <MDBTooltip tag="span" title="Aucune note attribuée">
                                <MDBIcon
                                  fas
                                  icon="exclamation-circle"
                                  className="text-warning"
                                  style={{
                                    position: "absolute",
                                    top: "-6px",
                                    left: "-6px",
                                    fontSize: "14px",
                                  }}
                                />
                              </MDBTooltip>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </MDBTableBody>
              </MDBTable>
            </div>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>

      {spinner && <SpinnerLoad />}
    </>
  );
}
