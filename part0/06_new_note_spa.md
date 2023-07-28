sequenceDiagram
    participant browser
    participant server
    Note right of browser: User types out a note and clicks the save button
    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    Note right of browser: Sends the following to the server:  <br>Content-type: application/json <br>{ content: "My note", date: new Date() }
    activate server
    server-->>browser: 201 Created
    Note left of server: Browser executes event handler to render new note, logs `{"message":"note created"}` to the console.
    deactivate server
