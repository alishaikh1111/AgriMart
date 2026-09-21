async function loginUser(event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
       const response = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const result = await response.json();

        if (!response.ok) {
            alert(result.error);
            return;
        }

        localStorage.setItem("agrimartUser", JSON.stringify(result.user));

        alert("Login successful!");

        window.location.href = "index.html";

    } catch (error) {
        console.error(error);
        alert("Server connection failed!");
    }
}