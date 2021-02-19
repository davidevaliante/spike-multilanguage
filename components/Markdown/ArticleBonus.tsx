import React, { useEffect, useState } from 'react'
import { FunctionComponent } from 'react'
import AquaClient from './../../graphql/aquaClient'
import { GET_BONUS_BY_NAME_AND_COUNTRY } from '../../graphql/queries/bonus'
import { Bonus } from '../../graphql/schema'
import ArticleBonusCard from './../Cards/ArticleBonusCard'
import { CSSProperties } from '@material-ui/core/styles/withStyles'

interface Props {
    bonusName: string
    countryCode: string
    style?: CSSProperties
}

const ArticleBonus: FunctionComponent<Props> = ({ bonusName, countryCode, style }) => {

    const [bonus, setBonus] = useState<Bonus | undefined>(undefined)

    useEffect(() => {
    }, [bonus])

    const aquaClient = new AquaClient()

    useEffect(() => {
        getBonusData()
    }, [])

    const getBonusData = async () => {
        const bonusResponse = await aquaClient.query({
            query: GET_BONUS_BY_NAME_AND_COUNTRY,
            variables: {
                name: bonusName,
                countryCode: countryCode
            }
        })

        setBonus(bonusResponse.data.data.bonuses[0])
    }

    return (
        <div>
            {bonus && <ArticleBonusCard style={style} bonus={bonus} />}
        </div>
    )
}

export default ArticleBonus

// SLOT ONLINE - Continuiamo la MISSIONE WILDLINE alla DEAD OR ALIVE 2(Partita di MAGGIO)


// Gioco alla "Dead or Alive 2" della NetEnt

// PIU INFO: https://www.spikeslot.com/compare?options=StarCasino,888,LeoVegas&vid=144

// Bentornati a tutti a questo nuovo video! Ancora una volta ci troviamo di fronte alla DEAD OR ALIVE 2 della NetEnt con la quinta puntata dedicata alla MISSIONE WILDLINE! Quando abbiamo iniziato con la prima missione di Gennaio speravamo di portarla a termine in tempi ridotti, ma non getteremo facilmente la spunga!  Sarà questa la sessione giusta che stavamo aspettando ?

//     Seguimi anche su
// 📸 Instagram: https://www.instagram.com/spikeslot/
// 📰 Telegram: https://t.me/spikeslot
// 🎓 Facebook: https://www.facebook.com/spikeslot

// ✔✔✔ SUPPORTA I VIDEO CON UN GADGET:
// 🔥🔥🔥 https://shop.spreadshirt.it/spike4 💣💣💣
// (Official Merchandise) ©
// SPIKE ti ringrazia!

// ⚠⚠⚠
// IL GIOCO E VIETATO AI MINORI DI ANNI 18 E PUO CAUSARE DIPENDENZA PATOLOGICA.
// INFORMATI SULLA PROBABILITA DI VINCITA SUL SITO UFFICIALE DELL'AGENZIA DOGANE E MONOPOLI. 
// Gioca con moderazione! Il gioco deve essere divertimento e intrattenimento, gioca solo somme che puoi permetterti di perdere.Ricorda che i giochi sono concepiti per far perdere soldi!
// Non giocare per vincere e non rincorrere le perdite!




// ONLINE SLOTS - Continuing our WILDLINE MISSION at DEAD OR ALIVE 2 (May's Game)



// Playing "Dead or Alive 2" by NetEnt

// Welcome back everyone to this new video ! We are once again facing DEAD OR ALIVE 2 by NetEnt with the fifth episode of our WILDLINE MISSION ! When we started back in January we really hoped to end this as soon as possible, but we'll not throw in the towel that easily ! Maybe this is the gaming session we were waiting for ?

//  ✔✔✔ SUPPORT OUR VIDEOS BY CHECKING OUR STORE:
// 🔥🔥🔥 https://shop.spreadshirt.it/spike4 💣💣💣
// (Official Merchandise) ©
// SPIKE thanks you all!

//  ⚠⚠⚠ This video intend solely to entertain and provide information for whoever is passionate about gambling. The service is carried out by respecting continence, non-deceitfulness and transparency principles, any logo or reference on the website we are playing on has been carefully hidden for this specific purpose and therefore does not constitute an advertising form ⚠⚠⚠

// THE GAME IS FORBIDDEN TO MINORS NOT BEING 18 YEARS OLD AND CAN CAUSE PATHOLOGICAL DEPENDENCE.
// BE INFORMED ABOUT WINNING CHANCES ON THE OFFICIAL SITE OF YOUR GAMBLING NATIONAL AUTHORITY.
// Play with moderation! The game must be fun and entertaining, play only sums that you can afford to lose.
// Don't play to win and do not chase after your losses!

// 👉 Follow me on my offical website and on INSTAGRAM @spikeslot
// 📸 https://www.instagram.com/spikeslot/
// 🌐 https://www.spikeslot.com/
