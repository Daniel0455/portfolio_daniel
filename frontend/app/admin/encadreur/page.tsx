"use client";

import NavBarAdmin from "@/components/NavBarAdmin";
import { useEffect, useState } from "react";
import FormEnc from "@/modals/FormEnc";
import { MDBTable, MDBTableHead, MDBTableBody, MDBBtn } from "mdb-react-ui-kit";
import { useRouter } from "next/navigation";
import SpinnerLoad from "@/components/spinner";

export default function Home() {
    const router = useRouter();
    const [encadreurs, setEncadreurs] = useState([]);
    const [formEnc, setFormEnc] = useState(false);

    //Etats
    const [spinner, setSpinner] = useState(false);


    //Fonction de chargment des encadreurs
    const chargerEncadreurs = async () => {
        try {
        const res = await fetch("http://localhost:3000/api/admins/encadreurs", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (res.ok && data.succes) {
            setEncadreurs(data.encadreurs);
        } else {
            alert("Erreur lors du chargement des encadreurs");
        }
        } catch (error) {
        alert("Erreur réseau");
        console.error(error);
        }
    };


    //Fonction de suppression d'un encadreur par son id
    const supprimerEncadreur = async (id: number) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer cet encadreur ?")) {
        return
        }

        try {
        const res = await fetch(`http://localhost:3000/api/admins/encadreurs/${id}`, {
            method: "DELETE",
            headers: {
            "Content-Type": "application/json",
            },
        })

        const data = await res.json()
        if (res.ok && data.succes) {
            // Recharger la liste après suppression
            await chargerEncadreurs()
            alert("Encadreur supprimé avec succès")
        } else {
            alert("Erreur lors de la suppression de l'encadreur")
        }
        } catch (error) {
        console.error("Erreur réseau:", error)
        alert("Erreur de connexion lors de la suppression")
        }
    }

    //Retour
    const retourMaison = () => {
        setSpinner(true);
        router.replace("dashboard")
    }
    //Chargement initial du tableau de liste
    useEffect(() => {
        chargerEncadreurs();
    }, []);

    const affichageFormEnc = () => {
        setFormEnc((prev) => !prev);
    };

    return (
        <>
        <NavBarAdmin />
        <div>
            <MDBBtn className="m-2" onClick={retourMaison} style={{width:"fit-content"}}>
            <i className="fas fa-home"></i>
            </MDBBtn>
            <MDBBtn className="m-2" onClick={affichageFormEnc} style={{width:"fit-content"}}>
                <i className="fas fa-plus"></i>
            </MDBBtn>
        </div>

        <div className="container mt-4" style={{backgroundColor: "white"}}>
            <h3 className="mb-3" style={{color: "black"}}>Liste des encadreurs</h3>
            <div className="table-responsive" style={{ maxHeight: "400px", overflowY: "auto"}}>
            <MDBTable align="middle" className="table-hover shadow-sm rounded">
                <MDBTableHead light>
                <tr>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Action</th>
                </tr>
                </MDBTableHead>
                <MDBTableBody>
                {encadreurs.map((encadreur, index) => (
                    <tr key={index}>
                    <td>{encadreur.id}</td>
                    <td>{encadreur.nom}</td>
                    <td>{encadreur.email}</td>
                    <td>
                        <MDBBtn color="danger" size="sm" onClick={() => supprimerEncadreur(encadreur.id)} style={{width:"fit-content"}}>
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
        {formEnc && (
            <FormEnc
            onClose={affichageFormEnc}
            onSuccess={chargerEncadreurs}
            />
        )}
        {spinner && (
            <SpinnerLoad/>
        )}
        </>
    );
}
