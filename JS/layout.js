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
    }
}

function loadContent(path) {
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