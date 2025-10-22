"use client"
import { useState } from "react"
import { useEffect } from "react"
export default function Theme(){
    const [theme, setTheme] = useState('light');
    useEffect(()=>{
        let themesaved = localStorage.getItem('themeActu')
        if(themesaved){setTheme(themesaved)}
    },[])
    useEffect(() =>{
        document.body.dataset.theme = theme;
        localStorage.setItem('themeActu', theme);
        let switchtheme = document.getElementById('input') as HTMLInputElement | null
        if(switchtheme)
        {
            if(theme == 'dark')
            {
                switchtheme.checked = true;
            }
            else{
                switchtheme.checked = false
            }
        }
    },[theme])
    function changerTheme()
    {
        setTheme(theme === "light" ? "dark" : "light");
    }
    return(
        <div className="containertheme">
            <label className="switch">
            <input id="input" type="checkbox" checked={theme === "dark"} onChange={changerTheme}/>
            <div className="slider round">
                <div className="sun-moon">
                <svg id="moon-dot-1" className="moon-dot" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="50"></circle>
                </svg>
                <svg id="moon-dot-2" className="moon-dot" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="50"></circle>
                </svg>
                <svg id="moon-dot-3" className="moon-dot" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="50"></circle>
                </svg>
                <svg id="light-ray-1" className="light-ray" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="50"></circle>
                </svg>
                <svg id="light-ray-2" className="light-ray" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="50"></circle>
                </svg>
                <svg id="light-ray-3" className="light-ray" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="50"></circle>
                </svg>

                <svg id="cloud-1" className="cloud-dark" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="50"></circle>
                </svg>
                <svg id="cloud-2" className="cloud-dark" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="50"></circle>
                </svg>
                <svg id="cloud-3" className="cloud-dark" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="50"></circle>
                </svg>
                <svg id="cloud-4" className="cloud-light" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="50"></circle>
                </svg>
                <svg id="cloud-5" className="cloud-light" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="50"></circle>
                </svg>
                <svg id="cloud-6" className="cloud-light" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="50"></circle>
                </svg>
                </div>
                <div className="stars">
                <svg id="star-1" className="star" viewBox="0 0 20 20">
                    <path
                    d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"
                    ></path>
                </svg>
                <svg id="star-2" className="star" viewBox="0 0 20 20">
                    <path
                    d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"
                    ></path>
                </svg>
                <svg id="star-3" className="star" viewBox="0 0 20 20">
                    <path
                    d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"
                    ></path>
                </svg>
                <svg id="star-4" className="star" viewBox="0 0 20 20">
                    <path
                    d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"
                    ></path>
                </svg>
                </div>
            </div>
            </label>

        </div>
    )
}