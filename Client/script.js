import { io } from 'socket.io-client'

const form = document.getElementById("formId")
const { io } = require("socket.io-client")
const socket = io('http://localhost:3000')

form.addEventListener("submit", e => {
  // Prevent the default form submission behavior
  e.preventDefault()

  // Get the form data
  const formData = [...new FormData(form)]

  console.log(formData)

})

socket.on("connect", () => {
  console.log(`Você conectou com o id: ${socket.id}`)
}) 

function displayPosition(position) {
  const div = document.createElement("div")
  div.textContent = position
  document.form.append(div)
}