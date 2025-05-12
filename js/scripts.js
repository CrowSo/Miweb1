document.addEventListener('DOMContentLoaded', () => {
    // Selección de elementos del DOM globales
    const modalOverlay = document.getElementById('quote-modal-overlay');
    const modalCardPlaceholder = document.getElementById('modal-card-placeholder');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalActionsSidebarContainer = document.getElementById('modal-actions-sidebar-container');
    
    const categoryTitleElement = document.getElementById('category-title');
    const breadcrumbOl = document.getElementById('breadcrumb-ol');
    const categoryWelcomeMessage = document.getElementById('category-welcome-message');
    const homeLogoLinks = document.querySelectorAll('.home-logo-link'); // Incluye el del menú móvil
    const breadcrumbInicioLink = document.getElementById('breadcrumb-inicio'); // El estático inicial

    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const closeMobileMenuButton = document.getElementById('close-mobile-menu-button');
    const mobileMenuPanel = document.getElementById('mobile-menu-panel');

    const categoriasMenuButton = document.getElementById('categorias-menu-button');
    const megaMenuPanelCategorias = document.getElementById('mega-menu-panel-categorias');
    let megaMenuHoverTimeout;


    const categoryViewContainer = document.getElementById('category-view-container');
    const cardsContainerDynamic = document.getElementById('cards-container-dynamic');
    const searchPhrasesInput = document.getElementById('search-phrases-input');
    
    const globalSearchForm = document.getElementById('global-search-form');
    const globalSearchInput = document.getElementById('global-search-input');
    const mobileSearchForm = document.getElementById('mobile-search-form');
    const mobileSearchInput = document.getElementById('mobile-search-input');

    // Contenedores para la página "Explorar Todas las Categorías"
    const exploreAllCategoriesPage = document.getElementById('explore-all-categories-page');
    const allCategoriesContentList = document.getElementById('all-categories-content-list');
    const mainContentArea = document.getElementById('main-content-area');
    const exploreAllLinkHeader = document.getElementById('explore-all-link-header');
    const exploreAllLinkMobile = document.getElementById('explore-all-link-mobile');
    const footerExploreAllLink = document.getElementById('footer-explore-all-link');


    // Filtros Facetados
    const filterAuthorType = document.getElementById('filter-author-type');
    const filterOccasion = document.getElementById('filter-occasion');
    const filterStyle = document.getElementById('filter-style');
    const resetFiltersButton = document.getElementById('reset-filters-button');

    // Lista de temas para las tarjetas
    const themes = [
        'theme-nature', 'theme-minimalist-gradient', 'theme-dark-elegant', 'theme-old-paper',
        'theme-neon-glow', 'theme-pastel-dream', 'theme-sharp-contrast', 'theme-ocean-depths',
        'theme-synthwave-sunset', 'theme-forest-path', 'theme-vibrant-mesh', 'theme-golden-elegance',
        'theme-spring-bloom', 'theme-cosmic-dust'
    ];
    const alignmentClasses = ['text-align-top', 'text-align-middle', 'text-align-bottom'];
    let activeModalCardInstance = null;
    let currentCategoryIdGlobal = null; 
    let currentCategoryNameGlobal = '';
    let currentFilters = { // Para mantener el estado de los filtros facetados
        authorType: '',
        occasion: '',
        style: ''
    };

    // --- DATOS DE FRASES (Ejemplo - DEBES REEMPLAZAR ESTO CON TUS DATOS REALES) ---
    // Asegúrate de que los 'categories' coincidan con los 'data-category-id' del HTML.
    // Añadidos campos: authorType, occasion, style para filtros facetados
    const allQuotesData = [
        {
            id: 1,
            text: "La única cosa que sé es que no sé nada.",
            author: "Sócrates",
            authorType: "Filósofo Clásico",
            occasion: "Reflexión Filosófica",
            style: "Profunda",
            year: "c. 399 a.C.",
            explanation: "Esta famosa frase resume la humildad intelectual de Sócrates y su método de indagación filosófica, la mayéutica.",
            categories: ["sabiduria-filosofos", "sabiduria-analisis", "recomendaciones"],
            themeElements: { sky: true, hill: true }
        },
        {
            id: 2,
            text: "Pienso, luego existo.",
            author: "René Descartes",
            authorType: "Filósofo Moderno",
            occasion: "Reflexión Filosófica",
            style: "Aforismo",
            year: "1637",
            explanation: "Proviene de su obra \"El Discurso del Método\". Es el punto de partida de su sistema filosófico.",
            categories: ["sabiduria-filosofos", "recomendaciones"],
            themeElements: { gradientOverlay: true }
        },
        {
            id: 3,
            text: "El amor es la fuerza más humilde, pero la más poderosa de que dispone el mundo.",
            author: "Mahatma Gandhi",
            authorType: "Líder Pacifista",
            occasion: "Inspiracional",
            style: "Conmovedora",
            year: "c. 1930",
            explanation: "Gandhi enfatiza la potencia transformadora del amor y la no violencia.",
            categories: ["amor-dedicar", "sabiduria-espiritualidad", "recomendaciones"],
        },
        {
            id: 4,
            text: "Para amar se necesita coraje.",
            author: "Frida Kahlo",
            authorType: "Artista",
            occasion: "Amor",
            style: "Directa",
            year: "c. 1940",
            explanation: "Una reflexión sobre la valentía inherente al acto de amar.",
            categories: ["amor-dedicar", "amor-parejas", "frase-del-dia"],
        },
        {
            id: 5,
            text: "La mejor manera de empezar es dejar de hablar y empezar a hacer.",
            author: "Walt Disney",
            authorType: "Emprendedor",
            occasion: "Motivación Laboral",
            style: "Práctica",
            year: "c. 1950",
            explanation: "Un llamado a la acción y la proactividad.",
            categories: ["motivacion-emprendedores", "motivacion-dia", "frase-del-dia"],
        },
        {
            id: 6,
            text: "No cuentes los días, haz que los días cuenten.",
            author: "Muhammad Ali",
            authorType: "Deportista",
            occasion: "Motivación Diaria",
            style: "Impactante",
            year: "c. 1970",
            explanation: "Inspiración para vivir cada día con propósito.",
            categories: ["motivacion-dia", "motivacion-superacion", "recomendaciones"],
        },
         {
            id: 7,
            text: "Somos lo que hacemos repetidamente. La excelencia, entonces, no es un acto, sino un hábito.",
            author: "Aristóteles", // Asumiendo que es Will Durant parafraseando a Aristóteles
            authorType: "Filósofo Clásico", // O "Historiador" si es Durant
            occasion: "Superación Personal",
            style: "Reflexiva",
            year: "c. 350 a.C.",
            explanation: "Destaca la importancia de la constancia y la práctica en la búsqueda de la excelencia.",
            categories: ["sabiduria-filosofos", "motivacion-superacion"],
        },
        {
            id: 8,
            text: "La vida es como montar en bicicleta. Para mantener el equilibrio, debes seguir moviéndote.",
            author: "Albert Einstein",
            authorType: "Científico",
            occasion: "Vida Cotidiana",
            style: "Metafórica",
            year: "1930",
            explanation: "Una metáfora sobre la naturaleza dinámica de la vida y la necesidad de progreso.",
            categories: ["sabiduria-analisis", "motivacion-dia", "frase-del-dia", "reflexion-vida"],
        },
        {
            id: 9,
            text: "El tiempo lo cura todo, pero ¿quién cura al tiempo?",
            author: "Desconocido",
            authorType: "Popular",
            occasion: "Reflexión Temporal",
            style: "Poética",
            year: "N/A",
            explanation: "Una reflexión sobre la naturaleza del tiempo y el proceso de sanación.",
            categories: ["reflexion-tiempo", "sabiduria-analisis"],
        },
        {
            id: 10,
            text: "La creatividad es la inteligencia divirtiéndose.",
            author: "Albert Einstein", // Atribuido, pero debatido. Se usará para el ejemplo.
            authorType: "Científico",
            occasion: "Creatividad",
            style: "Ingeniosa",
            year: "N/A",
            explanation: "Una forma ingeniosa de describir el proceso creativo.",
            categories: ["creatividad-ia", "autores-cientificos", "motivacion-superacion"],
        }
    ];

    // --- LÓGICA DEL MENÚ MÓVIL Y ACORDEONES ---
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenuPanel.classList.remove('-translate-x-full');
            // mobileMenuPanel.classList.add('translate-x-0'); // Tailwind se encarga si la clase anterior se quita
            mobileMenuPanel.removeAttribute('hidden');
            mobileMenuButton.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
            mobileMenuPanel.querySelector('a, button, input') ?.focus(); // Enfocar primer elemento
        });
    }

    function closeMobileMenu() {
        if (mobileMenuPanel) {
            mobileMenuPanel.classList.add('-translate-x-full');
            // mobileMenuPanel.classList.remove('translate-x-0');
            mobileMenuPanel.setAttribute('hidden', 'true');
            if (mobileMenuButton) mobileMenuButton.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
            if (mobileMenuButton) mobileMenuButton.focus(); // Devolver foco al botón que abrió
        }
    }
    if (closeMobileMenuButton) {
        closeMobileMenuButton.addEventListener('click', closeMobileMenu);
    }
     // Cerrar menú móvil con tecla Escape
    mobileMenuPanel.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeMobileMenu();
        }
    });


    document.querySelectorAll('.accordion-toggle').forEach(button => {
        button.addEventListener('click', () => {
            const content = document.getElementById(button.getAttribute('aria-controls'));
            const isExpanded = button.getAttribute('aria-expanded') === 'true';
            
            button.setAttribute('aria-expanded', !isExpanded);
            content.hidden = isExpanded;

            if (!isExpanded) {
                content.style.maxHeight = content.scrollHeight + "px";
                button.querySelector('svg:not(.sub-accordion-item svg)') ?.classList.add('rotate-180');
            } else {
                content.style.maxHeight = "0px";
                button.querySelector('svg:not(.sub-accordion-item svg)') ?.classList.remove('rotate-180');
            }
        });
    });

    document.querySelectorAll('.sub-accordion-toggle').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // Evitar que el acordeón padre se cierre
            const content = document.getElementById(button.getAttribute('aria-controls'));
            const isExpanded = button.getAttribute('aria-expanded') === 'true';

            button.setAttribute('aria-expanded', !isExpanded);
            content.hidden = isExpanded;
            
            const icon = button.querySelector('svg');
            if (!isExpanded) {
                content.style.maxHeight = content.scrollHeight + "px";
                if (icon) icon.classList.add('rotate-90');
            } else {
                content.style.maxHeight = "0px";
                if (icon) icon.classList.remove('rotate-90');
            }
        });
    });

    // --- LÓGICA DEL MEGA MENÚ DESKTOP ---
    // Mejorada con retraso y gestión de foco para accesibilidad
    if (categoriasMenuButton && megaMenuPanelCategorias) {
        const showMegaMenu = () => {
            clearTimeout(megaMenuHoverTimeout);
            megaMenuPanelCategorias.classList.add('visible');
            categoriasMenuButton.setAttribute('aria-expanded', 'true');
        };

        const hideMegaMenu = (isImmediate = false) => {
            if (isImmediate) {
                megaMenuPanelCategorias.classList.remove('visible');
                categoriasMenuButton.setAttribute('aria-expanded', 'false');
            } else {
                megaMenuHoverTimeout = setTimeout(() => {
                    if (!megaMenuPanelCategorias.matches(':hover') && !categoriasMenuButton.matches(':focus-within')) {
                         megaMenuPanelCategorias.classList.remove('visible');
                         categoriasMenuButton.setAttribute('aria-expanded', 'false');
                    }
                }, 250); // Retraso para cerrar
            }
        };
        
        categoriasMenuButton.addEventListener('mouseenter', showMegaMenu);
        categoriasMenuButton.addEventListener('focus', showMegaMenu); // Para navegación por teclado
        
        categoriasMenuButton.addEventListener('mouseleave', () => hideMegaMenu());
        megaMenuPanelCategorias.addEventListener('mouseleave', () => hideMegaMenu());

        // Cerrar con Escape si el foco está dentro
        megaMenuPanelCategorias.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                hideMegaMenu(true);
                categoriasMenuButton.focus();
            }
        });
        // Mantener abierto si el foco se mueve a un elemento del menú
        megaMenuPanelCategorias.addEventListener('focusout', (event) => {
            if (!megaMenuPanelCategorias.contains(event.relatedTarget) && event.relatedTarget !== categoriasMenuButton) {
                hideMegaMenu(true);
            }
        });
    }


    // --- CREACIÓN Y MANEJO DE TARJETAS DE FRASES ---
    function createQuoteCardElement(quoteData, index) {
        const card = document.createElement('div');
        card.className = 'quote-card'; // Opacidad y transform se manejan en JS para escalonado
        card.dataset.quoteId = quoteData.id;
        card.dataset.currentThemeIndex = index % themes.length;
        card.classList.add(themes[index % themes.length]);
        // card.tabIndex = 0; // Para que sea enfocable si se desea navegar por tarjetas

        const cardBackground = document.createElement('div');
        cardBackground.className = 'card-background';
        if (quoteData.themeElements ?.sky) cardBackground.innerHTML += '<div class="sky-element"></div>';
        if (quoteData.themeElements ?.hill) cardBackground.innerHTML += '<div class="hill-element"></div>';
        if (quoteData.themeElements ?.gradientOverlay) cardBackground.innerHTML += '<div class="gradient-overlay-shape"></div>';
        card.appendChild(cardBackground);

        const cardContent = document.createElement('div');
        cardContent.className = 'card-content text-align-middle'; // Alineación por defecto
        cardContent.innerHTML = `
            <blockquote class="quote-text">"${quoteData.text}"</blockquote>
            <p class="quote-author">- ${quoteData.author}</p>
            <p class="quote-year">${quoteData.year || ''}</p>
            <div class="quote-explanation" ${quoteData.explanation ? '' : 'hidden'}>
                <p>${quoteData.explanation || ''}</p>
            </div>
        `;
        card.appendChild(cardContent);

        const cardActions = document.createElement('div');
        cardActions.className = 'card-actions';
        cardActions.innerHTML = `
            <button type="button" class="btn-change-theme" aria-label="Cambiar diseño de la frase" title="Cambiar diseño">🎨</button>
            <button type="button" class="btn-download-card" aria-label="Descargar frase como imagen" title="Descargar frase">💾</button>
        `;
        card.appendChild(cardActions);
        return card;
    }

    function initializeCardFunctionality(cardElement) {
        const changeThemeBtn = cardElement.querySelector('.btn-change-theme');
        if (changeThemeBtn) {
            changeThemeBtn.addEventListener('click', (event) => {
                event.stopPropagation();
                let currentThemeIndex = parseInt(cardElement.dataset.currentThemeIndex, 10);
                cardElement.classList.remove(themes[currentThemeIndex]);
                currentThemeIndex = (currentThemeIndex + 1) % themes.length;
                cardElement.classList.add(themes[currentThemeIndex]);
                cardElement.dataset.currentThemeIndex = currentThemeIndex;
            });
        }

        const downloadBtn = cardElement.querySelector('.btn-download-card');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', (event) => {
                event.stopPropagation();
                const actionsPanel = cardElement.querySelector('.card-actions');
                const originalActionsDisplay = actionsPanel ? actionsPanel.style.display : null;
                if (actionsPanel) actionsPanel.style.display = 'none';
                
                const originalTransform = cardElement.style.transform;
                const originalBoxShadow = cardElement.style.boxShadow;
                cardElement.style.transform = 'none'; // Evitar que la escala del hover afecte la captura
                cardElement.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';

                html2canvas(cardElement, { useCORS: true, backgroundColor: null, scale: 2 })
                .then(canvas => {
                    const image = canvas.toDataURL('image/png');
                    const link = document.createElement('a');
                    const author = cardElement.querySelector('.quote-author')?.textContent.replace(/^-/, '').trim() || 'autor';
                    const quoteStart = cardElement.querySelector('.quote-text')?.textContent.substring(1, 20).replace(/[^a-zA-Z0-9\s]/g, '').trim().replace(/\s+/g, '_') || 'frase';
                    link.download = `frase_${author}_${quoteStart}.png`;
                    link.href = image;
                    link.click();
                }).catch(err => {
                    console.error("Error al generar la imagen:", err);
                }).finally(() => {
                    if (actionsPanel && originalActionsDisplay !== null) actionsPanel.style.display = originalActionsDisplay;
                    cardElement.style.transform = originalTransform;
                    cardElement.style.boxShadow = originalBoxShadow;
                });
            });
        }

        cardElement.addEventListener('click', (event) => {
            if (event.target.closest('button')) return; // No abrir modal si se hace clic en un botón de la tarjeta
            openModal(cardElement);
        });
        cardElement.addEventListener('keydown', (event) => { // Abrir modal con Enter/Espacio
            if ((event.key === 'Enter' || event.key === ' ') && !event.target.closest('button')) {
                event.preventDefault();
                openModal(cardElement);
            }
        });
    }
    
    // --- LÓGICA DE LA MODAL DE VISUALIZACIÓN DE FRASE ---
    function openModal(originalCardElement) {
        const clonedCard = originalCardElement.cloneNode(true);
        activeModalCardInstance = clonedCard; // Guardar referencia a la instancia en el modal
        clonedCard.dataset.currentThemeIndex = originalCardElement.dataset.currentThemeIndex;
        
        // Asegurar que el tema actual se aplique correctamente
        themes.forEach(themeClass => clonedCard.classList.remove(themeClass));
        clonedCard.classList.add(themes[parseInt(originalCardElement.dataset.currentThemeIndex, 10)]);

        const originalActionsInClone = clonedCard.querySelector('.card-actions');
        if (originalActionsInClone) originalActionsInClone.remove(); // Quitar acciones de la tarjeta original

        const quoteExplanationInModal = clonedCard.querySelector('.quote-explanation');
        if (quoteExplanationInModal && quoteExplanationInModal.textContent.trim() !== '') {
            quoteExplanationInModal.classList.add('modal-visible'); // Mostrar explicación por defecto en modal si existe
            quoteExplanationInModal.removeAttribute('hidden');
        }
        
        // Añadir un título para ARIA si no existe
        const quoteTextForTitle = clonedCard.querySelector('.quote-text')?.textContent.substring(0, 50) + "...";
        clonedCard.id = 'modal-card-content'; // Para aria-labelledby si es necesario
        modalOverlay.setAttribute('aria-label', `Detalle de frase: ${quoteTextForTitle}`);


        modalCardPlaceholder.innerHTML = '';
        modalCardPlaceholder.appendChild(clonedCard);
        createModalActionButtons(clonedCard); // Pasar la tarjeta clonada del modal

        document.body.style.overflow = 'hidden';
        modalOverlay.removeAttribute('hidden');
        requestAnimationFrame(() => { // Forzar reflujo para transición
            modalOverlay.classList.add('visible');
        });
        modalCloseBtn.focus(); // Enfocar el botón de cierre primero
    }

    function createModalActionButtons(modalCardInstance) { // Recibe la tarjeta del modal
        modalActionsSidebarContainer.innerHTML = '';
        const cardContentInModal = modalCardInstance.querySelector('.card-content');
        const explanationInModal = modalCardInstance.querySelector('.quote-explanation');

        const downloadBtnModal = document.createElement('button');
        downloadBtnModal.type = 'button';
        downloadBtnModal.innerHTML = '💾';
        downloadBtnModal.title = 'Descargar frase como imagen';
        downloadBtnModal.setAttribute('aria-label', 'Descargar frase como imagen');
        downloadBtnModal.addEventListener('click', () => { 
            modalActionsSidebarContainer.style.visibility = 'hidden'; 
            modalCloseBtn.style.visibility = 'hidden';
            html2canvas(modalCardInstance, { useCORS: true, backgroundColor: null, scale: 2 })
            .then(canvas => {
                const image = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                const author = modalCardInstance.querySelector('.quote-author')?.textContent.replace(/^-/, '').trim() || 'autor';
                const quoteStart = modalCardInstance.querySelector('.quote-text')?.textContent.substring(1, 20).replace(/[^a-zA-Z0-9\s]/g, '').trim().replace(/\s+/g, '_') || 'frase';
                link.download = `frase_modal_${author}_${quoteStart}.png`; 
                link.href = image;
                link.click();
            }).catch(err => {
                console.error("Error al generar la imagen del modal:", err);
            }).finally(() => {
                modalActionsSidebarContainer.style.visibility = 'visible'; 
                modalCloseBtn.style.visibility = 'visible';
            });
        });
        modalActionsSidebarContainer.appendChild(downloadBtnModal);

        const alignTopBtnModal = document.createElement('button');
        alignTopBtnModal.type = 'button';
        alignTopBtnModal.innerHTML = '⬆️';
        alignTopBtnModal.title = 'Alinear texto arriba';
        alignTopBtnModal.setAttribute('aria-label', 'Alinear texto arriba');
        alignTopBtnModal.addEventListener('click', () => {
            alignmentClasses.forEach(cls => cardContentInModal.classList.remove(cls));
            cardContentInModal.classList.add('text-align-top');
        });
        modalActionsSidebarContainer.appendChild(alignTopBtnModal);

        const alignMiddleBtnModal = document.createElement('button');
        alignMiddleBtnModal.type = 'button';
        alignMiddleBtnModal.innerHTML = '↕️';
        alignMiddleBtnModal.title = 'Alinear texto al medio';
        alignMiddleBtnModal.setAttribute('aria-label', 'Alinear texto al medio');
        alignMiddleBtnModal.addEventListener('click', () => {
            alignmentClasses.forEach(cls => cardContentInModal.classList.remove(cls));
            cardContentInModal.classList.add('text-align-middle');
        });
        modalActionsSidebarContainer.appendChild(alignMiddleBtnModal);

        const alignBottomBtnModal = document.createElement('button');
        alignBottomBtnModal.type = 'button';
        alignBottomBtnModal.innerHTML = '⬇️';
        alignBottomBtnModal.title = 'Alinear texto abajo';
        alignBottomBtnModal.setAttribute('aria-label', 'Alinear texto abajo');
        alignBottomBtnModal.addEventListener('click', () => {
            alignmentClasses.forEach(cls => cardContentInModal.classList.remove(cls));
            cardContentInModal.classList.add('text-align-bottom');
        });
        modalActionsSidebarContainer.appendChild(alignBottomBtnModal);
        
        if (explanationInModal && explanationInModal.textContent.trim() !== '') {
            const toggleDescBtnModal = document.createElement('button');
            toggleDescBtnModal.type = 'button';
            let isExplanationVisibleInModal = explanationInModal.classList.contains('modal-visible');
            
            const updateToggleDescButton = () => {
                isExplanationVisibleInModal = explanationInModal.classList.contains('modal-visible');
                toggleDescBtnModal.innerHTML = isExplanationVisibleInModal ? '👁️' : '📖';
                toggleDescBtnModal.title = isExplanationVisibleInModal ? 'Ocultar descripción' : 'Mostrar descripción';
                toggleDescBtnModal.setAttribute('aria-label', isExplanationVisibleInModal ? 'Ocultar descripción de la frase' : 'Mostrar descripción de la frase');
                toggleDescBtnModal.setAttribute('aria-pressed', isExplanationVisibleInModal);
            };
            
            updateToggleDescButton(); // Estado inicial

            toggleDescBtnModal.addEventListener('click', () => {
                explanationInModal.classList.toggle('modal-visible');
                updateToggleDescButton();
            });
            modalActionsSidebarContainer.appendChild(toggleDescBtnModal);
        }


        const changeThemeBtnModal = document.createElement('button');
        changeThemeBtnModal.type = 'button';
        changeThemeBtnModal.innerHTML = '🎨';
        changeThemeBtnModal.title = 'Cambiar diseño de la tarjeta';
        changeThemeBtnModal.setAttribute('aria-label', 'Cambiar diseño de la tarjeta');
        changeThemeBtnModal.addEventListener('click', () => {
            if (!modalCardInstance || typeof modalCardInstance.dataset.currentThemeIndex === 'undefined') return;
            let currentThemeIndex = parseInt(modalCardInstance.dataset.currentThemeIndex, 10);
            modalCardInstance.classList.remove(themes[currentThemeIndex]);
            currentThemeIndex = (currentThemeIndex + 1) % themes.length;
            modalCardInstance.classList.add(themes[currentThemeIndex]);
            modalCardInstance.dataset.currentThemeIndex = currentThemeIndex;
        });
        modalActionsSidebarContainer.appendChild(changeThemeBtnModal);
    }

    function closeModal() {
        modalOverlay.classList.remove('visible');
        
        const onTransitionEnd = (event) => {
            if (event.target === modalOverlay && event.propertyName === 'opacity') { // Asegurarse que es la transición del overlay
                modalOverlay.setAttribute('hidden', 'true');
                if (modalCardPlaceholder) modalCardPlaceholder.innerHTML = '';
                if (modalActionsSidebarContainer) modalActionsSidebarContainer.innerHTML = '';
                activeModalCardInstance = null; // Limpiar referencia
                document.body.style.overflow = 'auto'; // O ''
                modalOverlay.removeEventListener('transitionend', onTransitionEnd);
                // Devolver el foco al elemento que abrió el modal, si se guardó la referencia
            }
        };
        modalOverlay.addEventListener('transitionend', onTransitionEnd);

        // Fallback por si la transición no se dispara o es muy corta
        setTimeout(() => {
            if (modalOverlay && !modalOverlay.classList.contains('visible') && !modalOverlay.hasAttribute('hidden')) {
                 modalOverlay.setAttribute('hidden', 'true');
                 if (modalCardPlaceholder) modalCardPlaceholder.innerHTML = '';
                 if (modalActionsSidebarContainer) modalActionsSidebarContainer.innerHTML = '';
                 document.body.style.overflow = 'auto';
            }
        }, 350); // Un poco más que la duración de la transición de opacidad
    }

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (event) => {
            // Cerrar si se hace clic directamente en el overlay (no en sus hijos)
            if (event.target === modalOverlay && modalOverlay.classList.contains('visible')) {
                closeModal();
            }
        });
    }
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('visible')) {
            closeModal();
        }
    });

    // --- LÓGICA DE FILTROS FACETADOS ---
    function populateFilterOptions() {
        const authorTypes = new Set();
        const occasions = new Set();
        const styles = new Set();

        allQuotesData.forEach(quote => {
            if (quote.authorType) authorTypes.add(quote.authorType);
            if (quote.occasion) occasions.add(quote.occasion);
            if (quote.style) styles.add(quote.style);
        });

        const populateSelect = (selectElement, optionsSet) => {
            // Guardar la opción "Todos"
            const firstOption = selectElement.options[0];
            selectElement.innerHTML = ''; // Limpiar opciones previas
            selectElement.appendChild(firstOption); // Re-añadir "Todos"

            optionsSet.forEach(optionValue => {
                const option = document.createElement('option');
                option.value = optionValue;
                option.textContent = optionValue;
                selectElement.appendChild(option);
            });
        };

        if (filterAuthorType) populateSelect(filterAuthorType, authorTypes);
        if (filterOccasion) populateSelect(filterOccasion, occasions);
        if (filterStyle) populateSelect(filterStyle, styles);
    }
    
    function resetAllFilters() {
        if (searchPhrasesInput) searchPhrasesInput.value = '';
        if (filterAuthorType) filterAuthorType.value = '';
        if (filterOccasion) filterOccasion.value = '';
        if (filterStyle) filterStyle.value = '';
        currentFilters = { authorType: '', occasion: '', style: ''};
        applySearchAndFilters(currentCategoryIdGlobal === 'all-global-search', globalSearchInput.value || ''); // Reaplicar búsqueda/filtros
    }

    if (resetFiltersButton) {
        resetFiltersButton.addEventListener('click', resetAllFilters);
    }

    [filterAuthorType, filterOccasion, filterStyle].forEach(select => {
        if (select) {
            select.addEventListener('change', (event) => {
                currentFilters[event.target.id.replace('filter-', '')] = event.target.value;
                applySearchAndFilters(currentCategoryIdGlobal === 'all-global-search', globalSearchInput.value || '');
            });
        }
    });


    // --- LÓGICA DE VISUALIZACIÓN DE CATEGORÍAS Y FILTROS ---
    function renderQuotes(quotesToRender) {
        if (!cardsContainerDynamic) return;
        cardsContainerDynamic.innerHTML = ''; 
        if (quotesToRender.length === 0) {
            cardsContainerDynamic.innerHTML = '<p class="col-span-full text-center text-gray-600 py-8">No se encontraron frases que coincidan con tu búsqueda o filtros.</p>';
            return;
        }
        quotesToRender.forEach((quote, index) => {
            const cardElement = createQuoteCardElement(quote, index);
            cardsContainerDynamic.appendChild(cardElement);
            initializeCardFunctionality(cardElement);
            
            // Animación de entrada escalonada
            setTimeout(() => {
                cardElement.style.transition = `opacity 0.4s ease-out ${index * 0.05}s, transform 0.4s ease-out ${index * 0.05}s`;
                cardElement.classList.add('visible');
            }, 50); // Pequeño delay inicial para asegurar que las transiciones se apliquen después del renderizado
        });
    }

    function applySearchAndFilters(isGlobalSearch = false, globalSearchTerm = '') {
        let quotesToShow;
        let searchTerm = '';

        if (isGlobalSearch) {
            quotesToShow = [...allQuotesData]; 
            searchTerm = globalSearchTerm.toLowerCase().trim();
        } else {
            if (!currentCategoryIdGlobal || currentCategoryIdGlobal === 'all' || currentCategoryIdGlobal === 'all-categories-page') {
                 quotesToShow = [...allQuotesData];
            } else {
                quotesToShow = allQuotesData.filter(quote => quote.categories.includes(currentCategoryIdGlobal));
            }
            if (searchPhrasesInput) { 
                searchTerm = searchPhrasesInput.value.toLowerCase().trim();
            }
        }
        
        // Aplicar búsqueda por texto
        if (searchTerm) {
            quotesToShow = quotesToShow.filter(quote => 
                quote.text.toLowerCase().includes(searchTerm) || 
                quote.author.toLowerCase().includes(searchTerm) ||
                (quote.explanation && quote.explanation.toLowerCase().includes(searchTerm))
            );
        }

        // Aplicar filtros facetados
        if (currentFilters.authorType) {
            quotesToShow = quotesToShow.filter(quote => quote.authorType === currentFilters.authorType);
        }
        if (currentFilters.occasion) {
            quotesToShow = quotesToShow.filter(quote => quote.occasion === currentFilters.occasion);
        }
        if (currentFilters.style) {
            quotesToShow = quotesToShow.filter(quote => quote.style === currentFilters.style);
        }

        renderQuotes(quotesToShow);
    }

    function displayQuotesForCategory(categoryId, categoryName) {
        currentCategoryIdGlobal = categoryId; 
        currentCategoryNameGlobal = categoryName;

        // Ocultar página de "Explorar Todo" y mostrar área de contenido principal
        if (exploreAllCategoriesPage) exploreAllCategoriesPage.classList.add('hidden');
        if (mainContentArea) mainContentArea.classList.remove('hidden');


        if (categoryWelcomeMessage) categoryWelcomeMessage.style.display = 'none';
        if (categoryViewContainer) categoryViewContainer.classList.remove('hidden');

        // Resetear filtros al cambiar de categoría (excepto si es una vista "all")
        if (categoryId !== 'all' && categoryId !== 'all-global-search') {
             if (searchPhrasesInput) searchPhrasesInput.value = ''; 
             // No reseteamos los filtros facetados aquí, para que se mantengan si el usuario navega entre categorías
             // resetAllFilters(); // Descomentar si se desea resetear todos los filtros al cambiar categoría
        }


        if (categoryTitleElement) categoryTitleElement.textContent = categoryName;
        updateBreadcrumb(categoryName);
        updateActiveLinkStates(categoryId);
        
        applySearchAndFilters();
        
        closeMobileMenu(); 
        if (megaMenuPanelCategorias && megaMenuPanelCategorias.classList.contains('visible')) {
            megaMenuPanelCategorias.classList.remove('visible');
            if (categoriasMenuButton) categoriasMenuButton.setAttribute('aria-expanded', 'false');
        }
        window.scrollTo({ top: 0, behavior: 'smooth' }); 
    }
    
    // --- ACTUALIZAR BREADCRUMB Y ENLACES ACTIVOS ---
    function updateBreadcrumb(categoryName = null) {
        breadcrumbOl.innerHTML = ''; // Limpiar
        const inicioLi = document.createElement('li');
        inicioLi.className = 'flex items-center';
        const inicioLink = document.createElement('a');
        inicioLink.href = '#'; 
        inicioLink.id = 'breadcrumb-inicio-dynamic'; // ID para poder añadir listener
        inicioLink.className = 'hover:text-indigo-600 hover:underline';
        inicioLink.textContent = 'Inicio';
        inicioLink.addEventListener('click', (e) => { e.preventDefault(); showHomePageView(); });
        inicioLi.appendChild(inicioLink);
        breadcrumbOl.appendChild(inicioLi);

        if (categoryName && categoryName !== 'Bienvenido a LogoFrases') {
            const separatorLi = document.createElement('li');
            separatorLi.className = 'flex items-center';
            separatorLi.innerHTML = '<span class="mx-2 text-gray-400">/</span>';
            breadcrumbOl.appendChild(separatorLi);

            const categoryLi = document.createElement('li');
            categoryLi.className = 'flex items-center';
            const categorySpan = document.createElement('span');
            categorySpan.className = 'text-gray-500';
            categorySpan.setAttribute('aria-current', 'page');
            categorySpan.textContent = categoryName;
            categoryLi.appendChild(categorySpan);
            breadcrumbOl.appendChild(categoryLi);
        }
    }

    function updateActiveLinkStates(activeCategoryId = null) {
        document.querySelectorAll('.category-link, #explore-all-link-header, #explore-all-link-mobile, #footer-explore-all-link').forEach(link => {
            link.classList.remove('active-link');
            if (activeCategoryId) {
                if (link.dataset.categoryId === activeCategoryId || 
                    (activeCategoryId === 'all-categories-page' && link.href.includes('#explore-all-categories-page'))) {
                    link.classList.add('active-link');
                }
            }
        });
        // Para el logo/inicio, no se marca como activo a menos que sea la vista de inicio
        if (!activeCategoryId || activeCategoryId === 'home') {
            // No hay un 'active' para el logo, pero sí para el breadcrumb de inicio
            if(breadcrumbInicioLink) breadcrumbInicioLink.classList.add('active-link');
        } else {
            if(breadcrumbInicioLink) breadcrumbInicioLink.classList.remove('active-link');
        }
    }


    // Event listener para la búsqueda dentro de la categoría (tiempo real)
    if (searchPhrasesInput) {
        searchPhrasesInput.addEventListener('input', () => applySearchAndFilters(false));
    }
    
    function handleGlobalSearch(event) {
        event.preventDefault();
        const searchTerm = event.target.closest('form').querySelector('input[type="search"]').value;
        
        if (searchTerm.trim() === '') {
            showHomePageView(); 
            return;
        }
        currentCategoryIdGlobal = 'all-global-search'; 
        currentCategoryNameGlobal = `Resultados para: "${searchTerm}"`;
        
        // Ocultar "Explorar Todo" y mostrar contenido principal
        if (exploreAllCategoriesPage) exploreAllCategoriesPage.classList.add('hidden');
        if (mainContentArea) mainContentArea.classList.remove('hidden');

        if (categoryWelcomeMessage) categoryWelcomeMessage.style.display = 'none';
        if (categoryViewContainer) categoryViewContainer.classList.remove('hidden');
        if (searchPhrasesInput) searchPhrasesInput.value = ''; // Limpiar filtro de categoría interna

        if (categoryTitleElement) categoryTitleElement.textContent = currentCategoryNameGlobal;
        updateBreadcrumb(currentCategoryNameGlobal);
        updateActiveLinkStates('all-global-search'); // O un ID específico para búsqueda global
        
        applySearchAndFilters(true, searchTerm); // isGlobalSearch = true
        closeMobileMenu();
        if (megaMenuPanelCategorias && megaMenuPanelCategorias.classList.contains('visible')) {
            megaMenuPanelCategorias.classList.remove('visible');
            if(categoriasMenuButton) categoriasMenuButton.setAttribute('aria-expanded', 'false');
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (globalSearchForm) globalSearchForm.addEventListener('submit', handleGlobalSearch);
    if (mobileSearchForm) mobileSearchForm.addEventListener('submit', handleGlobalSearch);


    // --- VISTA INICIAL Y NAVEGACIÓN ---
    function showHomePageView() {
        currentCategoryIdGlobal = 'home'; 
        currentCategoryNameGlobal = 'Bienvenido a LogoFrases';

        if (exploreAllCategoriesPage) exploreAllCategoriesPage.classList.add('hidden');
        if (mainContentArea) mainContentArea.classList.remove('hidden');


        if (categoryWelcomeMessage) categoryWelcomeMessage.style.display = 'block';
        if (categoryViewContainer) categoryViewContainer.classList.add('hidden');
        if (cardsContainerDynamic) cardsContainerDynamic.innerHTML = ''; // Limpiar tarjetas
        if (categoryTitleElement) categoryTitleElement.textContent = currentCategoryNameGlobal;
        
        if (globalSearchInput) globalSearchInput.value = ''; 
        if (mobileSearchInput) mobileSearchInput.value = '';
        resetAllFilters(); // Resetea filtros, incluyendo searchPhrasesInput

        updateBreadcrumb(); // Solo muestra "Inicio"
        updateActiveLinkStates('home');
        
        closeMobileMenu();
        if (megaMenuPanelCategorias && megaMenuPanelCategorias.classList.contains('visible')) {
            megaMenuPanelCategorias.classList.remove('visible');
             if(categoriasMenuButton) categoriasMenuButton.setAttribute('aria-expanded', 'false');
        }
         window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // --- PÁGINA "EXPLORAR TODAS LAS CATEGORÍAS" ---
    function generateExploreAllCategoriesContent() {
        if (!allCategoriesContentList) return;
        allCategoriesContentList.innerHTML = ''; // Limpiar contenido previo

        const mainCategories = {};
        // Agrupar subcategorías bajo categorías principales
        document.querySelectorAll('.mega-menu-column').forEach(column => {
            const mainCatTitleElement = column.querySelector('h3');
            if (mainCatTitleElement) {
                const mainCatTitle = mainCatTitleElement.textContent.trim();
                mainCategories[mainCatTitle] = [];
                column.querySelectorAll('ul li a.category-link').forEach(link => {
                    mainCategories[mainCatTitle].push({
                        id: link.dataset.categoryId,
                        name: link.dataset.categoryName || link.textContent.trim()
                    });
                });
            }
        });
        // Añadir enlaces directos si es necesario (Frase del día, Recomendaciones)
        // mainCategories["Otros Enlaces"] = [
        //     { id: "frase-del-dia", name: "Frase del Día"},
        //     { id: "recomendaciones", name: "Recomendaciones"}
        // ];


        for (const mainCategory in mainCategories) {
            if (mainCategories[mainCategory].length > 0) {
                const sectionDiv = document.createElement('div');
                sectionDiv.className = 'mb-4';

                const titleH3 = document.createElement('h3');
                titleH3.className = 'all-categories-main-title text-xl font-semibold text-gray-700 mb-2';
                titleH3.textContent = mainCategory;
                sectionDiv.appendChild(titleH3);

                const ul = document.createElement('ul');
                ul.className = 'all-categories-sublist list-disc pl-5 space-y-1';
                mainCategories[mainCategory].forEach(subCat => {
                    const li = document.createElement('li');
                    const anchor = document.createElement('a');
                    anchor.href = '#'; // O una URL real si la estructura lo permite
                    anchor.dataset.categoryId = subCat.id;
                    anchor.dataset.categoryName = subCat.name;
                    anchor.className = 'category-link text-gray-600 hover:text-indigo-600 hover:underline';
                    anchor.textContent = subCat.name;
                    anchor.addEventListener('click', (e) => { // Re-adjuntar listeners
                        e.preventDefault();
                        displayQuotesForCategory(subCat.id, subCat.name);
                    });
                    li.appendChild(anchor);
                    ul.appendChild(li);
                });
                sectionDiv.appendChild(ul);
                allCategoriesContentList.appendChild(sectionDiv);
            }
        }
    }
    
    function showExploreAllCategoriesPage() {
        currentCategoryIdGlobal = 'all-categories-page';
        currentCategoryNameGlobal = 'Explorar Todas las Categorías';

        if (mainContentArea) mainContentArea.classList.add('hidden');
        if (exploreAllCategoriesPage) exploreAllCategoriesPage.classList.remove('hidden');
        
        if (categoryTitleElement) categoryTitleElement.textContent = currentCategoryNameGlobal; // O el h1 de la nueva sección
        document.querySelector('#explore-all-categories-page h1').textContent = currentCategoryNameGlobal;


        updateBreadcrumb(currentCategoryNameGlobal);
        updateActiveLinkStates('all-categories-page');

        closeMobileMenu();
        if (megaMenuPanelCategorias && megaMenuPanelCategorias.classList.contains('visible')) {
            megaMenuPanelCategorias.classList.remove('visible');
            if(categoriasMenuButton) categoriasMenuButton.setAttribute('aria-expanded', 'false');
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (exploreAllLinkHeader) exploreAllLinkHeader.addEventListener('click', (e) => { e.preventDefault(); showExploreAllCategoriesPage(); });
    if (exploreAllLinkMobile) exploreAllLinkMobile.addEventListener('click', (e) => { e.preventDefault(); showExploreAllCategoriesPage(); });
    if (footerExploreAllLink) footerExploreAllLink.addEventListener('click', (e) => { e.preventDefault(); showExploreAllCategoriesPage(); });


    // Event listeners para los enlaces de categoría (se mantienen, pero ahora también dentro de "Explorar Todo")
    // Es mejor delegar o re-adjuntar si el contenido es dinámico. Por ahora, re-adjuntamos en `generateExploreAllCategoriesContent`
    // y mantenemos el original para los menús.
    document.querySelectorAll('.category-link').forEach(link => {
        // Evitar doble listener si ya se añadió en generateExploreAllCategoriesContent
        if (!link.href.includes('#explore-all-categories-page')) { // Chequeo simple para evitar duplicados
            link.addEventListener('click', (event) => {
                event.preventDefault();
                // No navegar si es un enlace de la página "Explorar Todo" ya que tienen su propio listener
                if(event.target.closest('#all-categories-content-list')) return;

                const categoryId = link.dataset.categoryId;
                const categoryName = link.dataset.categoryName || link.textContent.trim(); 
                if (categoryId) {
                    displayQuotesForCategory(categoryId, categoryName);
                }
            });
        }
    });

    // Event listeners para el logo y el enlace de inicio en el breadcrumb
    if (breadcrumbInicioLink) { // El estático inicial
        breadcrumbInicioLink.addEventListener('click', (e) => { e.preventDefault(); showHomePageView(); });
    }
    homeLogoLinks.forEach(link => { // Todos los logos
        link.addEventListener('click', (event) => {
            event.preventDefault();
            showHomePageView();
        });
    });
    
    // --- INICIALIZACIÓN ---
    populateFilterOptions(); // Llenar los selects de filtros facetados
    generateExploreAllCategoriesContent(); // Generar contenido de "Explorar Todo"
    showHomePageView(); // Mostrar la vista de bienvenida al cargar.

    // Actualizar año en el footer
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
});