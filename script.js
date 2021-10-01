

function fetchJson(url){
    return fetch(url).then((r) => {
        if(r.ok){
            return r.json();
        }else{
            throw new Error("Erro ao carregar os dados!!", r.statusText);
        }
    });
}


////////////////////////////////////////////////////////////////////////////////////
async function init(){
    const [employees, roles] = await Promise.all([
        fetchJson("http://localhost:3000/employees"),
        fetchJson("http://localhost:3000/roles")
    ]);        

    initRoles(roles);
    updateEmployees(employees, roles);
    
    const app = document.querySelector(".content-area");
    app.addEventListener("change", () => updateEmployees(employees, roles));
}
init();


////////////////////////////////////////////////////////////////////////////////////
function initRoles(roles){
    const rolesFilter = document.getElementById("filtering");
    for(const role of roles) {
        const label = document.createElement("label");
        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.value = role.id;

        label.append(checkbox, role.name);
        rolesFilter.append(label);
    }
}

function updateEmployees(employees, roles){
    
    //Selecionando quais e quantos filtros estão marcados como checked
    const checkboxes = document.querySelectorAll("input:checked");
    const rolesId = [];
    for (let i = 0; i < checkboxes.length; i++){
        const roleid = parseInt(checkboxes[i].value);
        rolesId.push(roleid);
    }
    const filteredEmployees = employees.filter((employee) => {
        if (rolesId.length === 0) {
            return true;
        }else{
            return rolesId.indexOf(employee.role_id) !== -1;
        }
    });


    // Ordenação
    const sortby = document.getElementById("selectSort").value;
    filteredEmployees.sort((a, b) => {
        switch (sortby) {
            case "ascName":
                return compare(a.name, b.name);
            case "descName":
                return -compare(a.name, b.name);
            case "ascSal":
                return compare(a.salary, b.salary);
            case "descSal":
                return -compare(a.salary, b.salary);
        }
    });

    
    ///////////////////////////////////////////////////////////
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = "";

    for(const employee of filteredEmployees) {
        const tr = document.createElement("tr");
        const tdId = document.createElement("td");
        const tdName = document.createElement("td");
        const tdRole = document.createElement("td");
        const tdSalary = document.createElement("td");

        const role = roles.find((role) => role.id === employee.role_id);

        tdId.textContent = employee.id;
        tdName.textContent = employee.name;
        tdRole.textContent = role.name;
        tdSalary.textContent = employee.salary;

        tr.append(tdId, tdName, tdRole, tdSalary);
        tbody.append(tr);
    }
    document.getElementById("counter").textContent = "("+ filteredEmployees.length +")";
}



function compare(v1, v2){
    if (v1 < v2) {
        return -1
    } else if(v1 > v2){
        return 1
    }else{
        0;
    }
}