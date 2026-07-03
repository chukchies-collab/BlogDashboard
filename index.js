/**
 * Progetto JS - Blog Dashboard (Pagina Lista Post)
 * 
 * API Base URL: http://localhost:5000/api
 * Risorse usate: /posts, /users
 * 
 * In questa pagina si usano:
 * - GET    → Leggere i post e gli utenti
 * - DELETE → Eliminare un post
 * 
 * =============================================
 * FASE 1 — VISUALIZZARE I POST
 * =============================================
 * 
 * 1. Metti a posto il file index.html con la struttura base (manca qualcosa)
 * 2. Al caricamento della pagina, recupera i post e gli utenti dall'API
 * 3. Mostra i post in una tabella con le colonne indicate nel file HTML
 * 4. Per ogni post, mostra il nome dell'autore (recuperato dagli utenti)
 *    e tronca il contenuto a 50 caratteri + "..." se è più lungo
 * 5. Aggiungi un pulsante "Elimina" per ogni post (colonna Azioni) al click
 * 
 * Suggerimenti per l'implementazione:
 * - Crea una funzione async "caricaPosts()" che fa un fetch GET a /api/posts
 *   e salva i post in una variabile globale (es. "posts")
 * - Crea una funzione async "caricaUtenti()" che fa un fetch GET a /api/users
 *   e salva gli utenti in una variabile globale (es. "utenti")
 * - Crea una funzione "mostraPosts(postsDaMostrare)" che mostra i post nella tabella
 */


const BASE_URL = 'http://localhost:5000/api';
const tableBody = document.querySelector('#postsTableBody');
const button = document.querySelector('.nav-link.active');
const authorFilter = document.querySelector('#authorFilter');
const searchInput = document.querySelector('#searchInput');
let tuttiIPosts = [];
let tuttiGliUtenti = [];



async function fetchDati() {
    try {
        const rispostaPosts = await fetch(`${BASE_URL}/posts`);
        const rispostaUsers = await fetch(`${BASE_URL}/users`);
        if (!rispostaPosts.ok || !rispostaUsers.ok) {
            throw Error("Errore nel caricamento");
        }

        const posts = await rispostaPosts.json();
        const users = await rispostaUsers.json();
        tuttiGliUtenti =users;
        tuttiIPosts =posts;

        showPost(posts, users);
        popolaFiltroAutori(users);
    }
    catch (error) {
        alert(`Si è verificato un errore: ${error.message}`);
    }

}

function showPost(posts, users) {

    tableBody.innerHTML = '';


    posts.forEach(post => {

        const autore = users.find(user => user.id === post.userId);


        const nome = autore ? autore.nome : 'Autore';
        const cognome = autore ? autore.cognome : 'Sconosciuto';


        const row = document.createElement('tr');
        let contenutoTroncato = post.contenuto;
        if (contenutoTroncato.length > 50) {
            contenutoTroncato = contenutoTroncato.slice(0, 50) + '...';
        }
        row.innerHTML = `
            <td>${nome} ${cognome}</td>
            <td>${post.titolo}</td>
            <td>${contenutoTroncato}</td>
            <td>${post.likes}</td>
            <td>${post.data}</td>
            <td>
                <button class="btn-delete">Elimina</button>
            </td>
        `;

        tableBody.append(row);
       const btnElimina = row.querySelector('.btn-delete');
       
        const postId= post.postId;
        
        btnElimina.addEventListener('click', () => {
    
            eliminaPost(postId)
           
        });

    });
}

fetchDati()
/**
 * =============================================
 * FASE 2 — FILTRI
 * =============================================
 * 
 * 1. Popola il dropdown di filtro autore (#authorFilter) con i nomi degli utenti già recuperati
 * 2. Fai in modo che quando l'utente scrive qualcosa nell'input di ricerca o seleziona un autore dal dropdown, i post mostrati si filtrino di conseguenza
 * 3. Il filtro per titolo deve cercare i post il cui titolo contiene il testo inserito (non deve essere una corrispondenza esatta)
 * 
 * Suggerimenti per l'implementazione:
 * - Crea una funzione "popolaFiltroAutori()" che aggiunge un <option> per ogni autore al dropdown
 * - Crea una funzione "filtraPosts()" che legge i valori dei filtri e filtra l'array completo dei post (la variabile globale) in base a quei valori, poi chiama mostraPosts() con il NUOVO array filtrato
 * - Aggiungi gli event listener per i filtri: sull'input di ricerca (evento "input") e sul dropdown autore (evento "change") → entrambi chiamano filtraPosts()
 * - Per il filtro autore, ricorda che il value del dropdown è una stringa, mentre l'userId nei post è un numero → usa parseInt() per confrontarli correttamente
 * - I due filtri devono lavorare insieme, quindi filtraPosts() deve applicare entrambi i filtri all'array completo dei post
 */


function popolaFiltroAutori(users) {
    // On réinitialise pour ne pas cumuler si on recharge
    authorFilter.innerHTML = '<option value="">Tutti gli autori</option>';

    users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id; // L'ID sert de valeur technique
        option.textContent = `${user.nome} ${user.cognome}`; // Le texte visible par l'utilisateur
        authorFilter.append(option);
    });
}


function filtraPosts() {
    // Recuperiamo i valori attuali dei filtri
    const testoRicerca = searchInput.value.toLowerCase().trim();
    const autoreSelezionato = authorFilter.value; // Sarà una stringa (es: "2") o vuoto ""

    // Partiamo sempre dal tableau COMPLET d'origine
    let postsFiltrati = tuttiIPosts;

    // Filtro 1: Per titolo (se c'è del testo inserito)
    if (testoRicerca !== "") {
        postsFiltrati = postsFiltrati.filter(post => 
            post.titolo.toLowerCase().includes(testoRicerca)
        );
    }

    // Filtro 2: Per autore (se un autore specifico è selezionato)
    if (autoreSelezionato !== "") {
        postsFiltrati = postsFiltrati.filter(post => 
            post.userId === parseInt(autoreSelezionato)
        );
    }

    // Mostriamo solo i post che hanno superato entrambi i filtri
    showPost(postsFiltrati, tuttiGliUtenti);
}

searchInput.addEventListener('input', filtraPosts);
authorFilter.addEventListener('change', filtraPosts);


/**
 * =============================================
 * FASE 3 — ELIMINARE UN POST
 * =============================================
 * 
 * 1. Aggiungi un pulsante "Elimina" per ogni post nella tabella (colonna Azioni) se non fatto già prima
 * 2. Quando l'utente clicca su "Elimina", chiedi conferma con confirm("Sei sicuro?") o simile
 * 3. Se l'utente conferma, fai un fetch DELETE a /api/posts/{id} per eliminare il post
 * 4. Se l'eliminazione ha successo, ricarica i post
 * 
 * Suggerimenti per l'implementazione:
 * - Crea una funzione "eliminaPost(postId)" che fa un fetch DELETE a /api/posts/{postId} e ricarica tutti i post
 * - Usa confirm() per chiedere conferma all'utente prima di eliminare (ovvero all'inizio della funzione)
 * - Usa try/catch per gestire eventuali errori di rete durante l'eliminazione
 * - MODIFICA la funzione mostraPosts() per aggiungere un event listener al nuovo pulsante "Elimina" di ogni post, che chiama eliminaPost() con l'id del post da eliminare
 */

async function eliminaPost(postId) {
    
    const conferma = confirm("Sei sicuro di voler eliminare questo post?");
    
   
    if (!conferma) return;

    try {
        // 2. Envoi de la requête DELETE à l'API
        const risposta = await fetch(`${BASE_URL}/posts/${postId}`, {
            method: 'DELETE'
        });

        // Verifications des erreurs serveurs
        if (!risposta.ok) {
            throw new Error("Impossibile eliminare il post dal server.");
        }

        // 3. Si tout s'est bien passé, on recharge les données
        alert("Post eliminato con successo!");
        await fetchDati(); // Cette fonction réaffiche le tableau mis à jour

    } catch (error) {
        // Gestion des erreurs de réseau
        alert(`Errore durante l'eliminazione: ${error.message}`);
    }
}

