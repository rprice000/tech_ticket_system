

async function createTicket(event) {
  event.preventDefault();

  const problem_title = document.querySelector("#problem_title").value.trim();
  const problem_summary = document
    .querySelector("#problem_summary")
    .value.trim();
  const room_number = parseInt(document.querySelector("#room_number").value);
  const building = document.querySelector("#building").value.trim();
  const user_id = parseInt(document.querySelector("#user_id").value);

  if (problem_title && problem_summary && room_number && building && user_id) {
    const response = await fetch("/api/tickets", {
      method: "post",
      body: JSON.stringify({
        problem_title,
        problem_summary,
        room_number,
        building,
        user_id,
      }),
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      document.location.replace("/tickets");
    } else {
      document.querySelector("#alert_div").textContent = response.statusText;
    }
  } else {
    document.querySelector("#alert_div").textContent = 'Please Fill Out All Fields Above.';
  }

}

document.querySelector(".ticket-info").addEventListener('submit', createTicket);