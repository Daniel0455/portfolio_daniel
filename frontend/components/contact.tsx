"use client"
export default function Contact(){
    let contacts = [
        {
            icon: "facebook",
            coo: "Razafindranaivo Aimé Daniel Johnston"
        },
        {
            icon: "WhatsApp",
            coo: "+261342819583"
        },
        {
            icon: "Email",
            coo: "nielj455@gmail.com"
        }
    ]
    return(
        <>
            <div className="containerContact">
                <p className="titre">Contact</p>
                <div className="containerContactMain">
                    {contacts.map((contact) => (
                        <div key={contact.icon}>
                            <p>{contact.icon}</p>
                            <p>{contact.coo}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}