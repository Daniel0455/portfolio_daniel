"use client"
import { useState } from "react";
import { useEffect } from "react";
export default function Nav(){
    const [actu, setActu] = useState("");
    const [visible, setVisible] = useState(false);
    const [listenavigation, setlistenavigation] = useState(false)
    useEffect(() =>{
        let actusaved = localStorage.getItem('actu');
        if(actusaved)
        {
            setActu(actusaved);
        }
        else
        {
            setActu('accueil')
            localStorage.setItem('actu', 'accueil')
        }
    },[]);
    useEffect(() =>{
        let ciblereel = document.getElementById(actu);
        if(ciblereel)
        {
            ciblereel.scrollIntoView({behavior: "smooth"})
        }
    }, [actu])
    let boutons = [
        {
            label: "Accueil",
            cible: "accueil"
        },
        {
            label: "A propos",
            cible: 'propos'
        },
        {
            label: "Projets",
            cible: "projet"
        },
        {
            label: "Outils",
            cible: "outil"
        },
        {
            label: "Langages",
            cible: "langage"
        },
        {
            label: "Contact",
            cible: "contact"
        }
    ]
    return(
        <div>
            <div className="gardemarge"></div>
            <nav className="nav">
                <nav className="navbody">
                    {boutons.map((bouton)=>(
                        <button
                            key={bouton.label}
                            className={`btnnav ${bouton.cible === actu ? "active" : ""}`}
                            onClick={() =>
                            {
                                setActu(bouton.cible);
                                localStorage.setItem('actu', bouton.cible)
                            }
                            }
                        >
                            {bouton.label}
                        </button>
                    ))}
                </nav>
            </nav>
            {/*Burgger */}
            <div className="containerburgger">
                <label className="burger">
                <input type="checkbox" id="burger" onChange={(e)=>{setlistenavigation(e.target.checked)}}/>
                <span></span>
                <span></span>
                <span></span>
                </label>
            </div>
            {/*liste */}
            {listenavigation && (
                <nav className="toggleburgger">
                    {boutons.map((bouton)=>(
                        <button
                            key={bouton.label}
                            className={`btnnav ${bouton.cible === actu ? "active" : ""}`}
                            onClick={() =>
                            {
                                setActu(bouton.cible);
                                localStorage.setItem('actu', bouton.cible);
                                setlistenavigation(false);
                                let toggle = document.getElementById('burger') as HTMLInputElement | null;
                                if(toggle)
                                {
                                    toggle.checked = false;
                                }
                            }
                            }
                        >
                            {bouton.label}
                        </button>
                    ))}
                </nav>
            )}
        </div>
    )
}