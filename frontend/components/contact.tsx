"use client"
export default function Contact() {
    let contacts = [
        {
            icon: "fab fa-facebook",
            couleur: "rgb(24, 119, 242)",
            valeur: "Razafindranaivo Aimé Daniel Johnston"
        },
        {
            icon: "fab fa-whatsapp",
            couleur: "rgb(37, 211, 102)",
            valeur: "+261 34 28 195 83"
        },
        {
            icon: "fas fa-envelope",
            couleur: "rgb(227, 79, 38)",
            valeur: "nielj455@gmail.com"
        },
        {
            icon: "fab fa-linkedin-in",
            couleur: "rgb(0, 119, 181)",
            valeur: "Aimé Daniel Johnston RAZAFINDRANAIVO"
        },
    ]
    return(
        <div className="containercontact" id="contacts">
            <p className="soustitre">Restons en <label className="daniel">Contact</label></p>
            <p className="intropro">N'hésitez pas à me contacter pour discuter de vos projets ou simplement échanger.</p>
            <div className="ligne"></div>
            <div className="containerprojet">
                {contacts.map((contact) =>(
                    <div key={contact.icon} className="cardcontact">
                        <i className={contact.icon} style={{color: contact.couleur, fontSize:'40px'}}></i>
                        <p className='pgris'>{contact.valeur}</p>
                    </div>
                ))}
            </div>
            <div className="cdroit">
                <p>2025 Daniel. Tous droits réservés. Créé avec ❤ et Next.js.</p>
            </div>
        </div>
    )
}