let teams = [];

function createTeam() {
  const teamName = document.getElementById("teamName").value;
  if (!teamName) {
    alert("Please enter a team name");
    return;
  }
  teams.push({ name: teamName, members: [] });
  document.getElementById("teamName").value = "";
  renderTeams();
}

function deleteTeam(index) {
  teams.splice(index, 1);
  renderTeams();
}

function addMember(teamIndex) {
  const memberName = document.getElementById(`memberName${teamIndex}`).value;
  const memberType = document.getElementById(`memberType${teamIndex}`).value;
  if (!memberName || !memberType) {
    alert("Please enter member name and select a Type");
    return;
  }
  const memberId = Date.now(); // Generate a unique ID based on the current timestamp
  teams[teamIndex].members.push({ id: memberId, name: memberName, tag: memberType });
  document.getElementById(`memberName${teamIndex}`).value = "";
  renderTeams();
}

function deleteTeam(teamIndex) {
    if (confirm("Are you sure you want to delete this team?")) {
      teams.splice(teamIndex, 1);
      renderTeams();
    }
  }
  
  function deleteMember(teamIndex, memberIndex) {
    if (confirm("Are you sure you want to delete this member?")) {
      teams[teamIndex].members.splice(memberIndex, 1);
      renderTeams();
    }
  }  

function editMember(teamIndex, memberIndex) {
  const memberName = prompt("Enter the new member name:", teams[teamIndex].members[memberIndex].name);
  if (memberName === null || memberName === "") {
    return;
  }
  const memberType = prompt("Enter the new member Type (Patet/Indek/Chalmers/Utland):", teams[teamIndex].members[memberIndex].Type);
  if (memberType === null || memberType === "") {
  return;
  }
  teams[teamIndex].members[memberIndex].name = memberName;
  teams[teamIndex].members[memberIndex].tag = memberType;
  renderTeams();
}


  
function renderTeams() {
    const teamsContainer = document.getElementById("teams");
    teamsContainer.innerHTML = "";
    var memberNumber = 0;
    teams.forEach((team, teamIndex) => {
        const teamDiv = document.createElement("div");
        teamDiv.classList.add("team");
        const teamTitle = document.createElement("h3");
        teamTitle.textContent = team.name;
        teamDiv.appendChild(teamTitle);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete Team";
        deleteButton.onclick = () => deleteTeam(teamIndex);
        teamDiv.appendChild(deleteButton);

        const memberList = document.createElement("ul");
        
        team.members.forEach((member, memberIndex) => {
            // Add member text
            member.id = memberNumber ++;
            const listItem = document.createElement("li");
            listItem.textContent = `${member.id} - ${member.name} (${member.tag})`;
            

            // Add Edit button
            const editLink = document.createElement("span");
            editLink.textContent = "Edit";
            editLink.classList.add("edit-member");
            editLink.onclick = () => editMember(teamIndex, memberIndex);
            listItem.appendChild(editLink);

            // Add delete button
            const deleteLink = document.createElement("span");
            deleteLink.textContent = "Delete";
            deleteLink.classList.add("edit-member");
            deleteLink.onclick = () => deleteMember(teamIndex, memberIndex);
            listItem.appendChild(deleteLink);

            memberList.appendChild(listItem);
        });

        teamDiv.appendChild(memberList);

        const memberNameInput = document.createElement("input");
        memberNameInput.type = "text";
        memberNameInput.id = `memberName${teamIndex}`;
        memberNameInput.placeholder = "Member Name";
        teamDiv.appendChild(memberNameInput);

        const memberTypeSelect = document.createElement("select");
        memberTypeSelect.id = `memberType${teamIndex}`;
        
        const options = ["Patet", "Indek", "Chalmers", "Utland"];
        options.forEach(optionValue => {
          const option = document.createElement("option");
          option.value = optionValue;
          option.textContent = optionValue;
          memberTypeSelect.appendChild(option);
        });
        
        teamDiv.appendChild(memberTypeSelect);

        const addButton = document.createElement("button");
        addButton.textContent = "Add Member";
        addButton.onclick = () => addMember(teamIndex);
        teamDiv.appendChild(addButton);

        teamsContainer.appendChild(teamDiv);
    });
}

// Add these functions at the end of the file

function saveToFile() {
    const data = new Blob([JSON.stringify(teams)], { type: "application/json" });
    const url = URL.createObjectURL(data);
    const link = document.createElement("a");
    link.href = url;
    link.download = "teams.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  function loadFromFile() {
    const fileInput = document.getElementById("loadFile");
    const file = fileInput.files[0];
    if (!file) {
      alert("Please select a file");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const loadedData = JSON.parse(event.target.result);
        if (!Array.isArray(loadedData)) {
          throw new Error("Invalid data format");
        }
        teams = loadedData;
        renderTeams();
      } catch (error) {
        alert("Error loading file: " + error.message);
      }
    };
    reader.readAsText(file);
    fileInput.value = "";
  }
  