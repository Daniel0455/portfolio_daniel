export default function NavBar(){
    let buttons = [
        {label: "Accueil"},
        {label: "A propos"},
        { label: "Projets"}
    ]
    return(
        <>
        <nav className="navBar">
            <div></div>
            <div>
                {buttons.map((btn) =>(
                    <button key={btn.label}>{btn.label}</button>
                ))}
            </div>
            <div></div>
        </nav>
        </>
    )
}