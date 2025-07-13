const firebaseConfig = {
  apiKey: "AIzaSyCTlpyWixrespwJRK61G4iuxMqE2Ds-Qsg",
  authDomain: "ruas-gurinhem.firebaseapp.com",
  databaseURL: "https://ruas-gurinhem-default-rtdb.firebaseio.com",
  projectId: "ruas-gurinhem",
  storageBucket: "ruas-gurinhem.appspot.com",
  messagingSenderId: "141299087958",
  appId: "1:141299087958:web:77a466634da1ecd00fd9f7",
  measurementId: "G-Q8ZYR49E8E"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

function cadastrar() {
  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  auth.createUserWithEmailAndPassword(email, senha)
    .then(userCredential => {
      const user = userCredential.user;
      db.collection("users").doc(user.uid).set({
        nome,
        email,
        role: "user"
      });
      alert("Conta criada!");
      window.location.href = "index.html";
    })
    .catch(error => alert(error.message));
}

function login() {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  auth.signInWithEmailAndPassword(email, senha)
    .then(userCredential => {
      const user = userCredential.user;

      const docRef = db.collection("users").doc(user.uid);
      docRef.get().then(doc => {
        if (!doc.exists) {
          docRef.set({
            email: user.email,
            nome: user.email.split("@")[0],
            role: "user"
          }).then(() => {
            alert("Perfil criado automaticamente. Login bem-sucedido como USUÁRIO.");
          });
        } else {
          const role = doc.data().role;
          if (role === "master") {
            alert("Login bem-sucedido como MASTER.");
            window.location.href = "admin.html";
          } else if (role === "admin") {
            alert("Login bem-sucedido como ADMIN.");
            window.location.href = "admin.html";
          } else {
            alert("Login bem-sucedido como USUÁRIO.");
            window.location.href = "https://orbisgeo.github.io/sigweb_gurinhem/";
          }
        }
      });
    })
    .catch(error => alert("Erro ao fazer login: " + error.message));
}

function logout() {
  auth.signOut().then(() => {
    window.location.href = "index.html";
  });
}

function redefinirSenha() {
  const email = document.getElementById("email").value;
  if (!email) {
    alert("Digite o e-mail para redefinir a senha.");
    return;
  }

  auth.sendPasswordResetEmail(email)
    .then(() => alert("E-mail de redefinição enviado!"))
    .catch(error => alert("Erro ao enviar e-mail: " + error.message));
}

function loadUsuarios() {
  auth.onAuthStateChanged(user => {
    if (user) {
      db.collection("users").doc(user.uid).get().then(doc => {
        if (doc.data().role !== "master") {
          alert("Acesso negado");
          window.location.href = "index.html";
        } else {
          db.collection("users").get().then(snapshot => {
            const div = document.getElementById("usuarios");
            div.innerHTML = "";
            snapshot.forEach(doc => {
              const u = doc.data();
              div.innerHTML += `
                <p>
                  <b>${u.nome}</b> (${u.email}) - ${u.role}
                  ${u.role !== "master" ? `
                    <button onclick="alterarRole('${doc.id}', 'user')">User</button>
                    <button onclick="alterarRole('${doc.id}', 'admin')">Admin</button>
                  ` : "(Master)"}
                </p>
              `;
            });
          });
        }
      });
    }
  });
}

function alterarRole(uid, role) {
  db.collection("users").doc(uid).update({ role })
    .then(() => loadUsuarios());
}

if (location.pathname.includes("painel.html")) {
  loadUsuarios();
}
