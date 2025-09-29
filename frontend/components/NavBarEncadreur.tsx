"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import SpinnerLoad from "./spinner";

export default function NavBarEncadreur() {
  const [menuContainer, setMenuContainer] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname(); // chemin actuel

  const [spinner, setSpinner] = useState(false);
  const [idEncadreur, setIdEncadreur] = useState<string | null>(null);
  const [nomEncadreur, setNomEncadreur] = useState<string | null>(null);


  const [pageActu, setPageActu] = useState('');

  useEffect(()=>{
    const pageActuelle = localStorage.getItem('pageActu');
    if(pageActuelle)
    {
      setPageActu(pageActuelle);
    }
  })

  const parametre = () => {
    if (pathname !== "/parametre") { // spinner seulement si on n'est pas déjà sur /parametre
      setSpinner(true);
      router.replace("/parametre");
    }
    setMenuContainer(false);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedId = localStorage.getItem("id_encadreur");
      if (storedId) {
        setIdEncadreur(storedId);
        fetch(`http://localhost:3000/api/encadreurs/${storedId}`)
          .then((res) => {
            if (!res.ok) throw new Error("Erreur API");
            return res.json();
          })
          .then((data) => {
            setNomEncadreur(data.nom);
          })
          .catch((err) => {
            console.error("Erreur récupération nom encadreur :", err);
            setNomEncadreur(null);
          });
      }
    }
  }, []);

  const menuItems = [
    { label: "Accueil", icon: "fas fa-home", path: "dashboard" },
    { label: "Stagiaire", icon: "fas fa-user-graduate", path: "stagiaire" },
    { label: "Thème", icon: "fas fa-lightbulb", path: "theme" },
    { divider: true },
    { label: "Suivi et évaluation", icon: "fas fa-chart-line", path: "suivi" },
    { label: "Message", icon: "fas fa-envelope", path: "message" },
    { divider: true },
    { label: "Paramètres", icon: "fas fa-cog", path: "parametre" },
    { label: "Déconnexion", icon: "fas fa-sign-out-alt", path: "/" },
  ];

  function handleClickOutside(event: MouseEvent) {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setMenuContainer(false);
    }
  }

  useEffect(() => {
    if (menuContainer) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuContainer]);

  const navigateTo = (path: string) => {
    if (pageActu != `${path}`) { // spinner seulement si on n'est pas déjà sur la page cible
      setSpinner(true);
      router.replace(`${path}`);
      localStorage.setItem('pageActu', `${path}`)
    }
  };

  return (
    <>
      <nav
        className="navbar d-flex justify-content-between align-items-center px-3 py-4 bg-light border-bottom"
        style={{ position: "sticky", top: 0, zIndex: 100, width: "100%" }}
      >
        <div className="d-flex align-items-center text-gray-dark">
          <i
            className="fas fa-bars text-gray-dark"
            style={{ cursor: "pointer", fontSize: "1.2rem" }}
            onClick={() => setMenuContainer(true)}
          ></i>
        </div>

        <div className="d-flex align-items-center gap-3 text-gray-dark">
          {nomEncadreur ? (
            <span className="me-2 fw-bold">{nomEncadreur}(Encadreur)</span>
          ) : idEncadreur ? (
            <span className="me-2 text-muted">Chargement...</span>
          ) : (
            <span className="me-2 text-muted">Utilisateur non connecté</span>
          )}

          <div
            style={{
              width: 35,
              height: 35,
              backgroundColor: "rgba(0, 0, 0, 0.15)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "50%",
              cursor: "pointer",
            }}
          >
            <i className="fas fa-user text-gray-dark" style={{ fontSize: "1.1rem" }}></i>
          </div>
        </div>
      </nav>

      {/* Overlay de fond */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: "100vw",
          background: menuContainer ? "rgba(0, 0, 0, 0.2)" : "transparent",
          zIndex: 101,
          transition: "background 0.3s ease",
          pointerEvents: menuContainer ? "auto" : "none",
        }}
      >
        {/* Slide navigation */}
        <nav
          ref={menuRef}
          className="bg-white"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 102,
            backgroundColor: "white",
            maxWidth: 400,
            width: "80%",
            height: "100vh",
            overflowY: "auto",
            boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
            transform: menuContainer ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 0.4s ease",
          }}
        >
          <ul style={{ width: "100%", padding: 0 }}>
            <div className="d-flex" style={{ marginTop: 50, marginBottom: 20 }}>
              <svg
                className="img-fluid mx-2 text-gray-dark"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: 32, height: 32 }}
              >
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              </svg>
              <span className="logo-text fw-bold fs-5 mt-1 text-gray-dark">StageTracker Pro</span>
            </div>
            <hr />

            {menuItems.map((item, index) =>
              item.divider ? (
                <hr key={`divider-${index}`} />
              ) : (
                <li
                  key={index}
                  className="menu-item text-gray-dark"
                  onClick={() => navigateTo(item.path)}
                >
                  <i className={`${item.icon} m-2 text-gray-dark`}></i>
                  {item.label}
                </li>
              )
            )}
          </ul>
        </nav>
      </div>

      <style jsx>{`
        .text-gray-dark {
          color: #333;
        }
        .menu-item {
          margin: 10px 20px;
          cursor: pointer;
          border-radius: 6px;
          padding: 8px 12px;
          transition: background-color 0.3s ease;
          list-style-type: none;
          font-weight: 500;
        }
        .menu-item:hover {
          background-color: #f0f0f0;
        }
        hr {
          border: none;
          border-top: 1px solid #ccc;
          margin: 0.5rem 1rem;
        }
      `}</style>

      {spinner && <SpinnerLoad />}
    </>
  );
}
