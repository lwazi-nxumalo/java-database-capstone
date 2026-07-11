export function openModal(type) {
    const modal = document.getElementById("modal");
    const modalBody = document.getElementById("modal-body");

    if (!modal || !modalBody) return;

    modal.style.display = "flex";

    const closeBtn = '<button id="closeModal" class="close">&times;</button>';

    if (type === "adminLogin") {
        modalBody.innerHTML = closeBtn + `
            <h2>Admin Login</h2>
            <input type="text" id="adminUsername" class="input-field" placeholder="Username" />
            <input type="password" id="adminPassword" class="input-field" placeholder="Password" />
            <button class="button" onclick="adminLoginHandler()">Login</button>
        `;
    } else if (type === "doctorLogin") {
        modalBody.innerHTML = closeBtn + `
            <h2>Doctor Login</h2>
            <input type="email" id="doctorEmail" class="input-field" placeholder="Email" />
            <input type="password" id="doctorPassword" class="input-field" placeholder="Password" />
            <button class="button" onclick="doctorLoginHandler()">Login</button>
        `;
    } else if (type === "addDoctor") {
        modalBody.innerHTML = closeBtn + `
            <h2>Add Doctor</h2>
            <input type="text" id="doctorName" class="input-field" placeholder="Full Name" />
            <input type="text" id="doctorSpecialty" class="input-field" placeholder="Specialty" />
            <input type="email" id="doctorEmailInput" class="input-field" placeholder="Email" />
            <input type="password" id="doctorPasswordInput" class="input-field" placeholder="Password" />
            <input type="text" id="doctorPhone" class="input-field" placeholder="Phone (10 digits)" />
            <div class="checkbox-group">
                <label>Available Times:</label>
                <label><input type="checkbox" value="09:00-10:00" /> 09:00-10:00</label>
                <label><input type="checkbox" value="10:00-11:00" /> 10:00-11:00</label>
                <label><input type="checkbox" value="11:00-12:00" /> 11:00-12:00</label>
                <label><input type="checkbox" value="12:00-13:00" /> 12:00-13:00</label>
                <label><input type="checkbox" value="13:00-14:00" /> 13:00-14:00</label>
                <label><input type="checkbox" value="14:00-15:00" /> 14:00-15:00</label>
                <label><input type="checkbox" value="15:00-16:00" /> 15:00-16:00</label>
                <label><input type="checkbox" value="16:00-17:00" /> 16:00-17:00</label>
            </div>
            <button class="button" onclick="adminAddDoctor()">Add Doctor</button>
        `;
    } else if (type === "patientLogin") {
        modalBody.innerHTML = closeBtn + `
            <h2>Patient Login</h2>
            <input type="email" id="patientEmailInput" class="input-field" placeholder="Email" />
            <input type="password" id="patientPasswordInput" class="input-field" placeholder="Password" />
            <button class="button" onclick="loginPatient()">Login</button>
        `;
    } else if (type === "patientSignup") {
        modalBody.innerHTML = closeBtn + `
            <h2>Patient Signup</h2>
            <input type="text" id="signupName" class="input-field" placeholder="Full Name" />
            <input type="email" id="signupEmail" class="input-field" placeholder="Email" />
            <input type="password" id="signupPassword" class="input-field" placeholder="Password" />
            <input type="text" id="signupPhone" class="input-field" placeholder="Phone" />
            <input type="text" id="signupAddress" class="input-field" placeholder="Address" />
            <button class="button" onclick="signupPatient()">Sign Up</button>
        `;
    }

    document.getElementById("closeModal").onclick = () => {
        modal.style.display = "none";
        modalBody.innerHTML = "";
    };

    window.onclick = (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
            modalBody.innerHTML = "";
        }
    };
}

window.openModal = openModal;