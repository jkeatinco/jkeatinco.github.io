document.querySelectorAll('.modal-link').forEach(function(element) {
    element.addEventListener('click', function() {
        var buttonId = this.getAttribute('id');
        var modalContainer = document.getElementById('modal-container');
        modalContainer.className = '';
        modalContainer.classList.add(buttonId);
        document.body.classList.add('modal-active');
    });
});

document.getElementById('modal-container').addEventListener('click', function() {
    this.classList.add('out');
    document.body.classList.remove('modal-active');
});

document.getElementById('found-items-modal').addEventListener('click', function() {
    this.classList.add('out');
    document.body.classList.remove('modal-active');
});