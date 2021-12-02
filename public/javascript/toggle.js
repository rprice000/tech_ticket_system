let ticket_status = document.querySelector("#status").getAttribute('data-status');
console.log(ticket_status);

document.querySelector('#status').textContent = (ticket_status === 'true') ? 'Close Ticket': 'Open Ticket';
console.log(typeof ticket_status);

async function toggleTicket(event) {
    event.preventDefault();

    let newStatus;
    if (ticket_status === 'true') {
        newStatus = false;
    } else {
        newStatus = true;
    }
    const ticket_id = parseInt(document.location.toString().split('/')
    [document.location.toString().split('/').length-1]
    );
    console.log(ticket_id);
    const response = await fetch(`/api/tickets/${ticket_id}`, {
        method: 'put',
        body: JSON.stringify({
            ticket_status: newStatus
        }),
        headers: { 'Content-Type': 'application/json' }
    });
    if (response.ok) {
        document.location.replace('/')
    }
}

document.querySelector('#status').addEventListener('click', toggleTicket);