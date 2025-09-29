"use client";

import NavBarEncadreur from "@/components/NavBarEncadreur";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBBtn,
  MDBInput,
  MDBBadge,
  MDBCheckbox,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from "mdb-react-ui-kit";
import { useState, useRef, useEffect } from "react";

interface Theme {
  id?: number; // id pour modification/suppression
  titre: string;
  fonctionnalites: string[];
  stagiaires: string[];
  trelloLink?: string;
}

interface ThemeSuggere {
  id_suggestion?: number;
  titre: string;
  stagiaire: string;
  fonctionnalites: string[];
}

export default function ThemePage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const suggereScrollRef = useRef<HTMLDivElement>(null);

  const [search, setSearch] = useState("");
  const [searchSuggere, setSearchSuggere] = useState("");
  const [searchStagiaire, setSearchStagiaire] = useState("");

  const [themes, setThemes] = useState<Theme[]>([]);
  const [suggeres, setSuggeres] = useState<ThemeSuggere[]>([]);
  const [stagiairesDispo, setStagiairesDispo] = useState<string[]>([]);
  const [chargementStagiaires, setChargementStagiaires] = useState(true);
  const [erreurStagiaires, setErreurStagiaires] = useState(false);

  const [nouveauTheme, setNouveauTheme] = useState<Theme>({
    titre: "",
    fonctionnalites: [],
    stagiaires: [],
  });
  const [fonctionnaliteTemp, setFonctionnaliteTemp] = useState("");

  const [idEncadreurConnecte, setIdEncadreurConnecte] = useState<string | null>(null);

  // ------- États pour le Modal d'édition -------
  const [editOpen, setEditOpen] = useState(false);
  const [editingTheme, setEditingTheme] = useState<Theme | null>(null);
  const [editTitre, setEditTitre] = useState("");
  const [editFonctionnalites, setEditFonctionnalites] = useState<string[]>([]);
  const [editFonctionnaliteTemp, setEditFonctionnaliteTemp] = useState("");
  const [editSearchStagiaire, setEditSearchStagiaire] = useState("");
  const [editStagiairesOptions, setEditStagiairesOptions] = useState<string[]>([]);
  const [editSelectedStagiaires, setEditSelectedStagiaires] = useState<string[]>([]);

  useEffect(() => {
    const id = localStorage.getItem("id_encadreur");
    setIdEncadreurConnecte(id);
  }, []);

  useEffect(() => {
    async function chargerThemes() {
      try {
        const res = await fetch("http://localhost:3000/api/encadreurs/themes");
        if (!res.ok) throw new Error("Erreur API thèmes");
        const data = await res.json();

        setThemes(
          data.map((t: any) => ({
            id: t.id_theme,
            titre: t.titre,
            fonctionnalites: t.fonctionnalites || t.fonctionnalite || [],
            stagiaires: t.stagiaires || [],
            trelloLink: t.trello_tab_id,
          }))
        );
      } catch (err) {
        console.error("Erreur récupération thèmes:", err);
      }
    }
    chargerThemes();
  }, []);

  useEffect(() => {
    async function chargerStagiaires() {
      try {
        setChargementStagiaires(true);
        const res = await fetch("http://localhost:3000/api/encadreurs/stagiaires-disponibles");
        if (!res.ok) throw new Error("Erreur API stagiaires dispo");
        const data = await res.json();
        const nomsComplets = data.map((s: any) => `${s.nom} ${s.prenom}`.trim());
        setStagiairesDispo(nomsComplets);
        setErreurStagiaires(false);
      } catch (err) {
        console.error("Erreur chargement stagiaires dispo:", err);
        setErreurStagiaires(true);
        setStagiairesDispo([]);
      } finally {
        setChargementStagiaires(false);
      }
    }
    chargerStagiaires();
  }, []);

  useEffect(() => {
    async function chargerThemesSuggere() {
      try {
        const res = await fetch("http://localhost:3000/api/encadreurs/themes-suggere");
        if (!res.ok) throw new Error("Erreur API thèmes suggérés");
        const data = await res.json();

        const enAttente = data.filter((item: any) => item.statut === "en_attente");

        setSuggeres(
          enAttente.map((item: any) => ({
            id_suggestion: item.id_suggestion,
            titre: item.titre,
            stagiaire: item.stagiaire,
            nom: item.nom,
            prenom: item.prenom,
            fonctionnalites:
              typeof item.fonctionnalites === "string"
                ? (() => {
                    try {
                      return JSON.parse(item.fonctionnalites);
                    } catch {
                      return [item.fonctionnalites];
                    }
                  })()
                : Array.isArray(item.fonctionnalites)
                ? item.fonctionnalites
                : [],
          }))
        );
      } catch (err) {
        console.error("Erreur récupération thèmes suggérés:", err);
      }
    }
    chargerThemesSuggere();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setNouveauTheme({ ...nouveauTheme, [e.target.name]: e.target.value });

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const checked = e.target.checked;
    let newStagiaires = [...nouveauTheme.stagiaires];
    if (checked) {
      if (!newStagiaires.includes(value)) newStagiaires.push(value);
    } else {
      newStagiaires = newStagiaires.filter((s) => s !== value);
    }
    setNouveauTheme({ ...nouveauTheme, stagiaires: newStagiaires });
  };

  const ajouterFonctionnalite = () => {
    const trimmed = fonctionnaliteTemp.trim();
    if (trimmed && !nouveauTheme.fonctionnalites.includes(trimmed)) {
      setNouveauTheme({
        ...nouveauTheme,
        fonctionnalites: [...nouveauTheme.fonctionnalites, trimmed],
      });
      setFonctionnaliteTemp("");
    }
  };

  const ajouterTheme = async () => {
    if (
      !nouveauTheme.titre.trim() ||
      nouveauTheme.fonctionnalites.length === 0 ||
      nouveauTheme.stagiaires.length === 0
    ) {
      alert("Tous les champs sont obligatoires.");
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/api/encadreurs/themes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titre: nouveauTheme.titre,
          fonctionnalites: nouveauTheme.fonctionnalites,
          stagiaires: nouveauTheme.stagiaires,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        alert(`Erreur lors de l'ajout: ${errorData.message || "Erreur serveur"}`);
        return;
      }
      alert("Thème ajouté avec succès");
      setThemes((prev) => [...prev, nouveauTheme]);
      setStagiairesDispo((prev) => prev.filter((s) => !nouveauTheme.stagiaires.includes(s)));
      setNouveauTheme({ titre: "", fonctionnalites: [], stagiaires: [] });
      setFonctionnaliteTemp("");
      setSearchStagiaire("");
    } catch (err) {
      console.error("Erreur ajout thème frontend:", err);
      alert("Erreur réseau lors de l'ajout du thème.");
    }
  };

  const supprimerTheme = async (id: number | undefined) => {
    if (!id) return;
    if (!confirm("Voulez-vous vraiment supprimer ce thème ?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/encadreurs/themes/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erreur suppression thème");
      // réinjecter les stagiaires de ce thème dans la liste des disponibles
      const themeSupprime = themes.find((t) => t.id === id);
      if (themeSupprime) {
        setStagiairesDispo((prev) => {
          const toAdd = themeSupprime.stagiaires.filter((name) => !prev.includes(name));
          return [...prev, ...toAdd];
        });
      }
      setThemes((prev) => prev.filter((t) => t.id !== id));
      alert("Thème supprimé avec succès !");
    } catch (err) {
      console.error(err);
      alert("Impossible de supprimer ce thème.");
    }
  };

  const validerThemeSuggere = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:3000/api/encadreurs/themes-suggere/${id}/valider`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_encadreur: idEncadreurConnecte }),
      });
      if (!res.ok) throw new Error("Erreur validation thème suggéré");

      const themeValide = suggeres.find((t) => t.id_suggestion === id);
      if (themeValide) {
        setThemes((prev) => [
          ...prev,
          {
            titre: themeValide.titre,
            fonctionnalites: themeValide.fonctionnalites,
            stagiaires: [themeValide.stagiaire],
          },
        ]);
      }

      setSuggeres((prev) => prev.filter((t) => t.id_suggestion !== id));
      alert("Thème validé avec succès !");
    } catch (err) {
      console.error(err);
      alert("Impossible de valider ce thème suggéré.");
    }
  };

  const refuserThemeSuggere = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:3000/api/encadreurs/themes-suggere/${id}/refuser`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Erreur refus thème suggéré");
      setSuggeres((prev) => prev.filter((t) => t.id_suggestion !== id));
      alert("Thème refusé avec succès !");
    } catch (err) {
      console.error(err);
      alert("Impossible de refuser ce thème suggéré.");
    }
  };

  const ouvrirTrello = (theme: Theme) => {
    if (theme.trelloLink && theme.trelloLink.trim() !== "") {
      window.open(theme.trelloLink, "_blank");
    } else {
      alert("Aucun lien Trello disponible pour ce thème.");
    }
  };

  // --------- Modal d'édition : helpers ----------
  const openEditModal = (theme: Theme) => {
    setEditingTheme(theme);
    setEditTitre(theme.titre);
    setEditFonctionnalites([...theme.fonctionnalites]);
    setEditFonctionnaliteTemp("");
    setEditSearchStagiaire("");

    // Les options de stagiaires dans le modal = stagiaires disponibles + ceux déjà sur ce thème
    const union = Array.from(
      new Set<string>([...stagiairesDispo, ...theme.stagiaires].map((s) => s.trim()))
    ).filter(Boolean);
    setEditStagiairesOptions(union);

    setEditSelectedStagiaires([...theme.stagiaires]);
    setEditOpen(true);
  };

  const closeEditModal = () => {
    setEditOpen(false);
    setEditingTheme(null);
    setEditTitre("");
    setEditFonctionnalites([]);
    setEditFonctionnaliteTemp("");
    setEditSearchStagiaire("");
    setEditStagiairesOptions([]);
    setEditSelectedStagiaires([]);
  };

  const addEditFonctionnalite = () => {
    const trimmed = editFonctionnaliteTemp.trim();
    if (trimmed && !editFonctionnalites.includes(trimmed)) {
      setEditFonctionnalites((prev) => [...prev, trimmed]);
      setEditFonctionnaliteTemp("");
    }
  };

  const removeEditFonctionnalite = (f: string) => {
    setEditFonctionnalites((prev) => prev.filter((x) => x !== f));
  };

  const toggleEditStagiaire = (value: string, checked: boolean) => {
    setEditSelectedStagiaires((prev) => {
      if (checked) {
        if (!prev.includes(value)) return [...prev, value];
        return prev;
      }
      return prev.filter((s) => s !== value);
    });
  };

  const filteredEditOptions = editStagiairesOptions.filter((s) =>
    s.toLowerCase().includes(editSearchStagiaire.toLowerCase())
  );

  const modifierTheme = async () => {
    if (!editingTheme?.id) {
      alert("Thème introuvable.");
      return;
    }
    const titreTrim = editTitre.trim();
    if (!titreTrim) {
      alert("Le titre est requis.");
      return;
    }

    // Calcul stagiaires retirés et ajoutés
    const prevStagiaires = editingTheme.stagiaires;
    const newStagiaires = editSelectedStagiaires;
    const removed = prevStagiaires.filter((s) => !newStagiaires.includes(s));
    const added = newStagiaires.filter((s) => !prevStagiaires.includes(s));

    try {
      const res = await fetch(`http://localhost:3000/api/encadreurs/themes/${editingTheme.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titre: titreTrim,
          fonctionnalites: editFonctionnalites,
          stagiaires: newStagiaires, // noms "Nom Prénom"
          stagiairesRetires: removed, // stagiaires à dissocier
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Erreur serveur lors de la modification");
      }

      // MAJ front locale : thèmes + stagiaires disponibles
      setThemes((prev) =>
        prev.map((t) =>
          t.id === editingTheme.id
            ? {
                ...t,
                titre: titreTrim,
                fonctionnalites: [...editFonctionnalites],
                stagiaires: [...newStagiaires],
              }
            : t
        )
      );

      setStagiairesDispo((prev) => {
        let next = [...prev];
        next = next.filter((name) => !added.includes(name));
        for (const name of removed) {
          if (!next.includes(name)) next.push(name);
        }
        return next;
      });

      alert("Thème modifié avec succès !");
      closeEditModal();
    } catch (error) {
      console.error(error);
      alert((error as Error).message || "Impossible de modifier le thème.");
    }
  };

  // --------- Filtres et scroll ---------
  const filteredThemes = themes.filter((theme) =>
    theme.titre.toLowerCase().includes(search.toLowerCase())
  );
  const filteredSuggeres = suggeres.filter(
    (item) =>
      item.titre.toLowerCase().includes(searchSuggere.toLowerCase()) ||
      item.stagiaire.toLowerCase().includes(searchSuggere.toLowerCase())
  );
  const filteredStagiairesDispo = stagiairesDispo.filter((s) =>
    s.toLowerCase().includes(searchStagiaire.toLowerCase())
  );

  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  const scrollSuggereLeft = () =>
    suggereScrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  const scrollSuggereRight = () =>
    suggereScrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });

  // --------- RENDER ----------
  return (
    <>
      <NavBarEncadreur />
      <MDBContainer className="mt-4" style={{ backgroundColor: "white", color: "#333" }}>
        {/* Liste des thèmes */}
        <h3 className="mb-3">
          <i className="fas fa-clipboard-list me-2"></i>Liste des Thèmes
        </h3>
        <MDBRow className="mb-3">
          <MDBCol md="6">
            <MDBInput
              label="Rechercher un thème"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </MDBCol>
        </MDBRow>
        <div className="position-relative">
          <button
            className="btn btn-primary shadow d-flex align-items-center justify-content-center"
            onClick={scrollLeft}
            style={{
              position: "absolute",
              left: 0,
              top: "50%",
              transform: "translateY(-50%) translateX(-50%)",
              zIndex: 2,
              borderRadius: "50%",
              width: "45px",
              height: "45px",
            }}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <button
            className="btn btn-primary shadow d-flex align-items-center justify-content-center"
            onClick={scrollRight}
            style={{
              position: "absolute",
              right: 0,
              top: "50%",
              transform: "translateY(-50%) translateX(50%)",
              zIndex: 2,
              borderRadius: "50%",
              width: "45px",
              height: "45px",
            }}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
          <div
            className="d-flex gap-3 overflow-auto pb-3 px-5"
            ref={scrollRef}
            style={{
              whiteSpace: "nowrap",
              scrollSnapType: "x mandatory",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {filteredThemes.map((theme, index) => (
              <div
                key={index}
                style={{
                  minWidth: "300px",
                  scrollSnapAlign: "start",
                  height: "380px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <MDBCard
                  background="light"
                  className="shadow-sm h-100 d-flex flex-column"
                  style={{ overflow: "auto" }}
                >
                  <MDBCardBody
                    className="d-flex flex-column flex-grow-1"
                    style={{ backgroundColor: "#D0E6FF" }}
                  >
                    <MDBCardTitle>{theme.titre}</MDBCardTitle>
                    <div className="mt-2">
                      <p className="mb-1 fw-bold">
                        <i className="fas fa-list me-1"></i>Fonctionnalités :
                      </p>
                      <div className="d-flex flex-wrap gap-2">
                        {theme.fonctionnalites.map((fct, i) => (
                          <MDBBadge color="info" key={i}>
                            {fct}
                          </MDBBadge>
                        ))}
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="mb-0 fw-bold">
                        <i className="fas fa-users me-1"></i>Stagiaires :
                      </p>
                      <p>{theme.stagiaires.join(", ")}</p>
                    </div>
                  </MDBCardBody>
                </MDBCard>
                <div className="mt-auto d-flex justify-content-end gap-2 mb-2 me-2">
                  <MDBBtn size="sm" color="danger" onClick={() => supprimerTheme(theme.id)}>
                    <i className="fas fa-trash"></i>
                  </MDBBtn>
                  <MDBBtn
                    size="sm"
                    color="secondary"
                    onClick={() => openEditModal(theme)}
                    disabled={!theme.id}
                  >
                    <i className="fas fa-cog"></i>
                  </MDBBtn>
                  <MDBBtn size="sm" color="primary" onClick={() => ouvrirTrello(theme)}>
                    <i className="fab fa-trello"></i>
                  </MDBBtn>
                </div>
              </div>
            ))}
          </div>
        </div>

        <hr className="my-5" />

        {/* Formulaire création */}
        <h3 className="mb-3">
          <i className="fas fa-plus-circle me-2"></i>Créer un Nouveau Thème
        </h3>
        <MDBRow className="gy-4">
          <MDBCol md="6">
            <MDBInput
              label="Titre du thème"
              name="titre"
              value={nouveauTheme.titre}
              onChange={handleInputChange}
            />
          </MDBCol>
          <MDBCol md="6">
            <label className="form-label fw-bold">Rechercher un stagiaire</label>
            <MDBInput
              placeholder="Recherche rapide"
              value={searchStagiaire}
              onChange={(e) => setSearchStagiaire(e.target.value)}
              className="mb-2"
              disabled={chargementStagiaires || erreurStagiaires}
            />
            {searchStagiaire && (
              <MDBBtn
                size="sm"
                color="danger"
                className="mb-3"
                onClick={() => setSearchStagiaire("")}
              >
                Effacer
              </MDBBtn>
            )}
            <label className="form-label fw-bold">Stagiaires disponibles</label>
            <div
              className="d-flex flex-column custom-checkbox"
              style={{ maxHeight: "150px", overflowY: "auto" }}
            >
              {chargementStagiaires && <p>Chargement des stagiaires...</p>}
              {erreurStagiaires && (
                <p className="text-danger">Erreur lors du chargement des stagiaires.</p>
              )}
              {!chargementStagiaires &&
                !erreurStagiaires &&
                filteredStagiairesDispo.length === 0 && (
                  <p className="text-muted">Aucun stagiaire disponible</p>
                )}
              {!chargementStagiaires &&
                !erreurStagiaires &&
                filteredStagiairesDispo.map((stagiaire, i) => (
                  <MDBCheckbox
                    key={i}
                    name="stagiaires"
                    value={stagiaire}
                    label={stagiaire}
                    checked={nouveauTheme.stagiaires.includes(stagiaire)}
                    onChange={handleCheckboxChange}
                  />
                ))}
            </div>
          </MDBCol>
          <MDBCol md="12">
            <MDBInput
              label="Ajouter une fonctionnalité"
              value={fonctionnaliteTemp}
              onChange={(e) => setFonctionnaliteTemp(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && ajouterFonctionnalite()}
              className="mb-2"
            />
            <MDBBtn size="sm" color="info" onClick={ajouterFonctionnalite} style={{ width: "fit-content" }}>
              <i className="fas fa-plus me-1"></i>Ajouter
            </MDBBtn>
            <div className="mt-3 d-flex flex-wrap gap-2">
              {nouveauTheme.fonctionnalites.map((fct, i) => (
                <MDBBadge key={i} color="primary">
                  {fct}
                </MDBBadge>
              ))}
            </div>
          </MDBCol>
          <MDBCol>
            <MDBBtn color="primary" onClick={ajouterTheme} style={{ width: "fit-content" }}>
              <i className="fas fa-check me-2"></i>Créer
            </MDBBtn>
          </MDBCol>
        </MDBRow>

        <hr className="my-5" />

        {/* Thèmes suggérés */}
        <h3 className="mb-4">
          <i className="fas fa-lightbulb me-2"></i>Thèmes Suggérés par les Stagiaires
        </h3>
        <MDBRow className="mb-3">
          <MDBCol md="6">
            <MDBInput
              label="Rechercher un thème suggéré"
              value={searchSuggere}
              onChange={(e) => setSearchSuggere(e.target.value)}
            />
          </MDBCol>
        </MDBRow>
        <div className="position-relative">
          <button
            className="btn btn-primary shadow d-flex align-items-center justify-content-center"
            onClick={scrollSuggereLeft}
            style={{
              position: "absolute",
              left: 0,
              top: "50%",
              transform: "translateY(-50%) translateX(-50%)",
              zIndex: 2,
              borderRadius: "50%",
              width: "45px",
              height: "45px",
            }}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <button
            className="btn btn-primary shadow d-flex align-items-center justify-content-center"
            onClick={scrollSuggereRight}
            style={{
              position: "absolute",
              right: 0,
              top: "50%",
              transform: "translateY(-50%) translateX(50%)",
              zIndex: 2,
              borderRadius: "50%",
              width: "45px",
              height: "45px",
            }}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
          <div
            className="d-flex gap-3 overflow-auto pb-3 px-5"
            ref={suggereScrollRef}
            style={{
              whiteSpace: "nowrap",
              scrollSnapType: "x mandatory",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {filteredSuggeres.length === 0 && (
              <div style={{ minWidth: "300px" }}>
                <p>Aucun thème suggéré trouvé.</p>
              </div>
            )}
            {filteredSuggeres.map((theme, index) => (
              <div
                key={index}
                style={{
                  minWidth: "300px",
                  scrollSnapAlign: "start",
                  height: "380px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <MDBCard
                  background="light"
                  className="shadow-sm h-100 d-flex flex-column"
                  style={{ overflow: "auto" }}
                >
                  <MDBCardBody className="d-flex flex-column flex-grow-1">
                    <MDBCardTitle>{theme.titre}</MDBCardTitle>

                    <div className="mt-2">
                      <p className="mb-1 fw-bold">
                        <i className="fas fa-list me-1"></i>Fonctionnalités :
                      </p>
                      <div className="d-flex flex-wrap gap-2">
                        {theme.fonctionnalites?.map((fct, i) => (
                          <MDBBadge color="warning" key={i}>
                            {fct}
                          </MDBBadge>
                        ))}
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="mb-0 fw-bold">
                        <i className="fas fa-user me-1"></i>Stagiaire :
                      </p>
                      <p>
                        {theme.prenom ? `${theme.prenom} ${theme.nom}` : "Nom non disponible"}
                      </p>
                    </div>

                    <div className="mt-auto d-flex justify-content-between gap-2">
                      <MDBBtn
                        size="sm"
                        color="success"
                        onClick={() =>
                          theme.id_suggestion !== undefined &&
                          validerThemeSuggere(theme.id_suggestion)
                        }
                      >
                        Valider
                      </MDBBtn>
                      <MDBBtn
                        size="sm"
                        color="danger"
                        onClick={() =>
                          theme.id_suggestion !== undefined &&
                          refuserThemeSuggere(theme.id_suggestion)
                        }
                      >
                        Refuser
                      </MDBBtn>
                    </div>
                  </MDBCardBody>
                </MDBCard>

              </div>
            ))}
          </div>
        </div>
      </MDBContainer>

      {/* Modal d'édition */}
      <MDBModal show={editOpen} setShow={setEditOpen} tabIndex="-1">
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Modifier le thème</MDBModalTitle>
              <MDBBtn className="btn-close" color="none" onClick={closeEditModal}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <div className="mb-3">
                <MDBInput
                  label="Titre du thème"
                  value={editTitre}
                  onChange={(e) => setEditTitre(e.target.value)}
                />
              </div>

              <div className="mb-2">
                <MDBInput
                  label="Ajouter une fonctionnalité"
                  value={editFonctionnaliteTemp}
                  onChange={(e) => setEditFonctionnaliteTemp(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addEditFonctionnalite()}
                />
                <MDBBtn className="mt-2" size="sm" color="info" onClick={addEditFonctionnalite}>
                  <i className="fas fa-plus me-1"></i>Ajouter
                </MDBBtn>
              </div>

              <div className="d-flex flex-wrap gap-2 mb-3">
                {editFonctionnalites.map((fct, i) => (
                  <span key={i} className="d-inline-flex align-items-center">
                    <MDBBadge color="primary" className="me-1">
                      {fct}
                    </MDBBadge>
                    <MDBBtn size="sm" color="danger" onClick={() => removeEditFonctionnalite(fct)}>
                      <i className="fas fa-times"></i>
                    </MDBBtn>
                  </span>
                ))}
              </div>

              <hr />

              <label className="form-label fw-bold">Stagiaires</label>
              <MDBInput
                placeholder="Rechercher un stagiaire"
                value={editSearchStagiaire}
                onChange={(e) => setEditSearchStagiaire(e.target.value)}
                className="mb-2"
              />
              <div
                className="d-flex flex-column custom-checkbox"
                style={{ maxHeight: "200px", overflowY: "auto" }}
              >
                {filteredEditOptions.length === 0 && (
                  <p className="text-muted">Aucun stagiaire</p>
                )}
                {filteredEditOptions.map((stagiaire, i) => (
                  <MDBCheckbox
                    key={i}
                    name="edit-stagiaires"
                    value={stagiaire}
                    label={stagiaire}
                    checked={editSelectedStagiaires.includes(stagiaire)}
                    onChange={(e) => toggleEditStagiaire(stagiaire, e.target.checked)}
                  />
                ))}
              </div>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={closeEditModal}>
                Annuler
              </MDBBtn>
              <MDBBtn color="primary" onClick={modifierTheme}>
                Enregistrer
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>

      {/* Styles globaux */}
      <style jsx global>{`
        /* Cacher scrollbar */
        div::-webkit-scrollbar {
          display: none;
        }
        div {
          -ms-overflow-style: none; /* IE et Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>

      {/* Styles checkbox personnalisés */}
      <style jsx>{`
        .custom-checkbox .form-check-input {
          width: 22px;
          height: 22px;
          cursor: pointer;
          accent-color: #0d6efd;
          border-radius: 5px;
          border: 2px solid #0d6efd;
          transition: background-color 0.3s ease, border-color 0.3s ease;
        }
        .custom-checkbox .form-check-input:checked {
          background-color: #0d6efd;
          border-color: #0a58ca;
        }
        .custom-checkbox .form-check-label {
          font-weight: 500;
          user-select: none;
          cursor: pointer;
          margin-left: 8px;
          color: #212529;
        }
        .custom-checkbox .form-check-input:focus {
          box-shadow: 0 0 5px #0d6efd88 !important;
          outline: none !important;
        }
      `}</style>
    </>
  );
}
