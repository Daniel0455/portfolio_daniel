import {
  MDBCard,
  MDBCardBody,
  MDBInputGroup,
  MDBBtn,
} from "mdb-react-ui-kit";
import { useEffect, useState } from "react";

interface Message {
  id: number;
  auteur: "encadreur" | "stagiaire";
  contenu: string;
  date: string;
}

interface DiscussionProps {
  themeId: number;
  themeNom: string;
  stagiaires: string[];
  userId: number;
  userType: "encadreur" | "stagiaire";
}

export default function Discussion({
  themeId,
  themeNom,
  stagiaires,
  userId,
  userType,
}: DiscussionProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [nouveauMessage, setNouveauMessage] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    if (!themeId) {
      setMessages([]);
      return;
    }
    setLoadingMessages(true);
    fetch(`http://localhost:3000/api/encadreurs/themes/${themeId}/messages`)
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .finally(() => setLoadingMessages(false));
  }, [themeId]);

  const envoyerMessage = async () => {
    if (!nouveauMessage.trim() || !themeId) return;

    const res = await fetch(
      `http://localhost:3000/api/encadreurs/themes/${themeId}/messages`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contenu: nouveauMessage.trim(),
          user_id: userId,
          user_type: userType,
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

  function ConversationMessage({ messages }: { messages: Message[] }) {
    if (!messages || messages.length === 0) {
      return (
        <div className="text-center text-muted" style={{ marginTop: 50 }}>
          Aucun message
        </div>
      );
    }
    return (
      <div style={{ overflowY: "auto", maxHeight: "400px" }}>
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
                msg.auteur === "encadreur"
                  ? "bg-primary text-white"
                  : "bg-light"
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
      </div>
    );
  }

  return (
    <MDBCard className="shadow-3 h-100 d-flex flex-column">
      <MDBCardBody className="flex-grow-1 d-flex flex-column">
        <div className="border-bottom pb-2 mb-3">
          <h5>
            <i className="fas fa-comments me-2 text-primary" />
            {themeNom ?? "Sélectionnez un thème"}
          </h5>
          <small className="text-muted">
            {stagiaires.join(", ")}
          </small>
        </div>

        <div className="flex-grow-1 mb-3">
          {loadingMessages ? (
            <div className="text-center text-muted">Chargement...</div>
          ) : (
            <ConversationMessage messages={messages} />
          )}
        </div>

        {themeId && (
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
  );
}