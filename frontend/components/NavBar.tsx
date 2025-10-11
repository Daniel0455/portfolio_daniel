export default function NavBar(){
    let buttons = [
        {label: "Accueil"},
        {label: "A propos"},
        {label: "Compétences"},
        {label: "Projets"},
        {label: "Experiences"},
        {label: "Contact"},
    ]
    return(
        <>
        <nav className="navBar">
            <div className="containerLogo"><button>Logo</button></div>
            <div className="containerButtons">
                {buttons.map((btn) =>(
                    <button key={btn.label}>{btn.label}</button>
                ))}
            </div>
            <div className="containerTheme">
                <label className="switch">
                <input type="checkbox" />
                <span className="slider"></span>
                <span className="clouds_stars"></span>
                </label>
            </div>
        </nav>
        </>
    )
}