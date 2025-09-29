"use client";

import NavBarEncadreur from "@/components/NavBarEncadreur";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBListGroup,
  MDBListGroupItem,
  MDBBtn,
  MDBInputGroup,
  MDBBadge,
} from "mdb-react-ui-kit";
import { useEffect, useState, useRef } from "react";

interface Message {
  id: number;
  auteur: "encadreur" | "stagiaire";
  contenu: string;
  date: string;
}

interface Theme {
  id: number;
  nom: string;
  stagiaires: string[];
  id_encadreur: number | string;
}

export default function Home() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [themeActif, setThemeActif] = useState<Theme | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [nouveauMessage, setNouveauMessage] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);

  const [idEncadreurConnecte, setIdEncadreurConnecte] = useState<string | null>(
    null
  );

  // ✅ gestion sidebar responsive
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ✅ éviter hydratation
  const [mounted, setMounted] = useState(false);

  // ✅ ref pour scroll automatique
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Récupérer l'id de l'encadreur connecté depuis localStorage
  useEffect(() => {
    const id = localStorage.getItem("id_encadreur");
    setIdEncadreurConnecte(id);
  }, []);

  useEffect(() => {
    if (!idEncadreurConnecte) return;
    fetch("http://localhost:3000/api/encadreurs/themes")
      .then((res) => res.json())
      .then((data) => {
        const themesAdapted = data
          .map((t: any) => ({
            id: t.id_theme,
            nom: t.titre,
            stagiaires: Array.isArray(t.stagiaires) ? t.stagiaires : [],
            id_encadreur: t.id_enc,
          }))
          .filter(
            (theme) =>
              String(theme.id_encadreur) === String(idEncadreurConnecte)
          );

        setThemes(themesAdapted);
        if (themesAdapted.length > 0) setThemeActif(themesAdapted[0]);
        else setThemeActif(null);
      });
  }, [idEncadreurConnecte]);

  // Charger les messages du thème actif
  useEffect(() => {
    if (!themeActif) {
      setMessages([]);
      return;
    }
    setLoadingMessages(true);
    fetch(
      `http://localhost:3000/api/encadreurs/themes/${themeActif.id}/messages`
    )
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .finally(() => setLoadingMessages(false));
  }, [themeActif]);

  // Scroll automatique vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Envoi d'un message
  const envoyerMessage = async () => {
    if (!nouveauMessage.trim() || !themeActif) return;

    const res = await fetch(
      `http://localhost:3000/api/encadreurs/themes/${themeActif.id}/messages`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contenu: nouveauMessage.trim(),
          user_id: idEncadreurConnecte,
          user_type: "encadreur",
        }),
      }
    );
    if (res.ok) {
      const nouveau = await res.json();
      setMessages([...messages, nouveau]);
      setNouveauMessage("");
    } else {
      alert("Erreur lors de l'envoi du message");
    }
  };

  // Composant pour afficher la conversation
  function ConversationMessage({ messages }: { messages: Message[] }) {
    if (!messages || messages.length === 0) {
      return (
        <div className="text-center text-muted" style={{ marginTop: 50 }}>
          Aucun message
        </div>
      );
    }
    return (
      <div
        style={{
          overflowY: "auto",
          flexGrow: 1,
          paddingRight: "5px",
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`d-flex mb-2 ${
              msg.auteur === "encadreur"
                ? "justify-content-end"
                : "justify-content-start"
            }`}
          >
            <div
              className={`p-2 rounded-3 ${
                msg.auteur === "encadreur" ? "bg-primary text-white" : "bg-light"
              }`}
              style={{ maxWidth: "70%" }}
            >
              <div className="fw-bold small mb-1">
                {msg.auteur === "encadreur" ? "Encadreur" : "Stagiaire"}
              </div>
              <div>{msg.contenu}</div>
              <div className="text-muted small text-end">{msg.date}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    );
  }

  return (
    <>
      <NavBarEncadreur />
      <MDBContainer
        fluid
        className="mt-4 position-relative"
        style={{ height: "calc(100vh - 70px)" }}
      >
        <MDBRow className="h-100">
          {/* LISTE DES THEMES */}
          <MDBCol
            md="3"
            className={`h-100 bg-white position-absolute position-md-static top-0 start-0 shadow-3 
            ${sidebarOpen ? "d-block" : "d-none"} d-md-block`}
            style={{ zIndex: 1, maxWidth: "300px" }}
          >
            <MDBCard className="h-100">
              <MDBCardBody className="p-0" style={{ overflowY: "auto" }}>
                <MDBListGroup className="list-group-flush">
                  {themes.map((theme) => (
                    <MDBListGroupItem
                      key={theme.id}
                      action
                      onClick={() => {
                        setThemeActif(theme);
                        setSidebarOpen(false);
                      }}
                      className={`d-flex justify-content-between align-items-center ${
                        themeActif?.id === theme.id ? "active" : ""
                      }`}
                      style={{ cursor: "pointer" }}
                    >
                      <span>
                        <i className="fas fa-layer-group me-2 text-primary" />
                        {theme.nom}
                      </span>
                      <MDBBadge color="primary" pill>
                        {themeActif?.id === theme.id ? messages.length : ""}
                      </MDBBadge>
                    </MDBListGroupItem>
                  ))}
                </MDBListGroup>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>

          {/* DISCUSSION */}
          <MDBCol md="9" className="offset-md-3 h-100 position-absolute position-md-static top-0 start-0 shadow-3"
          >
            <MDBCard className="shadow-3 h-100 d-flex flex-column">
              <MDBCardBody className="flex-grow-1 d-flex flex-column p-3"  style={{overflowY:'auto'}}>
                <div className="border-bottom pb-2 mb-3">
                  <h5>
                    <i className="fas fa-comments me-2 text-primary" />
                    {themeActif?.nom ?? "Sélectionnez un thème"}
                  </h5>
                  <small className="text-muted">
                    {themeActif?.stagiaires.join(", ")}
                  </small>
                </div>

                <div
                  className="flex-grow-1 mb-3 d-flex flex-column"
                  style={{ overflowY: "auto" }}
                >
                  {loadingMessages ? (
                    <div className="text-center text-muted">Chargement...</div>
                  ) : (
                    <ConversationMessage messages={messages} />
                  )}
                </div>

                {themeActif && (
                  <MDBInputGroup>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Écrire un message..."
                      value={nouveauMessage}
                      onChange={(e) => setNouveauMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && envoyerMessage()}
                    />
                    <MDBBtn
                      style={{ width: "fit-content" }}
                      color="primary"
                      onClick={envoyerMessage}
                    >
                      <i className="fas fa-paper-plane" />
                    </MDBBtn>
                  </MDBInputGroup>
                )}
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>

        {/* ✅ Bouton flottant pour sidebar mobile */}
        {mounted && (
          <MDBBtn
            color="primary"
            floating
            className="d-md-none position-absolute"
            style={{ top: "20px", left: "20px", zIndex: 1100 }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <i className="fas fa-message"></i>
          </MDBBtn>
        )}
      </MDBContainer>
    </>
  );
}
