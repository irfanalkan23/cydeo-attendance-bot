const { ipcRenderer } = require('electron');

ipcRenderer.on('student-names', (event, names) => {
    const studentList = document.getElementById('student-list');
    studentList.innerHTML = '';

    if (names.length === 0) {
        studentList.innerHTML = '<p style="color:red;">⚠️ Could not load student names. Please check your login or network.</p>';
        return;
    }

    names.forEach((name, index) => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = name;
        checkbox.id = `student-${index}`;

        const label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.innerText = name;

        const div = document.createElement('div');
        div.appendChild(checkbox);
        div.appendChild(label);
        studentList.appendChild(div);
    });
});

document.getElementById('submit').addEventListener('click', () => {
    const selected = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
        .map(cb => cb.value);

    ipcRenderer.send('submit-names', selected);
});