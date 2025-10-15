export default function Profil(){
    let buttons = [
        {label: "Me contacter", icon: "fas fa-envelope"},
        {label: "Télécharger CV", icon: "fas fa-download"},
    ]
    return(
        <>
        <div className="containerProfil">
            <div className="containerDescProfil">
                <p>Bonjour, je m'appelle Daniel</p>
                <p className="profetionProfil">Développeur Web</p>
                <p className="descProfil">Mon nom c'est Razafindranaivo Aimé Daniel Johnston. Développeur web full-stack passionné, je conçois des applications modernes et performantes en alliant front-end et back-end. J’utilise des technologies comme Next.js, Node.js et PostgreSQL pour créer des solutions efficaces, sécurisées et centrées sur l’expérience utilisateur.</p>
                <div className="containerButtonsProfil">
                    {buttons.map((btn) =>(
                        <div key={btn.label} className="btnRadius"><button className="buttonProfile"> <i className={btn.icon}></i>{btn.label}</button></div>
                    ))}
                </div>
            </div>
            <div className="containerPdpProfil">

            </div>
        </div>
        </>
    )
}