import { MDBBtn, MDBInput } from "mdb-react-ui-kit";
import { useState } from "react";
import { useRouter} from "next/navigation";
import { useEffect } from "react";
import SpinnerLoad from "./spinner";

export default function NavBarAdmin() {
    /*Variables */
    const router = useRouter();
    const [id_admin, setIdAdmin] = useState("");
    const [spinner, setSpinner] = useState(false);
    const [modalmodificationinfo, setModalModificationInfo] = useState(false);
    const [messageinfo, setMessageInfo] = useState(false);
    const [mdpincorrect, setMdpIncorrect] = useState(false);

    const [ancienmdp, setAncenMdp] = useState("");
    const [nouveaumdp, setNouveauMdp] = useState("");
    const [confnouveaumdp, setConfNouveauMdp] = useState("");

    const [nouveaunom, setNouveauNom] = useState("")
    const [nouveauemail, setNouveauEmail] = useState("")
    const [mdpconfirmation, setMdpConfirmation] = useState("");

    const [controlchamps, setControlChamps] = useState(false);


    useEffect(() => {
        const id = localStorage.getItem("id_admin");
        setIdAdmin(id);
        }, []);

  /* Modal */
    const [paramCompte, setParamCompte] = useState(false);
    const [paramTheme, setParamTheme] = useState(false);
    const [paramNotif, setParamNotif] = useState(false);
    const [showChangePwdModal, setShowChangePwdModal] = useState(false)
    /* Fonction*/
    const affichageParamCompte = () => {
        setParamCompte((prev) => !prev);
        setParamTheme(false);
        setParamNotif(false);
        setShowChangePwdModal(false);
        setControlChamps(false);
        setModalModificationInfo(false);
        setMessageInfo(false);
        setMdpIncorrect(false);
        setNouveauNom(nomAdmin);
        setNouveauEmail(emailAdmin);
    };
    const affichageParamTheme = () => {
        setParamCompte(false);
        setParamTheme((prev) => !prev);
        setParamNotif(false);
        setShowChangePwdModal(false);
        setControlChamps(false);
        setModalModificationInfo(false);
        setMessageInfo(false);
        setMdpIncorrect(false);
        setNouveauNom(nomAdmin);
        setNouveauEmail(emailAdmin);
    };
    const affichageNotif = () => {
        setParamCompte(false);
        setParamTheme(false);
        setParamNotif((prev) => !prev);
        setShowChangePwdModal(false);
        setControlChamps(false);
        setModalModificationInfo(false);
        setMessageInfo(false);
        setMdpIncorrect(false);
        setNouveauNom(nomAdmin);
        setNouveauEmail(emailAdmin);
    };
    const affichageParamMdp = () =>{
        setParamCompte(false);
        setParamTheme(false);
        setParamNotif(false);
        setShowChangePwdModal(true);
        setControlChamps(false);
        setModalModificationInfo(false);
        setMessageInfo(false);
        setMdpIncorrect(false);
        setNouveauNom(nomAdmin);
        setNouveauEmail(emailAdmin);
    }
    const affichageParamInfo = () =>{
        setParamCompte(false);
        setParamTheme(false);
        setParamNotif(false);
        setShowChangePwdModal(false);
        setControlChamps(false);
        setModalModificationInfo((prev) =>!prev);
        setMessageInfo(false);
        setMdpIncorrect(false);
        setNouveauNom(nomAdmin);
        setNouveauEmail(emailAdmin);
    }
    const deconnexion = () =>{
        setSpinner(true);
        setControlChamps(false);
        router.replace('/')
    }

    const changerInfo = async () =>
    {
        if(nouveaunom == "" || nouveauemail == "" || mdpconfirmation == "")
        {
            setMessageInfo(true)
        }
        else{
            setMessageInfo(false);
            const mdp = await getAdminMdp(id_admin);
            if(mdpconfirmation != mdp)
            {
                setMdpIncorrect(true);
            }
            else{
                setMdpIncorrect(false);
                updateAdmin(id_admin, nouveauemail, nouveaunom);
                alert('modification avec succès');
                setModalModificationInfo(false);
                chargerInfosAdmin();
            }
        }
    }


    //Fonction de modification des infos d'un admin de tel id
    const updateAdmin = async (id_admin: string, email: string, nom_utilisateur: string) => {
        try {
            const response = await fetch(`http://localhost:3000/api/admins/${id_admin}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, nom_utilisateur }),
            });

            // Vérifie si la réponse est en JSON avant de la parser
            const contentType = response.headers.get("content-type");
            const data = contentType?.includes("application/json") ? await response.json() : null;

            if (!response.ok) {
                throw new Error(data?.message || "Erreur lors de la mise à jour");
            }

            return data;
        } catch (error: any) {
            console.error("Erreur updateAdmin:", error.message);
            throw error;
        }
    };





    // Fonction pour charger les informations actuelles de l'admin
    const [nomAdmin, setNomAdmin] = useState("");
    const [emailAdmin, setEmailAdmin] = useState("");

    let remonte = true;
    const chargerInfosAdmin = async () => {
        try {
            const res = await fetch(`http://localhost:3000/api/admins/selection?id_admin=${id_admin}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await res.json();
            if (res.ok && data.admin && remonte) {
                setNomAdmin(data.admin.nom_utilisateur);
                setEmailAdmin(data.admin.email);
                setNouveauNom(data.admin.nom_utilisateur);
                setNouveauEmail(data.admin.email);
            }
        } catch (error) {
            console.error("Erreur lors du chargement des infos admin :", error);
        }
    };
    useEffect(() => {

    chargerInfosAdmin();

    return () => {
        remonte = false;
    };
    }, [id_admin]);

    //Fonction de selection de mot de passe admin de tel id

    const getAdminMdp = async (id_admin: string) => {
    try {
        const res = await fetch(`http://localhost:3000/api/admins/mdp/${id_admin}`);

        if (!res.ok) {
        throw new Error(`Erreur serveur: ${res.status}`);
        }

        const data = await res.json(); // { mdp: '...' }
        return data.mdp;
    } catch (error) {
        console.error("Erreur lors de la récupération du mot de passe :", error);
        return null;
    }
    }

    //API de changement de mot de passe
    const updateAdminPassword = async (id_admin_selectionne: string, newMdp: string) => {
        try {
            const response = await fetch(`http://localhost:3000/api/admins/mdp/${id_admin_selectionne}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ newMdp }),
            });

            const text = await response.text();
            let data;

            try {
            data = JSON.parse(text);
            } catch (e) {
            console.error("La réponse n’est pas en JSON :", text);
            throw new Error("Réponse serveur invalide.");
            }

            if (!response.ok) {
            throw new Error(data.message || "Erreur lors de la mise à jour du mot de passe");
            }

            return data;
        } catch (error: any) {
            console.error("Erreur updateAdminPassword :", error.message);
            alert("Erreur de l'API Next : " + error.message);
            throw error;
        }
    };




    //Fonction pour le modificaton de mot de passe admin
    const modifierMdp = async (id_admin_selectionne: string,newmpd: string) => {
        if (!id_admin) {
            return;
        } else if (ancienmdp === "" || nouveaumdp === "" || confnouveaumdp === "") {
            setControlChamps(true);
        } else if (nouveaumdp !== confnouveaumdp) {
            alert("Le mot de passe de confirmation est différent !");
        } else {
            setControlChamps(false);
            const mdpselectionne = await getAdminMdp(id_admin_selectionne);

            if (mdpselectionne === ancienmdp) {
            try {
                await updateAdminPassword(id_admin_selectionne, newmpd);
                alert("Mot de passe mis à jour avec succès !");
                annuler(); // Réinitialise les champs
            } catch (err) {
                alert("Erreur lors de la mise à jour : " + err.message);
            }
            } else {
            alert("Ancien mot de passe incorrect !");
            }
        }
    };

    const annuler = () =>{
        setAncenMdp("");
        setNouveauMdp("");
        setConfNouveauMdp("");
        setShowChangePwdModal(false)
    }


    return (
        <>
        <nav className="navbar d-flex justify-content-between align-items-center px-3 py-4 bg-light border-bottom"
        style={{ position: "sticky", top: "0", zIndex: "100", width: "100%" }}>
            {/* Partie gauche : burger + search */}
            <div className="d-flex" style={{color: "black"}}>
                <svg className="img-fluid mx-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "32px", height: "32px" }}>
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                </svg>
                <span className="logo-text">StageTracker Pro</span>
            </div>

            {/* Partie droite : notification + paramètres + profil */}
            <div className="d-flex align-items-center gap-2 position-relative">
            

            <div
            style={{
                width: "35px",
                height: "35px",
                backgroundColor: "rgba(0, 0, 0, 0.15)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "50%",
                cursor: "pointer",
            }}
                onClick={affichageParamCompte}
                >
                <i className="fas fa-user text-gray-dark" style={{ fontSize: "1.1rem" }}></i>
            </div>

            {/* Modal Parametre compte*/}
            {paramCompte && (
                <div
                className="bg-light border rounded shadow position-absolute"
                style={{
                    top: "50px",
                    right: "0",
                    zIndex: 1050,
                    width: "250px",
                    padding: "1rem",
                }}
                >
                <div className="mx-0" style={{backgroundColor: ""}}>
                    <h4 className="info" style={{color: "grey", fontSize: "25px"}}><b>{nomAdmin}</b></h4>
                    <p style={{color: "grey"}}>{emailAdmin}</p>
                </div>
                <hr />
                <MDBBtn color="link" className="w-100" style={{color: "grey", textAlign: "left"}} onClick={affichageParamInfo}>
                    <i className="fas fa-gear"></i> Paramètres
                </MDBBtn>
                <MDBBtn color="link" className="w-100" style={{color: "grey", textAlign: "left"}} onClick={affichageParamMdp}>
                    <i className="fas fa-key"></i> Changer mot de passe
                </MDBBtn>
                <MDBBtn color="link" className="w-100" style={{color: "grey", textAlign: "left"}} onClick={deconnexion}>
                    <i className="fas fa-sign-out-alt"></i> Se déconnecter
                </MDBBtn>
                </div>
            )}
            </div>
            {/*Modal thème */}
            {paramTheme && (
                <div className="card border position-absolute"
                    style={{
                        top: "63px",
                        right: "80px",
                        zIndex: 1050
                    }}
                >
                    <MDBBtn color="link" className="w-100" style={{color: "grey", textAlign: "left"}}>
                        <i className="fas fa-moon"></i> Sombre
                    </MDBBtn>
                    <MDBBtn color="link" className="w-100" style={{color: "grey", textAlign: "left"}}>
                        <i className="fa-solid fa-sun"></i> Clair
                    </MDBBtn>
                </div>
            )}
            {/*Modal Notification */}
            {paramNotif && (
                <div className="border rounder shadow p-2" style={{position: "absolute", top: "63px", right: "150px", animationDuration: "0.4s", zIndex: 1050, backgroundColor: "white"}}>
                    <h4 className="info">Notifications</h4>
                    <hr />
                    <MDBBtn color="link" className="w-100" style={{color: "black", textAlign: "left", textTransform: "none"}}>
                        <i className="fas fa-circle" style={{color: "red", fontSize: "10px"}}></i> <b>Un stagiaire supprimé</b>
                        <p>Elodie a été supprimé</p>
                    </MDBBtn>
                    <MDBBtn color="link" className="w-100" style={{color: "black", textAlign: "left", textTransform: "none"}}>
                        <i className="fas fa-circle" style={{color: "red", fontSize: "10px"}}></i> <b>Un stagiaire supprimé</b>
                        <p>Elodie a été supprimé</p>
                    </MDBBtn>
                </div>
            )}
            {/*Modal changement de mot de passe */}
            {showChangePwdModal && (
                <div className="bg-white shadow rounded p-3" style={{ position: "fixed", top: '63px', right: '10px', zIndex: 1050, width: '300px'}}>
                    <h5>Changer le mot de passe</h5>
                    <MDBInput label="Ancien mot de passe" type="password" className="mb-2" onChange={(e) =>{setAncenMdp(e.target.value)}} />
                    <MDBInput label="Nouveau mot de passe" type="password" className="mb-2" onChange={(e) =>{setNouveauMdp(e.target.value)}}/>
                    <MDBInput label="Confirmer le mot de passe" type="password" className="mb-3"onChange={(e) =>{setConfNouveauMdp(e.target.value)}} />
                    <div className="d-flex justify-content-end">
                    <div>
                        {controlchamps && (
                        <div><p style={{color: "red"}}>Tous les champs sont obligatoires</p></div>
                    )}
                    <MDBBtn color="secondary" size="sm" className="me-2" onClick={annuler}>Annuler</MDBBtn>
                    <MDBBtn color="success" size="sm" onClick={() => modifierMdp(id_admin, nouveaumdp)}>Confirmer</MDBBtn>
                    </div>
                    </div>
                </div>
            )}
        </nav>
        {spinner && (
            <SpinnerLoad/>
        )}
        {modalmodificationinfo && (
            <>
                <div className="border shadow" style={{width: "300px", padding:"10px", textAlign: "center", position:"fixed", zIndex:"2000", right: "10px", backgroundColor:"white"}}>
                    <h4>Nouvelles informations</h4>
                    <hr />
                <MDBInput
                onChange={(e) =>setNouveauNom(e.target.value)}
                    type="text"
                    label="Nouveau nom utilisateur"
                    style={{margin:"10px"}}
                    value={nouveaunom}
                />
                <MDBInput
                onChange={(e)=>setNouveauEmail(e.target.value)}
                    type="text"
                    label="Nouvel Email"
                    style={{margin:"10px"}}
                    value={nouveauemail}
                />
                <MDBInput
                onChange={(e) => setMdpConfirmation(e.target.value)}
                    label="Mot de passe"
                    type="password"
                    style={{margin:"10px"}}
                />
                {messageinfo && (
                    <p style={{color: "red"}}>Tous les champs sont obligatoires</p>
                )}
                {mdpincorrect && (
                    <p style={{color: "red"}}>Mot de passe incorrect</p>
                )}
                <MDBBtn color="secondary"
                    style={{margin:"5px"}}
                    onClick={affichageParamInfo}
                >Annuler</MDBBtn>
                <MDBBtn
                    style={{margin:"5px"}}
                    onClick={changerInfo}
                >Valider</MDBBtn>
                
                </div>
            </>
        )}
        </>
    );
}
