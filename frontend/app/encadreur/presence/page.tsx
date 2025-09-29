"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import NavBarEncadreur from "@/components/NavBarEncadreur";
import {
  MDBContainer,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBBadge,
  MDBInput,
} from "mdb-react-ui-kit";

interface Presence {
  date: string;
  etat: "present" | "absent";
}

export default function PresencePage() {
  const searchParams = useSearchParams();
  const id_stagiaire = searchParams.get("id_stagiaire");

  const [presences, setPresences] = useState<Presence[]>([]);
  const [loading, setLoading] = useState(true);
  const [recherche, setRecherche] = useState("");
  const [mounted, setMounted] = useState(false); // <- état pour hydration

  useEffect(() => {
    setMounted(true); // <- composant monté côté client
  }, []);

  useEffect(() => {
    if (!id_stagiaire) return;

    const fetchPresences = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/encadreurs/presence-toutes/${id_stagiaire}`
        );
        if (!response.ok) throw new Error("Erreur API présence");
        const data: Presence[] = await response.json();
        setPresences(data);
      } catch (error) {
        console.error(error);
        alert("Impossible de récupérer l'historique de présence.");
      } finally {
        setLoading(false);
      }
    };

    fetchPresences();
  }, [id_stagiaire]);

  const presencesFiltres = presences.filter((p) =>
    mounted
      ? new Date(p.date).toLocaleDateString().includes(recherche)
      : true
  );

  if (!mounted) return null; // on ne rend rien côté serveur

  return (
    <>
      <NavBarEncadreur />
      <MDBContainer className="mt-4" style={{ backgroundColor: "white" }}>
        <h2>Historique de présence</h2>

        <MDBInput
          label="Rechercher par date"
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          className="mb-3"
          type="search"
          size="md"
        />

        {loading ? (
          <p>Chargement...</p>
        ) : presencesFiltres.length === 0 ? (
          <p>Aucune donnée de présence disponible.</p>
        ) : (
          <MDBTable bordered hover>
            <MDBTableHead>
              <tr>
                <th>Date</th>
                <th>État</th>
              </tr>
            </MDBTableHead>
            <MDBTableBody>
              {presencesFiltres.map((p, idx) => (
                <tr key={idx}>
                  <td>{new Date(p.date).toLocaleDateString()}</td>
                  <td>
                    {p.etat === "present" ? (
                      <MDBBadge color="success">Présent</MDBBadge>
                    ) : (
                      <MDBBadge color="danger">Absent</MDBBadge>
                    )}
                  </td>
                </tr>
              ))}
            </MDBTableBody>
          </MDBTable>
        )}
      </MDBContainer>
    </>
  );
}
