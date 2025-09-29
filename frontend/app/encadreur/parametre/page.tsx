"use client";

import NavBarEncadreur from "@/components/NavBarEncadreur";
import { MDBContainer, MDBCard, MDBCardBody, MDBInput, MDBBtn } from "mdb-react-ui-kit";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const route = useRouter();
  const [formData, setFormData] = useState({
    nomUtilisateur: "",
    email: "",
    ancienMotDePasse: "",
    nouveauMotDePasse: "",
    confirmerMotDePasse: "",
  });

  const [erreur, setErreur] = useState("");
  const [succes, setSucces] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const idEncadreur = typeof window !== "undefined" ? localStorage.getItem("id_encadreur") : null;

  useEffect(() => {
    if (!idEncadreur) {
      setErreur("Aucun ID encadreur trouvé.");
      return;
    }

    fetch(`http://localhost:3000/api/encadreurs/${idEncadreur}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Impossible de récupérer les données.");
        const data = await res.json();
        setFormData((prev) => ({
          ...prev,
          nomUtilisateur: data.nom || "",
          email: data.email || "",
        }));
      })
      .catch((err) => setErreur(err.message));
  }, [idEncadreur]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErreur("");
    setSucces("");
  };

  const validerFormulaire = () => {
    if (!formData.nomUtilisateur.trim()) return setErreur("Le nom d'utilisateur est requis."), false;
    if (!formData.email.trim()) return setErreur("L'email est requis."), false;
    if (formData.nouveauMotDePasse && formData.nouveauMotDePasse !== formData.confirmerMotDePasse)
      return setErreur("Les nouveaux mots de passe ne correspondent pas."), false;
    if (!formData.ancienMotDePasse.trim())
      return setErreur("Vous devez saisir votre ancien mot de passe pour valider."), false;
    if (!idEncadreur) return setErreur("ID encadreur manquant. Veuillez vous reconnecter."), false;
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreur("");
    setSucces("");
    if (!validerFormulaire()) return;
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:3000/api/encadreurs/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_enc: idEncadreur,
          nomUtilisateur: formData.nomUtilisateur,
          email: formData.email,
          ancienMotDePasse: formData.ancienMotDePasse,
          nouveauMotDePasse: formData.nouveauMotDePasse,
        }),
      });

      const data = await response.json();
      if (!response.ok) setErreur(data.message || "Erreur lors de la modification.");
      else {
        setSucces(data.message || "Informations modifiées avec succès !");
        route.replace("dashboard");
        setFormData((prev) => ({
          ...prev,
          ancienMotDePasse: "",
          nouveauMotDePasse: "",
          confirmerMotDePasse: "",
        }));
      }
    } catch {
      setErreur("Erreur réseau ou serveur.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <NavBarEncadreur />
      <MDBContainer className="mt-4" style={{ maxWidth: "600px", backgroundColor: "white" }}>
        <MDBCard>
          <MDBCardBody>
            <h3 className="mb-4">Modifier mes informations</h3>
            {erreur && <div className="alert alert-danger">{erreur}</div>}
            {succes && <div className="alert alert-success">{succes}</div>}
            <form onSubmit={handleSubmit} noValidate>
              <MDBInput label="Nom utilisateur" name="nomUtilisateur" value={formData.nomUtilisateur} onChange={handleChange} required className="mb-3" />
              <MDBInput type="email" label="Email" name="email" value={formData.email} onChange={handleChange} required className="mb-3" />
              <MDBInput type="password" label="Nouveau mot de passe" name="nouveauMotDePasse" value={formData.nouveauMotDePasse} onChange={handleChange} className="mb-3" />
              <MDBInput type="password" label="Confirmer nouveau mot de passe" name="confirmerMotDePasse" value={formData.confirmerMotDePasse} onChange={handleChange} className="mb-3" />
              <MDBInput type="password" label="Ancien mot de passe *" name="ancienMotDePasse" value={formData.ancienMotDePasse} onChange={handleChange} required className="mb-4" />
              <MDBBtn type="submit" color="primary" disabled={isSubmitting} style={{width:"fit-content"}}>
                {isSubmitting ? "Enregistrement..." : "Valider les modifications"}
              </MDBBtn>
            </form>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    </>
  );
}
