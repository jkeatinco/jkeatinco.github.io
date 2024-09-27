document.addEventListener('DOMContentLoaded', () => {
    // Fetch and load button.svg, card.svg, navigation.svg, and image.svg content first
    Promise.all([
        fetch('components/button.svg').then(response => response.text()),
        fetch('components/card.svg').then(response => response.text()),
        fetch('components/navigation.svg').then(response => response.text()),
        fetch('components/image.svg').then(response => response.text()),
        fetch('components/table.svg').then(response => response.text())
    ])
    .then(([buttonSvgContent, cardSvgContent, navigationSvgContent, imageSvgContent, tableSvgContent]) => {
        // Insert the fetched SVG content into all elements with the respective class names
        document.querySelectorAll('.button-container-svg').forEach(element => {
            const buttonText = element.getAttribute('data-button-text') || 'Click Me';
            const customizedButtonSvgContent = buttonSvgContent.replace('Click Me', buttonText);
            element.innerHTML = customizedButtonSvgContent;
        });
        document.querySelectorAll('.card-container-svg').forEach(element => {
            const cardTitle = element.getAttribute('data-card-title') || 'Card Title';
            const cardContent = element.getAttribute('data-card-content') || 'Card Content';
            let customizedCardSvgContent = cardSvgContent.replace('Card Title', cardTitle);
            customizedCardSvgContent = customizedCardSvgContent.replace('Card Content', cardContent);
            element.innerHTML = customizedCardSvgContent;
        });
        document.querySelectorAll('.nav-container-svg').forEach(element => {
            element.innerHTML = navigationSvgContent;
        });
        document.querySelectorAll('.image-container-svg').forEach(element => {
            element.innerHTML = imageSvgContent;

            // Get the data-img-link attribute value
            const imgLink = element.getAttribute('data-img-link');
            if (imgLink) {
                // Set the src attribute of the img element inside the image.svg content
                const imgElement = element.querySelector('.svg-image');
                if (imgElement) {
                    imgElement.setAttribute('src', imgLink);
                }
            }
        });

        document.querySelectorAll('.table-container-svg').forEach(element => {
            element.innerHTML = tableSvgContent;
        });

        // Add click event listeners to elements with data-link attribute
        document.querySelectorAll('[data-link]').forEach(element => {
            element.addEventListener('click', () => {
                const link = element.getAttribute('data-link');
                if (link) {
                    window.location.href = link;
                }
            });
        });

        // Hamburger menu toggle
        const hamburgerMenu = document.querySelector('.hamburger-menu');
        const navItems = document.querySelector('.nav-items');

        if (hamburgerMenu && navItems) {
            hamburgerMenu.addEventListener('click', () => {
                navItems.classList.toggle('active');
                adjustNavSVGSize(); // Adjust size after toggling
            });
        }

        // Proceed with the rest of the logic after the SVG is loaded
        const container = document.querySelector('.container');
        const foreignContent = document.getElementById('foreign-content');
        const svgContainer = document.getElementById('svg-container');
        const svg = svgContainer.querySelector('svg');

        if (!container) {
            console.error('Container element not found!');
            return;
        }

        // Function to adjust the height of the SVG and foreignObject based on .container
        function adjustSVGSize() {
            // Use getBoundingClientRect to get accurate height of .container
            const containerHeight = container.getBoundingClientRect().height;
            if (containerHeight > 0) {
                foreignContent.setAttribute('height', containerHeight);
                svg.setAttribute('height', containerHeight);
                svgContainer.style.height = `${containerHeight}px`;
            }
        }

        // Function to adjust the height of the SVG and foreignObject based on .button-container-svg
        function adjustButtonSVGSize() {
            document.querySelectorAll('.button-container-svg').forEach(buttonContainerSvg => {
                const svgButtonContainer = buttonContainerSvg.querySelector('svg');
                const foreignContentButton = buttonContainerSvg.querySelector('.foreign-content-button');
                if (svgButtonContainer && foreignContentButton) {
                    const buttonContainer = buttonContainerSvg.querySelector('.button-container');
                    if (buttonContainer) {
                        const buttonContainerHeight = buttonContainer.getBoundingClientRect().height;
                        if (buttonContainerHeight > 0) {
                            foreignContentButton.setAttribute('height', buttonContainerHeight);
                            svgButtonContainer.setAttribute('height', buttonContainerHeight);
                        }
                    }
                }
            });
        }

        // Function to adjust the height of the SVG and foreignObject based on .card-container-svg
        function adjustCardSVGSize() {
            document.querySelectorAll('.card-container-svg').forEach(cardContainerSvg => {
                const svgCardContainer = cardContainerSvg.querySelector('svg');
                const foreignContentCard = cardContainerSvg.querySelector('.foreign-content-card');
                if (svgCardContainer && foreignContentCard) {
                    const cardContainer = cardContainerSvg.querySelector('.card-container');
                    if (cardContainer) {
                        const cardContainerHeight = cardContainer.getBoundingClientRect().height;
                        if (cardContainerHeight > 0) {
                            foreignContentCard.setAttribute('height', cardContainerHeight);
                            svgCardContainer.setAttribute('height', cardContainerHeight);
                        }
                    }
                }
            });
        }

        // Function to adjust the height of the SVG and foreignObject based on .nav-container-svg
        function adjustNavSVGSize() {
            document.querySelectorAll('.nav-container-svg').forEach(navContainerSvg => {
                const svgNavContainer = navContainerSvg.querySelector('svg');
                const foreignContentNav = navContainerSvg.querySelector('.foreign-content-nav');
                if (svgNavContainer && foreignContentNav) {
                    const navContainer = navContainerSvg.querySelector('.nav-container');
                    if (navContainer) {
                        const navContainerHeight = navContainer.getBoundingClientRect().height;
                        const navItemsHeight = navItems.classList.contains('active') ? navItems.getBoundingClientRect().height : 0;
                        const totalHeight = navContainerHeight + navItemsHeight;
                        if (totalHeight > 0) {
                            foreignContentNav.setAttribute('height', totalHeight);
                            svgNavContainer.setAttribute('height', totalHeight);
                            navContainerSvg.style.height = `${totalHeight}px`;
                        }
                    }
                }
            });
        }

        // Function to adjust the height of the SVG and foreignObject based on .image-container-svg
        function adjustImageSVGSize() {
            document.querySelectorAll('.image-container-svg').forEach(imageContainerSvg => {
                const svgImageContainer = imageContainerSvg.querySelector('svg');
                const foreignContentImage = imageContainerSvg.querySelector('.foreign-content-image');
                if (svgImageContainer && foreignContentImage) {
                    const imageContainer = imageContainerSvg.querySelector('.image-container');
                    if (imageContainer) {
                        const imageContainerHeight = imageContainer.getBoundingClientRect().height;
                        if (imageContainerHeight > 0) {
                            foreignContentImage.setAttribute('height', imageContainerHeight);
                            svgImageContainer.setAttribute('height', imageContainerHeight);
                        }
                    }
                }
            });
        }

         // Function to adjust the height of the SVG and foreignObject based on .table-container-svg
         function adjustTableSVGSize() {
            document.querySelectorAll('.table-container-svg').forEach(tableContainerSvg => {
                const tableHeight = tableContainerSvg.getBoundingClientRect().height;
                if (tableHeight > 0) {
                    tableContainerSvg.querySelector('svg').setAttribute('height', tableHeight);
                }
            });
        }

        // Initial adjustment using requestAnimationFrame to ensure content is rendered
        requestAnimationFrame(() => {
            adjustSVGSize();
            adjustButtonSVGSize();
            adjustCardSVGSize();
            adjustNavSVGSize();
            adjustImageSVGSize();
            adjustTableSVGSize();
        });

        // Adjust on window resize with debounce
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                adjustSVGSize();
                adjustButtonSVGSize();
                adjustCardSVGSize();
                adjustNavSVGSize();
                adjustImageSVGSize();
                adjustTableSVGSize();
            }, 100);
        });

        // Use ResizeObserver to detect .container size changes
        if (typeof ResizeObserver !== 'undefined') {
            const resizeObserver = new ResizeObserver(adjustSVGSize);
            resizeObserver.observe(container);

            document.querySelectorAll('.button-container-svg').forEach(buttonContainerSvg => {
                const buttonContainer = buttonContainerSvg.querySelector('.button-container');
                if (buttonContainer) {
                    const buttonResizeObserver = new ResizeObserver(adjustButtonSVGSize);
                    buttonResizeObserver.observe(buttonContainer);
                }
            });
            document.querySelectorAll('.card-container-svg').forEach(cardContainerSvg => {
                const cardContainer = cardContainerSvg.querySelector('.card-container');
                if (cardContainer) {
                    const cardResizeObserver = new ResizeObserver(adjustCardSVGSize);
                    cardResizeObserver.observe(cardContainer);
                }
            });
            document.querySelectorAll('.nav-container-svg').forEach(navContainerSvg => {
                const navContainer = navContainerSvg.querySelector('.nav-container');
                if (navContainer) {
                    const navResizeObserver = new ResizeObserver(adjustNavSVGSize);
                    navResizeObserver.observe(navContainer);
                }
            });
            document.querySelectorAll('.image-container-svg').forEach(imageContainerSvg => {
                const imageContainer = imageContainerSvg.querySelector('.image-container');
                if (imageContainer) {
                    const imageResizeObserver = new ResizeObserver(adjustImageSVGSize);
                    imageResizeObserver.observe(imageContainer);
                }
            });
            document.querySelectorAll('.table-container-svg').forEach(tableContainerSvg => {
                const resizeObserverTable = new ResizeObserver(adjustTableSVGSize);
                resizeObserverTable.observe(tableContainerSvg);
            });
        } else {
            // Fallback for browsers without ResizeObserver
            window.addEventListener('resize', adjustSVGSize);
            window.addEventListener('resize', adjustButtonSVGSize);
            window.addEventListener('resize', adjustCardSVGSize);
            window.addEventListener('resize', adjustNavSVGSize);
            window.addEventListener('resize', adjustImageSVGSize);
            window.addEventListener('resize', adjustTableSVGSize);
        }
    })
    .catch(error => console.error('Error loading SVG:', error));
});