sequenceDiagram
    participant browser
    participant server


    Note right of browser: User types a note into the form field and clicks "Save"

    browser-->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note

    Note right of browser: Sends the following to the server:  <br>{ content: "My note", date: new Date() }
    activate server
    server-->>browser: Redirects to https://studies.cs.helsinki.fi/exampleapp/notes
    deactivate server
        browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/notes
    activate server
    server-->>browser: HTML document
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: the css file
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
    activate server
    server-->>browser: the JavaScript file
    deactivate server

    Note right of browser: The browser starts executing the JavaScript code that fetches the JSON from the server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: [{ "content": "HTML is easy", "date": "2023-1-1" }, ... ]
    deactivate server

    Note right of browser: The browser executes the callback function that renders the notes