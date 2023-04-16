document.getElementById('convertBtn').addEventListener('click', () => {
    const file = document.getElementById('csvFile').files[0];
  
    if (!file) {
      alert('Please select a CSV file.');
      return;
    }
  
    const reader = new FileReader();
  
    reader.onload = (e) => {
      const csv = e.target.result;
      const json = convertCSVToJson(csv);
      const jsonString = JSON.stringify(json, null, 2);
  
      // Create a Blob with the JSON data
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
  
      // Generate a download link and click it to start the download
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = 'teams.json';
      downloadLink.style.display = 'none';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };
  
    reader.readAsText(file);
  });
  
  function convertCSVToJson(csv) {
    const lines = csv.trim().split('\n');
    const result = [];
  
    let currentTeam = null;
  
    lines.forEach((line) => {
      const [id, name, tag, teamName] = line.split(';');
  
      if (teamName && teamName.trim()) {
        if (currentTeam) {
          result.push(currentTeam);
        }
        currentTeam = {
          name: teamName.trim(),
          members: []
        };
      }
  
      currentTeam.members.push({
        id: parseInt(id, 10),
        name: name.trim(),
        tag: tag.trim()
      });
    });
  
    if (currentTeam) {
      result.push(currentTeam);
    }
  
    return result;
  }
  