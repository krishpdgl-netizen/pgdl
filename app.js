/* ==========================================
   PANACHE WMS APP.JS
========================================== */

/* ---------- TOAST ---------- */

const Toast = {
    success(message){
        alert("✅ " + message);
    },

    error(message){
        alert("❌ " + message);
    },

    info(message){
        alert("ℹ️ " + message);
    }
};


/* ---------- MODAL ---------- */

const Modal = {

    open(id){
        const modal = document.getElementById(id);
        if(modal){
            modal.style.display = "flex";
        }
    },

    close(id){
        const modal = document.getElementById(id);
        if(modal){
            modal.style.display = "none";
        }
    }

};


/* ---------- VALIDATION ---------- */

const Validate = {

    field(element,rules){

        let valid = true;

        if(rules.required){
            if(!element.value.trim()){
                valid = false;
            }
        }

        if(rules.email){

            const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if(!emailRegex.test(element.value)){
                valid = false;
            }
        }

        if(rules.minLen){

            if(element.value.length < rules.minLen){
                valid = false;
            }
        }

        return valid;
    }

};


/* ---------- AUTH ---------- */

const Auth = {

    setSession(token,user,role){

        localStorage.setItem("token",token);
        localStorage.setItem("user",JSON.stringify(user));
        localStorage.setItem("role",role);

    },

    getUser(){

        const user =
        localStorage.getItem("user");

        if(user){
            return JSON.parse(user);
        }

        return null;
    },

    getRole(){
        return localStorage.getItem("role");
    },

    isLoggedIn(){
        return localStorage.getItem("token") !== null;
    },

    clearSession(){

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");

    },

    redirectByRole(role){

        if(role === "admin"){

            window.location.href =
            "admin-dashboard.html";

        }

        else if(role === "manager"){

            window.location.href =
            "manager-dashboard.html";

        }

        else{

            window.location.href =
            "employee-dashboard.html";

        }

    }

};


/* ---------- API CONFIG ---------- */

const API = {

    BASE_URL:
    "http://127.0.0.1:8000",

};


/* ---------- HELPERS ---------- */

function getInitials(name){

    if(!name) return "U";

    return name
        .split(" ")
        .map(word => word[0])
        .join("")
        .toUpperCase()
        .substring(0,2);
}


function getAvatarColor(name){

    const colors = [
        "#2563eb",
        "#7c3aed",
        "#dc2626",
        "#059669",
        "#ea580c"
    ];

    let hash = 0;

    for(let i=0;i<name.length;i++){

        hash =
        name.charCodeAt(i)
        + ((hash << 5) - hash);

    }

    return colors[
        Math.abs(hash)
        % colors.length
    ];
}


/* ---------- PAGE LOAD ---------- */

document.addEventListener(
    "DOMContentLoaded",
    function(){

        console.log(
        "Panache WMS Loaded Successfully"
        );

    }
);
