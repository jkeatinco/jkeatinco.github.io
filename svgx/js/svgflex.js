document.addEventListener('DOMContentLoaded', () => {
    // Fetch and load button.svg and card.svg content first
    Promise.all([
        fetch('components/button.svg').then(response => response.text()),
        fetch('components/card.svg').then(response => response.text())
    ])
    .then(([buttonSvgContent, cardSvgContent]) => {
        // Insert the fetched SVG content into all elements with the respective class names
        document.querySelectorAll('.button-container-svg').forEach(element => {
            element.innerHTML = buttonSvgContent;
        });
        document.querySelectorAll('.card-container-svg').forEach(element => {
            element.innerHTML = cardSvgContent;
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
                            buttonContainerSvg.style.height = `${buttonContainerHeight}px`;
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
                            cardContainerSvg.style.height = `${cardContainerHeight}px`;
                        }
                    }
                }
            });
        }

        // Initial adjustment using requestAnimationFrame to ensure content is rendered
        requestAnimationFrame(() => {
            adjustSVGSize();
            adjustButtonSVGSize();
            adjustCardSVGSize();
        });

        // Adjust on window resize with debounce
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                adjustSVGSize();
                adjustButtonSVGSize();
                adjustCardSVGSize();
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
        } else {
            // Fallback for browsers without ResizeObserver
            window.addEventListener('resize', adjustSVGSize);
            window.addEventListener('resize', adjustButtonSVGSize);
            window.addEventListener('resize', adjustCardSVGSize);
        }
    })
    .catch(error => console.error('Error loading SVG:', error));
});