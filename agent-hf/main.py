from pyscript import document

def say_hello(event):
    output = document.querySelector("#output")
    output.innerHTML = "Hello from Python!"