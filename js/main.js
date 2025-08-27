document.addEventListener('DOMContentLoaded', function () {

    // ================================= //
    // --- LÓGICA DE LA MINI TERMINAL --- //
    // ================================= //
    const terminalOutput = document.getElementById('terminal-output');
    if (terminalOutput) { // Verificamos que el elemento exista antes de usarlo
        const commands = [
            {
                cmd: 'whoami',
                response: 'Desarrollador en progreso. Constructor de ideas en la web.',
                delay: 2000
            },
            {
                cmd: 'ls ./skills',
                response: 'JavaScript  MySQL MongoDB  Python  HTML  CSS',
                delay: 3000
            },
            {
                cmd: 'cat motivation.txt',
                response: '"Crear soluciones que impacten positivamente a las personas."',
                delay: 4000
            }
        ];

        let commandIndex = 0;

        function typeCommand(command, onComplete) {
            let i = 0;
            const commandLine = document.createElement('div');
            commandLine.classList.add('mb-2');
            commandLine.innerHTML = `<span class="text-green-400">guest@admin:~$</span> <span class="text-white"></span>`;
            terminalOutput.appendChild(commandLine);
            
            const targetSpan = commandLine.querySelector('span.text-white');

            const interval = setInterval(() => {
                if (i < command.length) {
                    targetSpan.textContent += command[i];
                    i++;
                } else {
                    clearInterval(interval);
                    onComplete();
                }
            }, 100);
        }

        function typeResponse(response, onComplete) {
            let i = 0;
            const responseLine = document.createElement('div');
            responseLine.innerHTML = `<span class="text-cyan-400"></span>`;
            terminalOutput.appendChild(responseLine);

            const targetSpan = responseLine.querySelector('span.text-cyan-400');

            const interval = setInterval(() => {
                if (i < response.length) {
                    targetSpan.textContent += response[i];
                    i++;
                } else {
                    clearInterval(interval);
                    onComplete();
                }
            }, 40);
        }

        function runTerminal() {
            if (commandIndex >= commands.length) {
                setTimeout(() => {
                    terminalOutput.innerHTML = ""; // Limpia la terminal
                    commandIndex = 0;
                    runTerminal(); // Reinicia el ciclo
                }, 2000);
                return;
            }

            const current = commands[commandIndex];

            typeCommand(current.cmd, () => {
                setTimeout(() => {
                    typeResponse(current.response, () => {
                        setTimeout(() => {
                            commandIndex++;
                            runTerminal();
                        }, current.delay);
                    });
                }, 500);
            });
        }

        // Inicia la terminal después de un breve retraso
        setTimeout(runTerminal, 1500);
    }


    // =========================================== //
    // --- LÓGICA PARA FILTRADO Y PAGINACIÓN --- //
    // =========================================== //
    const filterContainer = document.querySelector('#tech-filters');
    const allProjectCards = Array.from(document.querySelectorAll('.project-card'));
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const pageInfo = document.getElementById('page-info');

    let currentPage = 1;
    const itemsPerPage = 3;
    let visibleProjects = [];

    function displayPage() {
        allProjectCards.forEach(card => card.style.display = 'none');
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const projectsToShow = visibleProjects.slice(startIndex, endIndex);
        projectsToShow.forEach(card => {
            card.style.display = 'block';
        });
        updatePaginationControls();
    }

    function updatePaginationControls() {
        const totalPages = Math.ceil(visibleProjects.length / itemsPerPage);
        if (totalPages === 0) {
            pageInfo.textContent = 'Página 1 de 1';
        } else {
            pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
        }
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage >= totalPages;
    }

    function applyFilter(filter) {
        if (filter === 'all') {
            visibleProjects = allProjectCards;
        } else {
            visibleProjects = allProjectCards.filter(card => {
                const cardTechs = card.getAttribute('data-tech') || '';
                return cardTechs.includes(filter);
            });
        }
        currentPage = 1;
        displayPage();
    }

    if (filterContainer) {
        filterContainer.addEventListener('click', (event) => {
            const target = event.target.closest('button');
            if (target) {
                document.querySelectorAll('.tech-filter-btn').forEach(btn => {
                    btn.classList.remove('active', 'bg-cyan-500', 'text-white');
                    btn.classList.add('bg-slate-800');
                });
                target.classList.add('active', 'bg-cyan-500', 'text-white');
                target.classList.remove('bg-slate-800');
                applyFilter(target.getAttribute('data-tech'));
            }
        });
    }

    if(nextBtn) {
        nextBtn.addEventListener('click', () => {
            const totalPages = Math.ceil(visibleProjects.length / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                displayPage();
            }
        });
    }

    if(prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                displayPage();
            }
        });
    }
    
    applyFilter('all');


    // =============================================== //
    // --- LÓGICA PARA ANIMACIONES AL HACER SCROLL --- //
    // =============================================== //
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    const elementsToReveal = document.querySelectorAll('.reveal');
    elementsToReveal.forEach(element => {
        observer.observe(element);
    });

});