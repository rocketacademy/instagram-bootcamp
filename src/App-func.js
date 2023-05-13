import React from 'react'
import { useState } from 'react'

const App = () => {

	const [messageInput, setMessageInput] = useState("")
	const [messages, setMessages] = useState([])
	const [uid, setUid] = useState("")
	const [fileInputFile, setFileInputFile] = useState(null)


	const handleChange = (e) => {
		setMessageInput(messageInput)
	}
	const submitMsg = (e) => {
		e.preventDefault()
		setMessages(
			messages.push(messageInput)
			/* messages.map((messageInput) => (
				<div>
					<li key={messageInput.key}>{messageInput.val}</li>
				</div>
			)
			) */
		)
	}
	console.log(messageInput, messages)

	return (
		<div>
			<form>
				<input
					id="messageInput"
					type="text"
					placeholder="Type your message here"
					name="message"
					onChange={handleChange}
					value={messageInput}
				/>

			</form>
			<button onClick={submitMsg}>Submit</button>
			<br />

		</div>
	)
}
export default App;