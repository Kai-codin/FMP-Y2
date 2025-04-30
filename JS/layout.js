// Start Generation Here
fetch('/layout/header.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('header').innerHTML = data;
        setupNavigation(); // Call after header is loaded
    })
    .catch(err => console.error('Error loading header:', err));

fetch('/layout/footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer').innerHTML = data;
    })
    .catch(err => console.error('Error loading footer:', err));

function setupNavigation() {
    // Add click event listeners to all nav links
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link behavior

            const href = link.getAttribute('href');
            const viewPath = href === '/home.html' ? '/views/home.html' : `/views${href}`;

            // Load the content
            fetch(viewPath)
                .then(response => response.text())
                .then(html => {
                    // Replace content in the div.content
                    document.querySelector('.content').innerHTML = html;
                    // Update URL without reloading
                    window.history.pushState({}, '', href);
                    // Update active link
                    setActiveLink();
                })
                .catch(err => console.error('Error loading content:', err));
        });
    });
}

function setActiveLink(path) {

    document.querySelectorAll('.active').forEach(link => {
        link.classList.remove('active');
    });

    if (path.includes('home')) {
        document.getElementById('home-link')?.classList.add('active');
        loadImages();
    } else if (path.includes('research')) {
        document.getElementById('research-link')?.classList.add('active');
    } else if (path.includes('planning')) {
        document.getElementById('planning-link')?.classList.add('active');
    } else if (path.includes('game')) {
        document.getElementById('game-link')?.classList.add('active');
    } else if (path.includes('testing')) {
        document.getElementById('testing-link')?.classList.add('active');
    } else if (path.includes('evaluation')) {
        document.getElementById('evaluation-link')?.classList.add('active');
    } else if (path.includes('log')) {
        document.getElementById('log-link')?.classList.add('active');
        loadLogs();
    }
}

function loadContent(path) {
    window.history.pushState('path', 'Title', `?page=${path.split('/').pop().split('.')[0]}`);
    fetch(path)
        .then(response => response.text())
        .then(html => {
            document.querySelector('.content').innerHTML = html;
            setActiveLink(path);
        })
        .catch(err => {
            console.error('Error loading content:', err);
        });
}

function loadImages() {
    console.log('DOMContentLoaded');
    fetch('/JSON/images.json')
        .then(response => response.json())
        .then(data => {
            console.log('test');
            const grid = document.getElementById('image-grid');
            data.images.forEach((img, index) => {
                const image = document.createElement('img');
                image.src = img.src;
                image.alt = img.alt || `Game Screenshot ${index + 1}`;
                image.style.cursor = 'pointer';
                image.onclick = () => openModal(img.src);
                grid.appendChild(image);
            });
        })
        .catch(err => console.error('Error loading images:', err));
};

function loadLogs() {
    fetch('/JSON/logs/log.json')
        .then(response => response.json())
        .then(data => {
            const logsContainer = document.getElementById('logs-container');
            data.logs.forEach(log => {
                const logEntry = document.createElement('section');
                logEntry.classList.add(`${log.type}`);
                logEntry.innerHTML = `
                    <h2>${log.date} ${log.time}</h2>
                    <p><strong>Type:</strong> ${log.type.charAt(0).toUpperCase() + log.type.slice(1)}</p>
                    <p><strong>Details:</strong> ${log.details.replace(/\n/g, '<br>')}</p>
                    <div class="image-grid" id="image-grid">
                        ${log.image.map(
                            img => `<img src="${img.src}" alt="${img.alt}" title="${img.description}" style="cursor: pointer;" onclick="openModal('${img.src}')">`).join('')}
                    </div>
                    <div id="img-modal"
                        style="display:none; position:fixed; z-index:1000; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); align-items:center; justify-content:center;">
                        <span style="position:absolute; top:20px; right:30px; color:#fff; font-size:2rem; cursor:pointer;"
                            onclick="closeModal()">&times;</span>
                        <img id="modal-img" src="" alt="Popup Image" style="max-width:90%; max-height:90%;">
                    </div>
                `;
                logsContainer.appendChild(logEntry);
            });
        })
        .catch(err => console.error('Error loading logs:', err));
}

function openModal(src) {
    const modal = document.getElementById('img-modal');
    const modalImg = document.getElementById('modal-img');
    modalImg.src = src;
    modal.style.display = 'flex';
    document.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}
function closeModal() {
    document.getElementById('img-modal').style.display = 'none';
    document.removeEventListener('click', function (e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}