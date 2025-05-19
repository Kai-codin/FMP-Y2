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

    document.querySelectorAll('.active-link').forEach(link => {
        link.classList.remove('active-link');
    });

    if (path.includes('home')) {
        document.getElementById('home-link')?.classList.add('active-link');
        loadImages();
    } else if (path.includes('research')) {
        document.getElementById('research-link')?.classList.add('active-link');
    } else if (path.includes('planning')) {
        document.getElementById('planning-link')?.classList.add('active-link');
    } else if (path.includes('game')) {
        document.getElementById('game-link')?.classList.add('active-link');
    } else if (path.includes('testing')) {
        document.getElementById('testing-link')?.classList.add('active-link');
    } else if (path.includes('evaluation')) {
        document.getElementById('evaluation-link')?.classList.add('active-link');
    } else if (path.includes('log')) {
        document.getElementById('log-link')?.classList.add('active-link');
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

function setActiveButton(button) {
    const buttons = document.querySelectorAll('.filter-buttons button');
    buttons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('filter', button.textContent.toLowerCase());
    window.history.pushState({}, '', currentUrl.toString());
}

function loadLogs() {
    const currentUrl = new URL(window.location.href);
    const filter = currentUrl.searchParams.get('filter') || 'all'; // Check for filter in URL

    fetch('/JSON/logs/log.json')
        .then(response => response.json())
        .then(data => {
            const logsContainer = document.getElementById('logs-container');
            logsContainer.innerHTML = `
                <div class="filter-buttons">
                    <button onclick="filterLogs('all'); setActiveButton(this)">All</button>
                    <button onclick="filterLogs('research'); setActiveButton(this)">Research</button>
                    <button onclick="filterLogs('planning'); setActiveButton(this)">Planning</button>
                    <button onclick="filterLogs('practical'); setActiveButton(this)">Practical</button>
                    <button onclick="filterLogs('game'); setActiveButton(this)">Game</button>
                    <button onclick="filterLogs('testing'); setActiveButton(this)">Testing</button>
                    <button onclick="filterLogs('evaluation'); setActiveButton(this)">Evaluation</button>
                </div>
                <div id="logs-content"></div>
            `;
            const logsContent = document.getElementById('logs-content');
            data.logs.forEach(log => {
                const logEntry = document.createElement('section');
                logEntry.classList.add(`${log.type}`);
                logEntry.innerHTML = `
                    <h2>${log.date}</h2>
                    <p><strong>Type:</strong> ${log.type.charAt(0).toUpperCase() + log.type.slice(1)}</p>
                    <p><strong>Details:</strong> ${log.details.replace(/\n/g, '<br>')}</p>
                    <p><strong>WWW:</strong> ${log.www.replace(/\n/g, '<br>')}</p>
                    <p><strong>EBI:</strong> ${log.ebi.replace(/\n/g, '<br>')}</p>
                    <div class="image-grid" id="image-grid">
                        ${log.image.map(
                            img => `<img src="${img.src}" alt="${img.alt}" title="${img.description}" style="cursor: pointer;" onclick="openModal('${img.src}')">`).join('')}
                    </div>
                `;
                logsContent.appendChild(logEntry);
            });
            filterLogs(filter); // Apply the filter from the URL
        })
        .catch(err => console.error('Error loading logs:', err));
}

function filterLogs(type) {
    const logEntries = document.querySelectorAll('#logs-content section');
    logEntries.forEach(entry => {
        if (type === 'all' || entry.classList.contains(type)) {
            entry.style.display = 'block';
        } else {
            entry.style.display = 'none';
        }
    });
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