// document.addEventListener('DOMContentLoaded', () => {
//     console.log('SVGFlex framework loaded successfully!');

//     // Initialize svg-button click handlers
//     document.querySelectorAll('svg-button').forEach((button) => {
//         button.addEventListener('click', () => {
//             alert(button.getAttribute('label') + ' button clicked!');
//         });
//     });

//     // Load SVG content into containers
//     const containers = document.querySelectorAll('.svg-card-container');
  
//     fetch('components/card.svg')
//       .then(response => response.text())
//       .then(svgContent => {
//         containers.forEach(container => {
//           container.innerHTML = svgContent;
//         });
//         // Call resize after SVG content is loaded
//         adjustSVGSize();
//       })
//       .catch(error => {
//         console.error('Error fetching SVG:', error);
//         containers.forEach(container => {
//           container.innerHTML = '<p>Failed to load SVG content.</p>';
//         });
//       });
// });

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

            // Proceed with the rest of the logic after the SVG is loaded
            const container = document.querySelector('.container');
            const foreignContent = document.getElementById('foreign-content');
            const svgContainer = document.getElementById('svg-container');
            const svg = svgContainer.querySelector('svg');

            const buttonContainerSvg = document.getElementById('button-container-svg');
            const foreignContentButton = document.getElementById('foreign-content-button');
            const svgButtonContainer = buttonContainerSvg ? buttonContainerSvg.querySelector('svg') : null;

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

            // Function to adjust the height of the SVG and foreignObject based on .button-container
            function adjustButtonSVGSize() {
                if (buttonContainerSvg && svgButtonContainer) {
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
            }

            // Initial adjustment using requestAnimationFrame to ensure content is rendered
            requestAnimationFrame(() => {
                adjustSVGSize();
                adjustButtonSVGSize();
            });

            // Adjust on window resize with debounce
            let resizeTimeout;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    adjustSVGSize();
                    adjustButtonSVGSize();
                }, 100);
            });

            // Load content into card containers
            const cardContainers = document.querySelectorAll('.svg-card-container');
            cardContainers.forEach((card, index) => {
                card.innerHTML = `
                    <h2>Card ${index + 1}</h2>
                    <p>This is some content for card ${index + 1}.</p>
                `;
            });

            // Use ResizeObserver to detect .container size changes
            if (typeof ResizeObserver !== 'undefined') {
                const resizeObserver = new ResizeObserver(adjustSVGSize);
                resizeObserver.observe(container);

                if (buttonContainerSvg) {
                    const buttonContainer = buttonContainerSvg.querySelector('.button-container');
                    if (buttonContainer) {
                        const buttonResizeObserver = new ResizeObserver(adjustButtonSVGSize);
                        buttonResizeObserver.observe(buttonContainer);
                    }
                }
            } else {
                // Fallback for browsers without ResizeObserver
                window.addEventListener('resize', adjustSVGSize);
                window.addEventListener('resize', adjustButtonSVGSize);
            }
        })
        .catch(error => console.error('Error loading SVG:', error));
});
// // Resizing function
// function resizeBodyElements() {
//     const elements = document.querySelectorAll('body .auto-size');
//     elements.forEach(element => {
//         const rect = element.getBoundingClientRect();
//         const maxWidth = rect.width;
//         const maxHeight = rect.height;

//         element.style.width = `${maxWidth}px`;
//         element.style.height = `${maxHeight}px`;

//         console.log(`Element resized: ${element}, Width: ${maxWidth}px, Height: ${maxHeight}px`);
//     });
// }

// // Initial call on window load
// window.addEventListener('load', resizeBodyElements);

// // Resize handler with debouncing
// let resizeTimeout;
// window.addEventListener('resize', () => {
//     clearTimeout(resizeTimeout);
//     resizeTimeout = setTimeout(() => {
//         resizeBodyElements();
//     }, 100);
// });

// // Mutation Observer
// const observer = new MutationObserver(() => {
//     console.log('DOM mutation detected, resizing elements...');
//     requestAnimationFrame(resizeBodyElements);
// });

// // Start observing the body for changes
// observer.observe(document.body, { childList: true, subtree: true });
