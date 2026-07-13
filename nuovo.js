/**
 * Progetto JS - Blog Dashboard (Pagina Nuovo Post)
 * 
 * API Base URL: http://localhost:5000/api
 * Risorse usate: /posts, /users
 * 
 * In questa pagina si usa:
 * - GET  → Caricare la lista utenti per il dropdown autore
 * - POST → Creare un nuovo post
 * 
 * =============================================
 * FASE 3 — CREARE UN POST
 * =============================================
 * 
 * 1. Al caricamento della pagina, recupera gli utenti dall'API e popola il dropdown autore (#postAutore)
 *    con un <option> per ogni utente (value = id, testo = nome + cognome)
 * 2. Quando l'utente invia il form (#postForm), valida i campi:
 *    - Il titolo deve avere almeno 3 caratteri
 *    - Il contenuto non deve essere vuoto
 *    - Deve essere selezionato un autore
 *    Se un campo non è valido, mostra un messaggio di errore nello <span> corrispondente
 * 3. Se il form è valido, crea un nuovo post con una fetch POST a /api/posts
 *    Il body della richiesta deve contenere: userId, titolo, contenuto, likes (0) e data (oggi)
 * 4. Se la creazione va a buon fine, resetta il form e mostra un messaggio di successo
 * 
 * Suggerimenti per l'implementazione:
 * - Ricordati di usare e.preventDefault() nel submit del form per evitare il ricaricamento della pagina
 * - Per la fetch POST servono: method "POST", header "Content-Type: application/json", e body con JSON.stringify()
 * - Per la data di oggi: new Date().toISOString().split("T")[0]
 * - Il value del dropdown autore è una stringa, ma userId deve essere un numero → usa Number() o parseInt()
 * - Usa try/catch per gestire eventuali errori di rete
 */
// Configurazione dell'URL di base dell'API
// Configurazione dell'URL di base dell'API
const BASE_URL = 'http://localhost:5000/api';

// SELEZIONE ELEMENTI CON querySelector (Notare il '#' per gli ID)
const postForm = document.querySelector('#postForm');
const postTitolo = document.querySelector('#postTitolo');
const postContenuto = document.querySelector('#postContenuto');
const postAutore = document.querySelector('#postAutore');
const messageDiv = document.querySelector('#message');

// Elementi per i messaggi di errore (Selezionati sempre tramite ID con '#')
const titoloError = document.querySelector('#titoloError');
const contenutoError = document.querySelector('#contenutoError');
const autoreError = document.querySelector('#autoreError');

// ==========================================
// DA QUI IN POI IL CODICE RIMANE IDENTICO
// ==========================================

// 1. Al caricamento della pagina, recupera gli utenti
document.addEventListener('DOMContentLoaded', caricaAutori);

// Funzione per caricare la lista degli autori nel dropdown
async function caricaAutori() {
    try {
        const response = await fetch(`${BASE_URL}/users`);
        if (!response.ok) throw new Error('Impossibile recuperare la lista degli autori');

        const utenti = await response.json();
        
        utenti.forEach(utente => {
            const option = document.createElement('option');
            option.value = utente.id;
            option.textContent = `${utente.nome} ${utente.cognome}`;
            postAutore.appendChild(option);
        });
    } catch (error) {
        mostraMessaggio("Errore nel caricamento degli autori: " + error.message, "errore");
    }
}


postForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    resetErrori();

    const titolo = postTitolo.value.trim();
    const contenuto = postContenuto.value.trim();
    const autoreId = postAutore.value;
    console.log(Number(autoreId))

    let formValido = true;

    if (titolo.length < 3) {
        titoloError.textContent = "Il titolo deve avere almeno 3 caratteri.";
        formValido = false;
    }
    if (contenuto === "") {
        contenutoError.textContent = "Il contenuto non può essere vuoto.";
        formValido = false;
    }
    if (autoreId === "") {
        autoreError.textContent = "Devi selezionare un autore.";
        formValido = false;
    }

    if (!formValido) return;

   
    const nuovoPost = {
        userId: Number(autoreId),
        titolo: titolo,
        contenuto: contenuto,
        likes: 0,
        data: new Date().toISOString().split("T")[0]
    };

    try {
        const response = await fetch(`${BASE_URL}/posts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuovoPost)
        });

        if (!response.ok) throw new Error("Errore durante il salvataggio del post.");

        // 4. Successo
        postForm.reset();
        mostraMessaggio("Post creato con successo!", "successo");
    } catch (error) {
        mostraMessaggio("Si è verificato un errore: " + error.message, "errore");
    }
});

function mostraMessaggio(testo, tipo) {
    messageDiv.textContent = testo;
    messageDiv.className = `message ${tipo}`;
   
}

function resetErrori() {
    titoloError.textContent = "";
    contenutoError.textContent = "";
    autoreError.textContent = "";
}