// //query selectors for inputs
// let statusInput = document.querySelector('#status');

// let object = {
//     ticket_status: statusInput.value
// }


async function noteFormHandler(event) {
    event.preventDefault();

    const tech_note = document.querySelector("textarea[name=notes-body]").value.trim();

    const ticket_id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];

    if (tech_note) {
        const response = await fetch('/api/comments', {
            method: 'POST',
            body: JSON.stringify({
                ticket_id,
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

document.querySelector('.notes-form').addEventListener('submit', noteFormHandler);