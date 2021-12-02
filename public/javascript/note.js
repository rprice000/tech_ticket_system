// //query selectors for inputs
// let statusInput = document.querySelector('#status');

// let object = {
//     ticket_status: statusInput.value
// }


async function noteFormHandler(event) {
    event.preventDefault();

    const tech_note = document.querySelector("textarea[name='tech_note']").value.trim();

    const ticket_id = parseInt(document.querySelector('#ticket_id').value);
    const user_id = parseInt(document.querySelector('#user_id').value);

    if (tech_note) {
        const response = await fetch('/api/notes', {
            method: 'POST',
            body: JSON.stringify({
                ticket_id,
                user_id,
                tech_note
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            document.location.reload();
        } else {
            alert(response.statusText)
        }
    }
}

document.querySelector('#ticket-note-form').addEventListener('submit', noteFormHandler);