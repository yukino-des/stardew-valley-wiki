const form = document.querySelector('#img-form')
const img = document.querySelector('#img')
const outputPath = document.querySelector('#output-path')
const filename = document.querySelector('#filename')
const heightInput = document.querySelector('#height')
const widthInput = document.querySelector('#width')

function loadImage(e) {
    const file = e.target.files[0]
    if (!isImage(file)) {
        alert('Please select an image', false)
        return
    }
    const image = new Image()
    image.src = URL.createObjectURL(file)
    image.onload = function () {
        widthInput.value = this.width
        heightInput.value = this.height
    }
    form.style.display = 'block'
    filename.innerText = file.name
    outputPath.innerText = path.join(os.homedir(), 'yukino-image-resized')
}

function sendImage(e) {
    e.preventDefault()
    const width = widthInput.value
    const height = heightInput.value
    const imagePath = img.files[0].path

    if (!img.files[0]) {
        alert('Please upload an image', false)
        return
    }
    if (width === '' || height === '') {
        alert('Please fill in width and height', false)
        return
    }
    ipcRenderer.send('image:resize', {imagePath, width, height})
}

ipcRenderer.on('image:done', () => {
    alert(`Image resized to ${widthInput.value}x${heightInput.value}`, true)
})

function isImage(file) {
    const acceptedImageType = ['image/gif', 'image/png', 'image/jpeg']
    return file && acceptedImageType.includes(file['type'])
}

function alert(message, ok) {
    Toastify.toast({
        text: message,
        duration: 5000,
        close: false,
        style: {
            background: ok ? 'green' : 'red',
            color: 'white',
            textAlign: 'center'
        }
    })
}

img.addEventListener('change', loadImage)
form.addEventListener('submit', sendImage)