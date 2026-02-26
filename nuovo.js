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


