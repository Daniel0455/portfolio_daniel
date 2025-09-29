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
  MDBBtn,
} from "mdb-react-ui-kit";

interface Note {
  nom_matiere: string;
  note: number;
  field: string;
  modifie?: boolean;
}

export default function NotesPage({ params }: { params: { id: string } }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [recherche, setRecherche] = useState("");
  const [moyenne, setMoyenne] = useState<number | null>(null);
  const [mention, setMention] = useState<string>("");

  const searchParams = useSearchParams();
  const id_stagiaire = searchParams.get("id_stagiaire") || params.id;

  // Charger les notes depuis le backend
  useEffect(() => {
    if (!id_stagiaire) return;

    const fetchNotes = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/encadreurs/bulletins/note/${id_stagiaire}`);
        if (!res.ok) throw new Error("Erreur lors du chargement des notes");
        const data = await res.json();

        const notesBDD: Note[] = [
          { nom_matiere: "Respect du temps", note: Number(data.temps ?? 0), field: "temps" },
          { nom_matiere: "Niveau technique", note: Number(data.technique ?? 0), field: "technique" },
          { nom_matiere: "Intégration dans l'équipe", note: Number(data.equipe ?? 0), field: "equipe" },
          { nom_matiere: "Autonomie dans le travail", note: Number(data.autonomie ?? 0), field: "autonomie" },
          { nom_matiere: "Discipline", note: Number(data.discipline ?? 0), field: "discipline" },
        ];

        setNotes(notesBDD);
        calculerMoyenne(notesBDD);
      } catch (err) {
        console.error(err);
        alert("Impossible de charger les notes.");
      }
    };

    fetchNotes();
  }, [id_stagiaire]);

  const calculerMoyenne = (notesArray: Note[]) => {
    if (!notesArray.length) {
      setMoyenne(null);
      setMention("");
      return;
    }
    const total = notesArray.reduce((acc, n) => acc + (n.note ?? 0), 0);
    const moy = total / notesArray.length;
    setMoyenne(moy);

    if (moy < 10) setMention("Faible");
    else if (moy >= 10 && moy < 12) setMention("Passable");
    else if (moy >= 12 && moy < 14) setMention("Assez bien");
    else if (moy >= 14 && moy < 16) setMention("Bien");
    else if (moy >= 16 && moy <= 17) setMention("Très bien");
    else if (moy > 17) setMention("Excellent");
  };

  const modifierNote = (field: string, nouvelleValeur: number) => {
    if (nouvelleValeur < 0 || nouvelleValeur > 20) return;
    const updatedNotes = notes.map((n) =>
      n.field === field ? { ...n, note: nouvelleValeur, modifie: true } : n
    );
    setNotes(updatedNotes);
    calculerMoyenne(updatedNotes);
  };

  const auMoinsUneNoteModifiee = notes.some((n) => n.modifie);

  // Enregistrer les notes sur le backend
  const enregistrerNotes = async () => {
    if (!id_stagiaire) {
      alert("id_stagiaire requis pour enregistrer les notes.");
      return;
    }

    const payload = {
      id_stagiaire,
      ...notes.reduce((acc, n) => {
        acc[n.field] = n.note;
        return acc;
      }, {} as Record<string, number>),
    };

    try {
      const res = await fetch(`http://localhost:3000/api/encadreurs/bulletins/note/${id_stagiaire}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Notes enregistrées !");
        setNotes(notes.map((n) => ({ ...n, modifie: false })));
      } else {
        // Vérification si le backend renvoie JSON ou HTML
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errData = await res.json();
          alert("Erreur lors de l'enregistrement : " + (errData.message || "Erreur inconnue"));
        } else {
          const errText = await res.text();
          alert("Erreur lors de l'enregistrement : " + errText);
        }
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'enregistrement des notes.");
    }
  };

  const notesFiltres = notes.filter((n) =>
    n.nom_matiere.toLowerCase().includes(recherche.toLowerCase())
  );

  return (
    <>
      <NavBarEncadreur />
      <MDBContainer className="mt-4" style={{ backgroundColor: "white", padding: "1rem", borderRadius: "8px" }}>
        <h2>Bulletin du stagiaire</h2>

        <MDBInput
          label="Rechercher par critère"
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          className="mb-3"
          type="search"
          size="md"
        />

        <MDBTable bordered hover responsive>
          <MDBTableHead>
            <tr>
              <th>Critère</th>
              <th>Note /20</th>
              <th>Action</th>
            </tr>
          </MDBTableHead>
          <MDBTableBody>
            {notesFiltres.map((n, idx) => (
              <tr key={idx}>
                <td>
                  {n.nom_matiere}{" "}
                  {n.modifie && <MDBBadge color="warning" className="ms-2">Modifié</MDBBadge>}
                </td>
                <td>
                  <MDBBadge color={n.note >= 10 ? "success" : "danger"}>{n.note}</MDBBadge>
                </td>
                <td>
                  <MDBBtn
                    size="sm"
                    color="info"
                    onClick={() => {
                      const nouvelleValeur = Number(
                        prompt(`Entrer la nouvelle note pour ${n.nom_matiere} (0-20) :`, n.note.toString())
                      );
                      if (!isNaN(nouvelleValeur) && nouvelleValeur >= 0 && nouvelleValeur <= 20) {
                        modifierNote(n.field, nouvelleValeur);
                      } else {
                        alert("Veuillez entrer une valeur valide entre 0 et 20.");
                      }
                    }}
                  >
                    Modifier
                  </MDBBtn>
                </td>
              </tr>
            ))}
          </MDBTableBody>
        </MDBTable>

        <p className="mt-3" style={{ color: "#333", fontWeight: "bold", fontSize: "1.1rem" }}>
          <strong>Moyenne générale :</strong> {moyenne !== null ? moyenne.toFixed(2) : "-"}
        </p>
        <p style={{ color: mention === "Faible" ? "red" : "green", fontWeight: "bold" }}>
          <strong>Mention :</strong> {mention || "-"}
        </p>

        {auMoinsUneNoteModifiee && (
          <MDBBtn color="success" className="mt-3" onClick={enregistrerNotes}>
            Enregistrer
          </MDBBtn>
        )}
      </MDBContainer>
    </>
  );
}
