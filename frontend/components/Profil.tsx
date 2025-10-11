export default function Profil(){
    let buttons = [
        {label: "Me contacter", icon: "fas fa-envelope"},
        {label: "Télécharger CV", icon: "fas fa-download"},
    ]
    return(
        <>
        <div className="containerProfil">
            <div className="containerDescProfil">
                <p>Je suis Daniel</p>
                <p className="profetionProfil">Développeur Web | Desktop</p>
                <p className="descProfil">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam unde temporibus itaque, nobis voluptas vel officiis corporis harum, dicta reprehenderit ipsum explicabo obcaecati, quasi dolor esse earum eaque ipsa maxime?</p>
                <div className="containerButtonsProfil">
                    {buttons.map((btn) =>(
                        <div key={btn.label} className="btnRadius"><button> <i className={btn.icon}></i>{btn.label}</button></div>
                    ))}
                </div>
            </div>
            <div className="containerPdpProfil">

            </div>
        </div>
        </>
    )
}