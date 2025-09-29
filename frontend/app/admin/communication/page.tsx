"use client";
import NavBarAdmin from "@/components/NavBarAdmin";
import { useEffect, useState } from "react";
import FormCom from "@/modals/FormCom";
import { MDBTable, MDBTableHead, MDBTableBody, MDBBtn } from "mdb-react-ui-kit";
import { useRouter } from "next/navigation";
import SpinnerLoad from "@/components/spinner";

export default function Home() {
  /*Constantes */
    const router = useRouter();
    const [communications, setCommunication] = useState([]);
    const [spinner, setSpinner] = useState(false);

    /*Constantes des Modal*/
    const [formCom, setFormCom] = useState(false);

    /*Fonctions */
    const affichageFormCom = () => {
        setFormCom((prev) => !prev);
    };
    const retourMaison = () =>{
        setSpinner(true)
        router.replace("dashboard")
    }

    // Fonction de chargement extraite pour pouvoir la réutiliser
    const chargerCommunications = async () => {
        try {
        const res = await fetch("http://localhost:3000/api/admins/communications", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();
        if (res.ok && data.succes) {
            setCommunication(data.communications);
        } else {
            console.error("Erreur lors du chargement des communications");
            alert("Erreur lors du chargement des communications");
        }
        } catch (error) {
        console.error("Erreur réseau:", error);
        alert("Erreur de connexion lors du chargement des communications");
        }
    };


    // Supprimer un compte communication (avec appel API)
    const supprimerCommunication = async (id: number) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer ce compte communication ?")) {
        return
        }

        try {
        const res = await fetch(`http://localhost:3000/api/admins/communications/${id}`, {
            method: "DELETE",
            headers: {
            "Content-Type": "application/json",
            },
        })

        const data = await res.json()
        if (res.ok && data.succes) {
            // Recharger la liste après suppression
            await chargerCommunications()
            alert("Compte communication supprimé avec succès")
        } else {
            alert("Erreur lors de la suppression du compte communication")
        }
        } catch (error) {
        console.error("Erreur réseau:", error)
        alert("Erreur de connexion lors de la suppression")
        }
    }

    // Chargement initial dans useEffect
    useEffect(() => {
        chargerCommunications();
    }, []);

    return (
        <>
        <NavBarAdmin />
        <div>
            <MDBBtn className=" m-2" onClick={retourMaison} style={{width:"fit-content"}}>
                <i className="fas fa-home"></i>
            </MDBBtn>
            <MDBBtn className=" m-2" onClick={affichageFormCom} style={{width:"fit-content"}}>
                <i className="fas fa-plus"></i>
            </MDBBtn>
        </div>

        <div className="container mt-4" style={{backgroundColor: "white"}}>
            <h3 className="mb-3" style={{color: "black"}}>Liste des communications</h3>
            <div className="table-responsive" style={{ maxHeight: "400px", overflowY: "auto"}}>
            <MDBTable align="middle" className="table-hover shadow-sm rounded">
                <MDBTableHead light>
                <tr>
                    <th>id</th>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Action</th>
                </tr>
                </MDBTableHead>
                <MDBTableBody>
                {communications.map((communication, index) => (
                    <tr key={index}>
                    <td>{communication.id}</td>
                    <td>{communication.nom}</td>
                    <td>{communication.email}</td>
                    <td>
                        <MDBBtn color="danger" size="sm" onClick={() =>{supprimerCommunication(communication.id)}} style={{width: "fit-content"}}>
                        <i className="fas fa-trash-alt me-1"></i> Supprimer
                        </MDBBtn>
                    </td>
                    </tr>
                ))}
                </MDBTableBody>
            </MDBTable>
            </div>
        </div>

        {/* Modal avec mise à jour automatique */}
        {formCom && (
            <FormCom
            onClose={affichageFormCom}
            onSuccess={chargerCommunications}  // <-- passer la fonction ici
            />
        )}
        {spinner && (
            <SpinnerLoad/>
        )}
        </>
    );
}
