"use client";

import NavBarEncadreur from "@/components/NavBarEncadreur";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBInput,
  MDBBtn
} from "mdb-react-ui-kit";
import { useState, useEffect } from "react";

interface Stagiaire {
  id_stagiaire: string;
  nom: string;
  prenom: string;
  etab: string;
  mention: string;
  niveau: string;
  email: string;
}

export default function Home() {
  const [stagiaires, setStagiaires] = useState<Stagiaire[]>([]);
  const [recherche, setRecherche] = useState("");
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    fetchStagiaires();
  }, []);

  async function fetchStagiaires() {
    try {
      const res = await fetch("http://localhost:3000/api/encadreurs/stagiaires");
      if (!res.ok) throw new Error("Erreur lors du chargement des stagiaires");
      const data = await res.json();
      setStagiaires(data);
    } catch (error: any) {
      setErreur(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function supprimerStagiaire(id: string) {
    if (!window.confirm("Voulez-vous vraiment supprimer ce stagiaire ?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/encadreurs/stagiaires/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erreur lors de la suppression");
      setStagiaires((prev) => prev.filter((s) => s.id_stagiaire !== id));
    } catch (error: any) {
      alert(error.message);
    }
  }

  async function supprimerTousStagiaires() {
    if (!window.confirm("Voulez-vous vraiment supprimer TOUS les stagiaires ?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/encadreurs/stagiaires`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erreur lors de la suppression");
      setStagiaires([]);
    } catch (error: any) {
      alert(error.message);
    }
  }

  const stagiairesFiltres = stagiaires.filter((stagiaire) =>
    (stagiaire.nom + " " + stagiaire.prenom).toLowerCase().includes(recherche.toLowerCase())
  );

  const totalStagiaires = stagiaires.length;
  const dernierStagiaire =
    stagiaires.length > 0 ? stagiaires[stagiaires.length - 1] : { prenom: "", nom: "" };

  return (
    <>
      <NavBarEncadreur />
      <MDBContainer className="mt-4" style={{backgroundColor: "white"}}>
        <MDBRow className="mb-4">
          <MDBCol md="6" lg="4" className="mb-3">
            <MDBCard style={{backgroundColor: "#007bff"}} className="text-white shadow-3 h-100">
              <MDBCardBody>
                <MDBCardTitle>Nombre total de stagiaires</MDBCardTitle>
                <h4>{totalStagiaires}</h4>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol md="6" lg="4" className="mb-3">
            <MDBCard background="success" className="text-white shadow-3 h-100">
              <MDBCardBody>
                <MDBCardTitle>Dernier stagiaire enregistré</MDBCardTitle>
                <MDBCardText>
                  {dernierStagiaire.prenom} {dernierStagiaire.nom}
                </MDBCardText>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>

        <MDBCard className="shadow-3">
          <MDBCardBody>
            <MDBCardTitle>Liste des stagiaires</MDBCardTitle>

            <MDBInput
              label="Recherche par nom ou prénom"
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              className="mb-3"
              type="search"
              size="md"
            />

            <MDBBtn color="danger"
              className="mb-3"
              onClick={supprimerTousStagiaires}
              style={{width:"fit-content"}}
            >
              Supprimer tout
            </MDBBtn>

            {loading ? (
              <p>Chargement...</p>
            ) : erreur ? (
              <p style={{ color: "red" }}>{erreur}</p>
            ) : stagiairesFiltres.length === 0 ? (
              <p className="text-center text-muted mt-3">Aucun stagiaire</p>
            ) : (
              <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                <MDBTable responsive hover align="middle">
                  <MDBTableHead>
                    <tr>
                      <th>Nom</th>
                      <th>Prénom</th>
                      <th>Établissement</th>
                      <th>Mention</th>
                      <th>Niveau</th>
                      <th>Email</th>
                      <th>Actions</th>
                    </tr>
                  </MDBTableHead>
                  <MDBTableBody>
                    {stagiairesFiltres.map((stagiaire) => (
                      <tr key={stagiaire.id_stagiaire}>
                        <td>{stagiaire.nom}</td>
                        <td>{stagiaire.prenom}</td>
                        <td>{stagiaire.etab}</td>
                        <td>{stagiaire.mention}</td>
                        <td>{stagiaire.niveau}</td>
                        <td>{stagiaire.email}</td>
                        <td>
                          <MDBBtn
                            color="danger"
                            size="sm"
                            onClick={() => supprimerStagiaire(stagiaire.id_stagiaire)}
                          >
                            Supprimer
                          </MDBBtn>
                        </td>
                      </tr>
                    ))}
                  </MDBTableBody>
                </MDBTable>
              </div>
            )}
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    </>
  );
}
