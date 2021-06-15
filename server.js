const express = require('express')
const upperCase = require('lodash').upperCase;
const next = require('next')
const Cache = require('lru-cache');
const compression = require('compression')

require('dotenv').config()

const sgMail = require('@sendgrid/mail')
const path = require("path");
const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const axios = require('axios')

const handle = app.getRequestHandler()

const ssrCache = new Cache({
    max: 30,
    maxAge: dev ? 1 : 1000 * 60 * 60, // 30 secondi
})

// const ssrCache = new Cache({
//     max: 30,
//     maxAge: 1000, // 1hour
// });

const renderAndCache = (app) => async function (req, res, pagePath, queryParams) {
    const { host } = req.headers;

    // Define the cache key as you wish here:
    const key = host + req.url;

    // if page is in cache, server from cache
    if (ssrCache.has(key)) {
        console.info('SSR Response from cache for ', key);
        res.setHeader('x-cache', 'HIT');
        res.end(ssrCache.get(key));
        return;
    }

    try {
        /**
         * Override res.end method before sending it to app.renderToHTML
         * to be able to get the payload (renderedHTML) and save it to cache.
         */
        const _resEnd = res.end.bind(res);
        res.end = function (payload) {
            // Add here custom logic for when you do not want to cache the page, for example when
            // the status is not 200
            if (res.statusCode !== 200) {
                console.warn('Oops, something is wrong, will skip the cache');
            } else {
                ssrCache.set(key, payload);
            }
            return _resEnd(payload);
        };
        // if not in cache, render the page into HTML
        res.setHeader('x-cache', 'MISS');
        console.info('SSR rendering without cache and try caching for ', key);
        const page = await app.renderToHTML(req, res, pagePath, queryParams);
        res.send(page)
    } catch (err) {
        // console.log('some rror')
        // // res.statusCode = 404
        // // return handle(req,res)
        app.renderError(err, req, res, pagePath, queryParams);
    }
}

app.prepare().then(() => {
    const server = express()
    server.use(compression());

    if (process.env.NODE_ENV === "production") {
        server.use(compression())
    }

    server.get('/', (req, res) => {
        // since we don't use next's requestHandler, we lose compression, so we manually add it
        renderAndCache(app)(req, res, '/');
    });

    server.get('/slot/:slug/:countryCode', (req, res) => {

        const { slug, countryCode } = req.params

        const websiteRoot = 'https://spikeslot.com'

        const oldUrls = [
            'sweet_bonanza/row',
            'cleopatra-vlt/it'
        ]

        const newUrls = [
            '/slot/sweet-bonanza/row',
            '/slot/cleopatra/it'
        ]

        const oldUrlIndex = oldUrls.indexOf(`${slug}/${countryCode}`)
        const newUrl = newUrls[oldUrlIndex]

        if(oldUrlIndex != -1){
            console.log('hello')
            res.set('location', `${websiteRoot}${newUrl}`)
            res.status(301).send()
        } else {
            const pagePath = `/slot/${req.params.slug}/${req.params.countryCode}`
            renderAndCache(app)(req, res, pagePath)
        }
    })

    server.get('/slots/:countryCode', (req, res) => {
        const pagePath = `/slots/${req.params.countryCode}`
        renderAndCache(app)(req, res, pagePath)
    })

    server.get('/videos/:slug/:countryCode', (req, res) => {
        const { slug, countryCode } = req.params

        const oldUrls = [
            'slot_online_carichiamo_il_bonus_alla_holy_diver_dicembre_di_fuoco_2020',
            '-LeQROwGnWc38INPJggI',
            'spike_casino_legend_livello_36_sentiero_degli_antichi_maratona_14',
            'spike_casino_legend_livello_40_il_tempio_del_mostro_finale_maratona_16',
            '-LeM6aH1AWfFYL5SjuMT',
            '-Leav8l8HaJbCBe6kjtu',
            '-LeQPzCtIHtF8R1QTjDo',
            '-Lf-4v9D6YtrVl1-NMrZ',
            '-LgCSZvsxVGfT71o1NzU',
            'slot_online_pazzia_alla_book_of_ra_magic_fino_a_bet_max_schiattati_ma_non_sepolti_28',
            'slot_online_partita_pazza_alla_honey_rush_2',
        ]

        const newUrls = [
            'slot_online_vinti_4_500_euro_durante_il_caricamento_bonus_alla_holy_diver_dicembre_di_fuoco_2020',
            'slot_online_provo_la_sultan_octavian_con_300_euro',
            'casino_legend_livello_36_sentiero_degli_antichi',
            'casino_legend_livello_40_il_tempio_del_mostro_finale',
            'slot_online_proviamo_la_hugo_2_con_500_euro',
            'slot_online_ultima_partita_alla_dead_or_alive_1_pagaaa',
            'slot_online_blood_suckers_2_quando_non_ci_si_accontenta',
            'slot_online_white_rabbit_giocate_pazze_comprando_bonus_con_1000_euro_parte_1',
            'bonus_vlt_book_of_ra_deluxe_libri_dentro_a_libri',
            'slot_online_vinti_13_000_euro_book_of_ra_magic_schiattati_ma_non_sepolti_28',
            'slot_online_vinti_6500_euro_con_giocate_pazze_alla_honey_rush_2',
        ]

        if(countryCode !== 'it'){

            if(oldUrls.includes(slug)) {
                res.set('location', `https://spikeslot.com/videos/${newUrls[oldUrls.indexOf(slug)]}/it`)
                res.status(301).send()
            }

            res.set('location', `https://spikeslot.com/videos/${slug}/it`)
            res.status(301).send()
        } else {

            if(oldUrls.includes(slug)) {
                res.set('location', `https://spikeslot.com/videos/${newUrls[oldUrls.indexOf(slug)]}/it`)
                res.status(301).send()
            }

            const pagePath = `/videos/${req.params.slug}/${req.params.countryCode}`
            renderAndCache(app)(req, res, pagePath)
        }
    })

    server.get('/producer/:slug/:countryCode', (req, res) => {

        const { slug, countryCode } = req.params

        console.log(slug)

        // const websiteRoot = 'https://spikeslot.com/producer'
        const websiteRoot = 'http://localhost:3000/producer'


        const oldUrls = [
            'Playson',
            'Novomatic',
            'Play\'n Go',
            'Push Gaming',
            'Nazionale Elettronica',
            'BTG',
            'Habanero',
            'Yggdrasil',
            'Capecod',
            'TUKO%20Productions',
            'Bakoo',
            'Elsy',
            'Iron Dog Studio'
        ]

        const newUrls = [
            'playson',
            'novomatic',
            'playn-go',
            'push-gaming',
            'nazionale-elettronica',
            'btg',
            'habanero',
            'yggdrasil',
            'capecod',
            'tuko-productions',
            'bakoo',
            'elsy',
            'iron_dog_studio'
        ]

        const oldUrlIndex = oldUrls.indexOf(slug)
        if(oldUrlIndex != -1){
            const newUrl = newUrls[oldUrlIndex]

            res.set('location', `${websiteRoot}/${newUrl}/${countryCode}`)
            res.status(301).send()
        } else {
            const queryParams = { slug: req.params.slug, countryCode: req.params.countryCode }
            const pagePath = `/producer/${req.params.slug}/${req.params.countryCode}`
            renderAndCache(app)(req, res, pagePath, queryParams)
        } 
    })

    server.get('/sendemail', async (req, res) => {
        if (!process.env.SENDGRID_API_KEY) return res.status(400).send('Message not sent.')
        sgMail.setApiKey(process.env.SENDGRID_API_KEY)

        const { email, message } = req.body

        const content = {
            to: 'akainurev@gmail.com',
            from: email,
            subject: `New Message From - ${email}`,
            text: message,
            html: `<p>${message}</p>`
        }

        try {
            await sgMail.send(content)
            res.status(200).send('Message sent successfully.')
        } catch (error) {
            console.log('ERROR', error)
            res.status(400).send('Message not sent.')
        }
    })

    server.get("/robots.txt", (req, res) => {
        res
            .status(200)
            .sendFile(path.join(__dirname, './public/files/robots.txt'));
    });

    server.get("/spike_sitemap.xml", (req, res) => {
        res
            .status(200)
            .sendFile(path.join(__dirname, './public/files/spike_sitemap.xml'));
    });

    // redirects
    server.get('/slot-gratis/it', (req, res) => {
        res.set('location', 'https://spikeslot.com/slots/it');

        res.status(301).send()
    })

    server.get('/bonus-guide/-LNAVWbyTdOQjBLwKLBU/it', (req, res) => {
        res.set('location', 'https://www.spikeslot.com/guida/guida-bonus-benvenuto-eurobet/it');

        res.status(301).send()
    })

    server.get('/slot-gratis/:slotName/:requestedCountry', async (req, res) => {
        const legacySlug = req.params.slotName

        try {
            const findOldSlot = await axios.get(`http://localhost:3000/api/getoldslot?name=${legacySlug}`)

            if (findOldSlot.data && findOldSlot.data.slug) {
                res.set('location', `https://spikeslot.com/slot/${findOldSlot.data.slug}/it`)
                res.status(301).send()
            }
        } catch (error) {
            console.log(error)
        }
        return handle(req, res)
    })

    server.get('/slot-bar/:slotName/:requestedCountry', async (req, res) => {
        const legacySlug = req.params.slotName

        try {
            const findOldSlot = await axios.get(`http://localhost:3000/api/getoldslot?name=${legacySlug}`)

            if (findOldSlot.data && findOldSlot.data.slug) {
                res.set('location', `https://spikeslot.com/slot/${findOldSlot.data.slug}/it`)
                res.status(301).send()
            }
        } catch (error) {
            console.log(error)
        }
        return handle(req, res)
    })

    server.get('/slot-vlt/:slotName/:requestedCountry', async (req, res) => {
        const legacySlug = req.params.slotName

        try {
            const findOldSlot = await axios.get(`http://localhost:3000/api/getoldslot?name=${legacySlug}`)

            if (findOldSlot.data && findOldSlot.data.slug) {
                res.set('location', `https://spikeslot.com/slot/${findOldSlot.data.slug}/it`)
                res.status(301).send()
            }
        } catch (error) {
            console.log(error)
        }
        return handle(req, res)
    })

    server.get('/bonuses/it', async (req, res) => {


        res.set('location', `https://spikeslot.com/migliori-bonus-casino`)
        res.status(301).send()

        return handle(req, res)
    })

    // redirect articoli

    server.get(`/article/:slug/:countryCode`, (req, res) => {
        const { slug } = req.params

        const websiteRoot = 'https://spikeslot.com'

        const oldUrls = [
            'lotteria_classica_oppure_online_come_funziona_il_mondo_del_gratta_e_vinci',
            'la_tabella_del_blackjack_giocare_con_la_strategia_di_base',
            'guida_al_blackjack_strategia_di_conteggio_delle_carte',
            'guida_alla_roulette_strategie_di_puntata_per_esperti',
            'come_iscriversi_ai_casino_online',
            'guida_al_blackjack_i_tipi_di_puntata',
            'guida_alla_roulette_le_puntate_e_le_vincite',
            'guida_alla_roulette_un_pilastro_dei_casino',
            'come_prelevare_il_bonus_benvenuto_di_starcasino_senza_depositare_nulla',
            'guida_al_blackjack_introduzione_al_gioco',
            'casino_online_come_funzionano',
            'comparazione_offerte_di_halloween_quali_sono_le_promozioni_per_giocare',
            'arrivano_le_nuove_slot_online_kingdoms_rise_come_funzionano',
            'nuovo_payout_al_68_per_le_slot_da_bar_il_punto_di_vista_di_spike',
            'book_of_ra_storia_e_guida_di_una_slot_leggendaria',
            'come_difendersi_dalla_ludopatia',
            'depositare_e_prelevare_nei_casino_online_metodi_di_pagamento',
            'comparazione_offerte_di_halloween_quali_sono_le_promozioni_per_giocare',
            'nuova_stangata_per_il_pagamento_delle_slot_machine_da_bar_ora_ridotto_al_65_i_commenti_di_spike',
            'spike_festeggia_i_20000_followers_su_instagram_regalandovi_il_cappello_ufficiale'
        ]

        const newUrls = [
            '/articoli/guida-gratta-e-vinci-lotterie/it',
            '/articoli/guida-blackjack-strategia-base-tabella/it',
            '/articoli/guida-blackjack-contare-carte/it',
            '/articoli/guida-roulette-strategie-avanzate/it',
            '/articoli/guida-iscrizione-casino-online/it',
            '/articoli/guida-blackjack-puntate/it',
            '/articoli/guida-roulette-vincite-base/it',
            '/articoli/guida-roulette-introduzione/it',
            '/articoli/prelevare-bonus-starcasino-senza-depositare/it',
            '/articoli/guida-blackjack-introduzione/it',
            '/articoli/come-funzionano-casino-online/it',
            '/blog/bonus-halloween/it',
            '/blog/arrivano-le-nuove-kingdoms-rise/it',
            '/blog/payout-68-slot-da-bar/it',
            '/articoli/storia-guida-book-of-ra-classic/it',
            '/articoli/ludopatia-come-smettere-di-giocare/it',
            '/articoli/metodi-depositare-prelevare-casino/it',
            '/blog/bonus-halloween/it',
            '/blog/payout-65-slot-da-bar/it',
            '/blog/regalo-cappelli-instagram/it'
        ]

        const oldUrlIndex = oldUrls.indexOf(slug)
        const newUrl = newUrls[oldUrlIndex]

        res.set('location', `${websiteRoot}${newUrl}`)
        res.status(301).send()
    })

    server.get('*', (req, res) => handle(req, res))

    server.post('*', (req, res) => {
        return handle(req, res)
    })

    server.listen(port, err => {
        if (err) throw err
        console.log(`> Ready on http://localhost:${port}`)
    })
})
